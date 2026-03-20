import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ENEMIES, LOCATIONS, WEAPONS, ARMORS,
  INITIAL_PLAYER, INITIAL_QUESTS, QUESTS,
  DIFFICULTIES, BOSS_PATTERNS, BOSS_ATTACKS,
  getXpToNext, getLevelStats,
} from './gameData';

const SLOT_COUNT = 3;
const SLOT_KEY = (slot) => `vorhaan_save_v1_slot${slot}`;

// ── Slot helpers (exported for UI use) ───────────────────────────────────────
export function readSlot(slot) {
  try {
    const raw = localStorage.getItem(SLOT_KEY(slot));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function writeSlot(slot, data) {
  try { localStorage.setItem(SLOT_KEY(slot), JSON.stringify(data)); } catch {}
}

export function deleteSlot(slot) {
  localStorage.removeItem(SLOT_KEY(slot));
}

export function getAllSlots() {
  return Array.from({ length: SLOT_COUNT }, (_, i) => {
    const data = readSlot(i + 1);
    return {
      slot: i + 1,
      empty: !data,
      player: data?.player ?? null,
      savedAt: data?.savedAt ?? null,
    };
  });
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useGameState() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [player, setPlayer]         = useState(() => JSON.parse(JSON.stringify(INITIAL_PLAYER)));
  const [screen, setScreen]         = useState('title');
  const [battleState, setBattleState] = useState(null);
  const [log, setLog]               = useState([]);
  const [notification, setNotification] = useState(null);
  const [quests, setQuests]         = useState(() => JSON.parse(JSON.stringify(INITIAL_QUESTS)));
  const [difficulty, setDifficulty] = useState('normal');

  // Track latest values for auto-save without stale closure issues
  const saveRef = useRef({ player, quests, log, screen, activeSlot });
  useEffect(() => { saveRef.current = { player, quests, log, screen, activeSlot }; });

  // Auto-save whenever gameplay state changes
  useEffect(() => {
    if (!activeSlot) return;
    if (screen === 'title' || screen === 'gameover' || screen === 'victory') return;
    writeSlot(activeSlot, {
      player,
      quests,
      difficulty,
      log: log.slice(-20),
      savedAt: new Date().toISOString(),
    });
  }, [player, quests, screen, activeSlot, difficulty]);

  const addLog = useCallback((msg, type = 'normal') => {
    setLog(prev => [...prev.slice(-40), { msg, type, id: Date.now() + Math.random() }]);
  }, []);

  const notify = useCallback((msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // ── Slot management ───────────────────────────────────────────────────────
  const loadSlot = useCallback((slot, newGameOpts = null) => {
    const data = readSlot(slot);
    setActiveSlot(slot);
    if (data && !newGameOpts) {
      const p = data.player;
      const restoredPlayer = p.hp <= 0 ? { ...p, hp: p.maxHp } : p;
      setPlayer(restoredPlayer);
      setQuests(data.quests ?? JSON.parse(JSON.stringify(INITIAL_QUESTS)));
      setDifficulty(data.difficulty ?? 'normal');
      setLog(data.log ?? []);
    } else {
      // New game — apply name and difficulty from setup
      const base = JSON.parse(JSON.stringify(INITIAL_PLAYER));
      if (newGameOpts?.name) base.name = newGameOpts.name;
      setPlayer(base);
      setQuests(JSON.parse(JSON.stringify(INITIAL_QUESTS)));
      setDifficulty(newGameOpts?.difficulty ?? 'normal');
      setLog([]);
    }
    setBattleState(null);
    setScreen('explore');
  }, []);

  const eraseSlot = useCallback((slot) => {
    deleteSlot(slot);
    if (activeSlot === slot) {
      setActiveSlot(null);
      setPlayer(JSON.parse(JSON.stringify(INITIAL_PLAYER)));
      setQuests(JSON.parse(JSON.stringify(INITIAL_QUESTS)));
      setDifficulty('normal');
      setLog([]);
      setBattleState(null);
      setScreen('title');
    }
  }, [activeSlot]);

  // Called after beating the game — wipes the winning slot then goes to title
  const clearVictoryAndGoTitle = useCallback(() => {
    if (activeSlot) deleteSlot(activeSlot);
    setActiveSlot(null);
    setPlayer(JSON.parse(JSON.stringify(INITIAL_PLAYER)));
    setQuests(JSON.parse(JSON.stringify(INITIAL_QUESTS)));
    setDifficulty('normal');
    setBattleState(null);
    setLog([]);
    setScreen('title');
  }, [activeSlot]);

  // ── Quest helpers ─────────────────────────────────────────────────────────
  const advanceQuests = useCallback((type, target) => {
    setQuests(prev => prev.map(q => {
      if (q.status !== 'active') return q;
      const def = QUESTS.find(d => d.id === q.id);
      if (!def) return q;
      let hit = false;
      if (def.type === 'kill_any'       && type === 'kill')  hit = true;
      if (def.type === 'kill_enemy'     && type === 'kill'  && def.target === target) hit = true;
      if (def.type === 'visit_location' && type === 'visit' && def.target === target) hit = true;
      if (!hit) return q;
      const newProgress = q.progress + 1;
      if (newProgress >= def.goal) {
        notify(`📜 Quest Complete: ${def.title}!`, 'levelup');
        addLog(`📜 Quest Complete: "${def.title}"! Claim reward at the Tavern.`, 'levelup');
        return { ...q, progress: newProgress, status: 'completed' };
      }
      return { ...q, progress: newProgress };
    }));
  }, [notify, addLog]);

  const claimQuest = useCallback((questId) => {
    const def = QUESTS.find(d => d.id === questId);
    if (!def) return;
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'claimed' } : q));
    setPlayer(p => ({ ...p, gold: p.gold + def.reward.gold, xp: p.xp + def.reward.xp }));
    addLog(`💰 Claimed reward: +${def.reward.gold} Gold, +${def.reward.xp} XP`, 'victory');
    notify(`Reward claimed! +${def.reward.gold}g +${def.reward.xp}xp`, 'success');
  }, [addLog, notify]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const travel = useCallback((locationId) => {
    setPlayer(p => ({ ...p, location: locationId }));
    addLog(`You travel to ${LOCATIONS[locationId].name}.`, 'travel');
    setScreen('explore');
    advanceQuests('visit', locationId);
  }, [addLog, advanceQuests]);

  // ── Battle ────────────────────────────────────────────────────────────────
  const startBattle = useCallback((enemyId) => {
    const base = JSON.parse(JSON.stringify(ENEMIES[enemyId]));
    const diff = DIFFICULTIES[difficulty] ?? DIFFICULTIES.normal;
    const enemy = {
      ...base,
      atk:   Math.round(base.atk   * diff.enemyAtkMult),
      def:   Math.round(base.def   * diff.enemyDefMult),
      hp:    Math.round(base.hp    * diff.enemyHpMult),
      maxHp: Math.round(base.maxHp * diff.enemyHpMult),
      gold:  Math.round(base.gold  * diff.goldMult),
      xp:    Math.round(base.xp    * diff.xpMult),
    };
    setBattleState({
      enemy,
      turn: 'player',
      buffs: { atk: 0, def: 0 },
      round: 1,
      bossPatternIdx: 0,
      bossPhase: 1,
      lastDmg: null,
    });
    setScreen('battle');
    addLog(`⚔️ A ${enemy.name} appears!`, 'danger');
  }, [addLog, difficulty]);

  const playerAttack = useCallback(() => {
    if (!battleState || battleState.turn !== 'player') return;
    const atk = player.atk + player.weapon.atk + battleState.buffs.atk;
    const raw = Math.max(1, atk - battleState.enemy.def + Math.floor(Math.random() * 6) - 2);
    const isCrit = Math.random() < 0.15;
    const finalDmg = isCrit ? Math.floor(raw * 1.75) : raw;
    addLog(`${isCrit ? '💥 Critical! ' : ''}You deal ${finalDmg} damage to ${battleState.enemy.name}.`, isCrit ? 'crit' : 'player');
    setBattleState(prev => {
      const newHp = Math.max(0, prev.enemy.hp - finalDmg);
      const next = { ...prev, enemy: { ...prev.enemy, hp: newHp }, lastDmg: { value: finalDmg, isCrit, target: 'enemy', id: Date.now() } };
      return newHp <= 0 ? { ...next, turn: 'resolved' } : { ...next, turn: 'enemy' };
    });
  }, [battleState, player, addLog]);

  const playerDefend = useCallback(() => {
    if (!battleState || battleState.turn !== 'player') return;
    addLog('🛡️ You take a defensive stance, reducing incoming damage.', 'player');
    setBattleState(prev => ({ ...prev, turn: 'enemy_defend', defendBonus: 10, lastDmg: null }));
  }, [battleState, addLog]);

  const useItem = useCallback((item, inBattle = false) => {
    setPlayer(p => {
      const newInv = [...p.inventory];
      const idx = newInv.findIndex(x => x.id === item.id);
      if (idx === -1) return p;
      newInv.splice(idx, 1);
      let newHp = p.hp;
      if (item.effect === 'heal') {
        const healed = Math.min(item.value, p.maxHp - p.hp);
        newHp = p.hp + healed;
        addLog(`💊 You use ${item.name} and restore ${healed} HP.`, 'heal');
      }
      return { ...p, hp: newHp, inventory: newInv };
    });
    if (inBattle && item.effect === 'buff') {
      setBattleState(prev => prev ? { ...prev, buffs: { ...prev.buffs, atk: prev.buffs.atk + item.value } } : prev);
      addLog(`✨ You use ${item.name}! ATK +${item.value} for this battle.`, 'buff');
    }
    if (inBattle) setBattleState(prev => prev ? { ...prev, turn: 'enemy' } : prev);
  }, [addLog]);

  const enemyAttack = useCallback(() => {
    if (!battleState) return;
    const { enemy } = battleState;
    const isDefending = battleState.turn === 'enemy_defend';
    const defBonus = isDefending ? (battleState.defendBonus || 0) : 0;

    // ── Boss pattern logic ──────────────────────────────────────────────────
    if (enemy.isBoss) {
      const hpPct  = enemy.hp / enemy.maxHp;
      const phase  = hpPct > 0.5 ? 'phase1' : 'phase2';
      const pattern = BOSS_PATTERNS[phase];
      const patIdx  = battleState.bossPatternIdx ?? 0;
      const attackId = pattern[patIdx % pattern.length];
      const attack   = BOSS_ATTACKS[attackId];

      // Phase transition notification
      if (phase === 'phase2' && battleState.bossPhase === 1) {
        addLog(`🌑 The Shadow King enters Phase 2 — his power surges!`, 'danger');
      }

      // Dark Ritual — boss heals, no damage
      if (attackId === 'dark_heal') {
        addLog(attack.log(enemy.name), 'danger');
        setBattleState(prev => ({
          ...prev,
          enemy: { ...prev.enemy, hp: Math.min(prev.enemy.maxHp, prev.enemy.hp + attack.heal) },
          turn: 'player',
          defendBonus: 0,
          round: (prev.round || 1) + 1,
          bossPatternIdx: patIdx + 1,
          bossPhase: phase === 'phase2' ? 2 : prev.bossPhase,
          lastDmg: null,
        }));
        return;
      }

      // All other boss attacks deal damage
      const def = player.def + player.armor.def + defBonus + (battleState.buffs?.def || 0);
      const rawDmg = Math.max(1, Math.round(enemy.atk * attack.atkMult) - def + Math.floor(Math.random() * 6) - 2);
      addLog(attack.log(enemy.name), 'danger');

      // Void Curse debuffs player DEF
      const newBufDef = attackId === 'curse'
        ? (battleState.buffs?.def || 0) + (attack.debuff?.def || 0)
        : (battleState.buffs?.def || 0);

      if (attackId === 'curse') addLog(`🌑 Your DEF is reduced by ${Math.abs(attack.debuff.def)}!`, 'danger');

      setPlayer(p => ({ ...p, hp: Math.max(0, p.hp - rawDmg) }));
      setBattleState(prev => ({
        ...prev,
        turn: 'player',
        defendBonus: 0,
        round: (prev.round || 1) + 1,
        bossPatternIdx: patIdx + 1,
        bossPhase: phase === 'phase2' ? 2 : prev.bossPhase,
        buffs: { ...prev.buffs, def: newBufDef },
        lastDmg: { value: rawDmg, isCrit: attackId === 'charge', target: 'player', id: Date.now() },
      }));
      return;
    }

    // ── Normal enemy attack ─────────────────────────────────────────────────
    const def = player.def + player.armor.def + defBonus + (battleState.buffs?.def || 0);
    const dmg = Math.max(1, enemy.atk - def + Math.floor(Math.random() * 6) - 2);
    addLog(`${enemy.icon} ${enemy.name} attacks you for ${dmg} damage!`, 'danger');
    setPlayer(p => ({ ...p, hp: Math.max(0, p.hp - dmg) }));
    setBattleState(prev => ({
      ...prev,
      turn: 'player',
      defendBonus: 0,
      round: (prev.round || 1) + 1,
      lastDmg: { value: dmg, isCrit: false, target: 'player', id: Date.now() },
    }));
  }, [battleState, player, addLog]);

  const resolveVictory = useCallback(() => {
    if (!battleState) return;
    const { enemy } = battleState;
    addLog(`🏆 You defeated ${enemy.name}! +${enemy.xp} XP, +${enemy.gold} Gold`, 'victory');
    advanceQuests('kill', enemy.id);
    setPlayer(p => {
      let newXp = p.xp + enemy.xp, newLevel = p.level;
      let newMaxHp = p.maxHp, newAtk = p.atk, newDef = p.def, leveledUp = false;
      while (newXp >= getXpToNext(newLevel)) {
        newXp -= getXpToNext(newLevel); newLevel++;
        const s = getLevelStats(newLevel);
        newMaxHp = s.maxHp; newAtk = s.atk; newDef = s.def; leveledUp = true;
      }
      if (leveledUp) { addLog(`⭐ Level Up! You are now Level ${newLevel}!`, 'levelup'); notify(`Level Up! → Level ${newLevel}`, 'levelup'); }
      return {
        ...p, xp: newXp, xpToNext: getXpToNext(newLevel), level: newLevel,
        maxHp: newMaxHp, hp: leveledUp ? newMaxHp : p.hp, atk: newAtk, def: newDef,
        gold: p.gold + enemy.gold, totalKills: p.totalKills + 1,
        defeatedBosses: enemy.isBoss ? [...p.defeatedBosses, enemy.id] : p.defeatedBosses,
      };
    });
    setBattleState(null);
    if (enemy.id === 'shadow_king') setTimeout(() => setScreen('victory'), 500);
    else setTimeout(() => setScreen('explore'), 300);
  }, [battleState, addLog, notify, advanceQuests]);

  // ── Shop ──────────────────────────────────────────────────────────────────
  const buyItem = useCallback((item) => {
    if (player.gold < item.price) { notify('Not enough gold!', 'error'); return; }
    if (WEAPONS.find(w => w.id === item.id)) {
      setPlayer(p => ({ ...p, gold: p.gold - item.price, weapon: item }));
      notify(`Equipped ${item.name}!`, 'success');
    } else if (ARMORS.find(a => a.id === item.id)) {
      setPlayer(p => ({ ...p, gold: p.gold - item.price, armor: item }));
      notify(`Equipped ${item.name}!`, 'success');
    } else {
      setPlayer(p => ({ ...p, gold: p.gold - item.price, inventory: [...p.inventory, { ...item }] }));
      notify(`Bought ${item.name}!`, 'success');
    }
    addLog(`🛒 Purchased ${item.name} for ${item.price} gold.`, 'shop');
  }, [player.gold, notify, addLog]);

  const rest = useCallback(() => {
    setPlayer(p => ({ ...p, hp: p.maxHp }));
    addLog('🌙 You rest and recover all HP.', 'heal');
    notify('Fully rested!', 'success');
  }, [addLog, notify]);

  const goToTitle = useCallback(() => {
    setActiveSlot(null);
    setBattleState(null);
    setScreen('title');
  }, []);

  return {
    player, screen, setScreen, battleState, log, notification, quests, activeSlot, difficulty,
    travel, startBattle, playerAttack, playerDefend, enemyAttack,
    resolveVictory, useItem, buyItem, rest, claimQuest, addLog, notify,
    loadSlot, eraseSlot, goToTitle, clearVictoryAndGoTitle,
  };
}
