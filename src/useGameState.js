import { useState, useCallback, useEffect } from 'react';
import {
  ENEMIES, LOCATIONS, WEAPONS, ARMORS,
  INITIAL_PLAYER, INITIAL_QUESTS, QUESTS,
  getXpToNext, getLevelStats,
} from './gameData';

const SAVE_KEY = 'vorhaan_save_v1';

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function writeSave(data) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch {}
}

export function hasSaveData() {
  return !!localStorage.getItem(SAVE_KEY);
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

export function useGameState() {
  const saved = loadSave();

  const [player, setPlayer] = useState(() =>
    saved?.player ?? JSON.parse(JSON.stringify(INITIAL_PLAYER))
  );
  const [screen, setScreen] = useState(() => saved ? 'explore' : 'title');
  const [battleState, setBattleState] = useState(null);
  const [log, setLog] = useState(() => saved?.log ?? []);
  const [notification, setNotification] = useState(null);
  const [quests, setQuests] = useState(() =>
    saved?.quests ?? JSON.parse(JSON.stringify(INITIAL_QUESTS))
  );

  // Auto-save whenever player or quests change
  useEffect(() => {
    if (screen === 'title') return;
    writeSave({ player, quests, log: log.slice(-20) });
  }, [player, quests]);

  const addLog = useCallback((msg, type = 'normal') => {
    setLog(prev => [...prev.slice(-40), { msg, type, id: Date.now() + Math.random() }]);
  }, []);

  const notify = useCallback((msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // ── Quest helpers ────────────────────────────────────────────────────────────
  const advanceQuests = useCallback((type, target) => {
    setQuests(prev => prev.map(q => {
      if (q.status !== 'active') return q;
      const def = QUESTS.find(d => d.id === q.id);
      if (!def) return q;
      let hit = false;
      if (def.type === 'kill_any' && type === 'kill') hit = true;
      if (def.type === 'kill_enemy' && type === 'kill' && def.target === target) hit = true;
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
    setPlayer(p => ({
      ...p,
      gold: p.gold + def.reward.gold,
      xp: p.xp + def.reward.xp,
    }));
    addLog(`💰 Claimed reward: +${def.reward.gold} Gold, +${def.reward.xp} XP`, 'victory');
    notify(`Reward claimed! +${def.reward.gold}g +${def.reward.xp}xp`, 'success');
  }, [addLog, notify]);

  // ── Navigation ───────────────────────────────────────────────────────────────
  const travel = useCallback((locationId) => {
    setPlayer(p => ({ ...p, location: locationId }));
    addLog(`You travel to ${LOCATIONS[locationId].name}.`, 'travel');
    setScreen('explore');
    advanceQuests('visit', locationId);
  }, [addLog, advanceQuests]);

  // ── Battle ───────────────────────────────────────────────────────────────────
  const startBattle = useCallback((enemyId) => {
    const enemy = JSON.parse(JSON.stringify(ENEMIES[enemyId]));
    setBattleState({ enemy, turn: 'player', buffs: { atk: 0 }, round: 1, lastDmg: null, lastHit: null });
    setScreen('battle');
    addLog(`⚔️ A ${enemy.name} appears!`, 'danger');
  }, [addLog]);

  const playerAttack = useCallback(() => {
    if (!battleState || battleState.turn !== 'player') return;
    const atk = player.atk + player.weapon.atk + battleState.buffs.atk;
    const raw = Math.max(1, atk - battleState.enemy.def + Math.floor(Math.random() * 6) - 2);
    const isCrit = Math.random() < 0.15;
    const finalDmg = isCrit ? Math.floor(raw * 1.75) : raw;

    addLog(`${isCrit ? '💥 Critical! ' : ''}You deal ${finalDmg} damage to ${battleState.enemy.name}.`, isCrit ? 'crit' : 'player');

    setBattleState(prev => {
      const newHp = Math.max(0, prev.enemy.hp - finalDmg);
      const next = {
        ...prev,
        enemy: { ...prev.enemy, hp: newHp },
        lastDmg: { value: finalDmg, isCrit, target: 'enemy', id: Date.now() },
        lastHit: { target: 'enemy', id: Date.now() },
      };
      return newHp <= 0
        ? { ...next, turn: 'resolved' }
        : { ...next, turn: 'enemy' };
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
      setBattleState(prev => prev
        ? { ...prev, buffs: { ...prev.buffs, atk: prev.buffs.atk + item.value } }
        : prev);
      addLog(`✨ You use ${item.name}! ATK +${item.value} for this battle.`, 'buff');
    }
    if (inBattle) {
      setBattleState(prev => prev ? { ...prev, turn: 'enemy' } : prev);
    }
  }, [addLog]);

  const enemyAttack = useCallback(() => {
    if (!battleState) return;
    const isDefending = battleState.turn === 'enemy_defend';
    const bonus = isDefending ? (battleState.defendBonus || 0) : 0;
    const def = player.def + player.armor.def + bonus;
    const dmg = Math.max(1, battleState.enemy.atk - def + Math.floor(Math.random() * 6) - 2);

    addLog(`${battleState.enemy.icon} ${battleState.enemy.name} attacks you for ${dmg} damage!`, 'danger');

    setPlayer(p => ({ ...p, hp: Math.max(0, p.hp - dmg) }));
    setBattleState(prev => ({
      ...prev,
      turn: 'player',
      defendBonus: 0,
      round: (prev.round || 1) + 1,
      lastDmg: { value: dmg, isCrit: false, target: 'player', id: Date.now() },
      lastHit: { target: 'player', id: Date.now() },
    }));
  }, [battleState, player, addLog]);

  const resolveVictory = useCallback(() => {
    if (!battleState) return;
    const { enemy } = battleState;
    addLog(`🏆 You defeated ${enemy.name}! +${enemy.xp} XP, +${enemy.gold} Gold`, 'victory');

    // Advance quests before updating player
    advanceQuests('kill', enemy.id);

    setPlayer(p => {
      let newXp = p.xp + enemy.xp;
      let newLevel = p.level;
      let newMaxHp = p.maxHp;
      let newAtk = p.atk;
      let newDef = p.def;
      let leveledUp = false;

      while (newXp >= getXpToNext(newLevel)) {
        newXp -= getXpToNext(newLevel);
        newLevel++;
        const stats = getLevelStats(newLevel);
        newMaxHp = stats.maxHp;
        newAtk = stats.atk;
        newDef = stats.def;
        leveledUp = true;
      }

      if (leveledUp) {
        addLog(`⭐ Level Up! You are now Level ${newLevel}!`, 'levelup');
        notify(`Level Up! → Level ${newLevel}`, 'levelup');
      }

      const defeatedBosses = enemy.isBoss
        ? [...p.defeatedBosses, enemy.id]
        : p.defeatedBosses;

      return {
        ...p,
        xp: newXp,
        xpToNext: getXpToNext(newLevel),
        level: newLevel,
        maxHp: newMaxHp,
        hp: leveledUp ? newMaxHp : p.hp,
        atk: newAtk,
        def: newDef,
        gold: p.gold + enemy.gold,
        totalKills: p.totalKills + 1,
        defeatedBosses,
      };
    });

    setBattleState(null);
    if (enemy.id === 'shadow_king') {
      setTimeout(() => setScreen('victory'), 500);
    } else {
      setTimeout(() => setScreen('explore'), 300);
    }
  }, [battleState, addLog, notify, advanceQuests]);

  // ── Shop ─────────────────────────────────────────────────────────────────────
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

  // ── Save / Reset ─────────────────────────────────────────────────────────────
  const resetGame = useCallback(() => {
    deleteSave();
    setPlayer(JSON.parse(JSON.stringify(INITIAL_PLAYER)));
    setQuests(JSON.parse(JSON.stringify(INITIAL_QUESTS)));
    setScreen('title');
    setBattleState(null);
    setLog([]);
  }, []);

  return {
    player, screen, setScreen, battleState, log, notification, quests,
    travel, startBattle, playerAttack, playerDefend, enemyAttack,
    resolveVictory, useItem, buyItem, rest, resetGame, claimQuest, addLog, notify,
  };
}
