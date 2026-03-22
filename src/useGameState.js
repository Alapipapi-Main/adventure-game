import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ENEMIES, LOCATIONS, WEAPONS, ARMORS,
  INITIAL_PLAYER, INITIAL_QUESTS, QUESTS,
  DIFFICULTIES, BOSS_PATTERNS, BOSS_ATTACKS,
  SKILL_PATHS, STATUS_EFFECTS, ENEMY_STATUS_CHANCE, ENEMY_DODGE_CHANCE,
  getXpToNext, getLevelStats,
} from './gameData';

const SLOT_COUNT = 3;
const SLOT_KEY = (slot) => `vorhaan_save_v1_slot${slot}`;
const PENDING_VICTORY_KEY = 'vorhaan_pending_victory_slot';

// Called at boot — if the app was refreshed mid-victory, clean up the winning slot
function clearPendingVictory() {
  try {
    const slot = localStorage.getItem(PENDING_VICTORY_KEY);
    if (slot) {
      localStorage.removeItem(SLOT_KEY(parseInt(slot)));
      localStorage.removeItem(PENDING_VICTORY_KEY);
    }
  } catch {}
}
clearPendingVictory(); // runs once when the module is first imported

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
      difficulty: data?.difficulty ?? 'normal',
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
  const [pendingLevelUp, setPendingLevelUp] = useState(false); // show skill tree picker

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
      pendingSkillPick: pendingLevelUp,
      log: log.slice(-20),
      savedAt: new Date().toISOString(),
    });
  }, [player, quests, screen, activeSlot, difficulty, pendingLevelUp]);

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
      const restoredPlayer = {
        // Defaults for fields added after original saves were created
        perks:        [],
        critChance:   0.15,
        critMult:     1.75,
        poisonChance: 0,
        burnChance:   0,
        defPen:       0,
        alwaysFlee:   false,
        critBurn:     false,
        statusEffects:[],
        ...p, // saved values override defaults
        hp: p.hp <= 0 ? p.maxHp : p.hp,
      };
      setPlayer(restoredPlayer);
      // Merge any quests added after this save was created so they aren't missing
      const savedQuests = data.quests ?? [];
      const mergedQuests = JSON.parse(JSON.stringify(INITIAL_QUESTS)).map(fresh => {
        const saved = savedQuests.find(q => q.id === fresh.id);
        return saved ?? fresh;
      });
      setQuests(mergedQuests);
      setDifficulty(data.difficulty ?? 'normal');
      setPendingLevelUp(data.pendingSkillPick ?? false);
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
      try { localStorage.removeItem(PENDING_VICTORY_KEY); } catch {}
      setActiveSlot(null);
      setPlayer(JSON.parse(JSON.stringify(INITIAL_PLAYER)));
      setQuests(JSON.parse(JSON.stringify(INITIAL_QUESTS)));
      setDifficulty('normal');
      setPendingLevelUp(false);
      setLog([]);
      setBattleState(null);
      setScreen('title');
    }
  }, [activeSlot]);

  // Called after beating the game — wipes the winning slot then goes to title
  const clearVictoryAndGoTitle = useCallback(() => {
    if (activeSlot) deleteSlot(activeSlot);
    try { localStorage.removeItem(PENDING_VICTORY_KEY); } catch {}
    setActiveSlot(null);
    setPlayer(JSON.parse(JSON.stringify(INITIAL_PLAYER)));
    setQuests(JSON.parse(JSON.stringify(INITIAL_QUESTS)));
    setDifficulty('normal');
    setPendingLevelUp(false);
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
      if (def.type === 'kill_any'       && type === 'kill')           hit = true;
      if (def.type === 'kill_enemy'     && type === 'kill'            && def.target === target) hit = true;
      if (def.type === 'visit_location' && type === 'visit'           && def.target === target) hit = true;
      if (def.type === 'inflict_status' && type === 'inflict_status'  && def.target === target) hit = true;
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

  // ── Shared XP helper — handles level-up correctly ─────────────────────────
  const applyXp = useCallback((p, xpGain) => {
    let newXp = p.xp + xpGain;
    let newLevel = p.level;
    let newMaxHp = p.maxHp, newAtk = p.atk, newDef = p.def;
    let leveledUp = false;
    let skillTrigger = false;
    while (newXp >= getXpToNext(newLevel)) {
      newXp -= getXpToNext(newLevel);
      newLevel++;
      const s = getLevelStats(newLevel);
      newMaxHp = s.maxHp; newAtk = s.atk; newDef = s.def;
      leveledUp = true;
      // Trigger skill tree every 2 levels, starting from level 4
      // Trigger skill tree at levels 3, 5, 7, 9 (every 2 levels starting from 3)
      if (newLevel % 2 === 1 && newLevel >= 3) skillTrigger = true;
    }
    if (leveledUp) {
      addLog(`⭐ Level Up! You are now Level ${newLevel}!`, 'levelup');
      notify(`Level Up! → Level ${newLevel}`, 'levelup');
      if (skillTrigger) setTimeout(() => setPendingLevelUp(true), 800);
    }
    return {
      ...p,
      xp: newXp,
      xpToNext: getXpToNext(newLevel),
      level: newLevel,
      maxHp: newMaxHp,
      hp: leveledUp ? newMaxHp : p.hp,
      atk: newAtk,
      def: newDef,
    };
  }, [addLog, notify]);

  // ── Skill tree perk picker ────────────────────────────────────────────────
  const pickPerk = useCallback((perkId, pathId) => {
    const path = SKILL_PATHS[pathId];
    if (!path) return;
    const perk = path.perks.find(p => p.id === perkId);
    if (!perk) return;
    setPlayer(p => {
      const b = perk.bonuses;
      return {
        ...p,
        perks:        [...(p.perks        || []), perkId],
        statusEffects:[...(p.statusEffects|| [])],
        maxHp:       p.maxHp + (b.maxHp || 0),
        hp:          p.hp    + (b.maxHp || 0),
        atk:         p.atk   + (b.atk   || 0),
        def:         p.def   + (b.def   || 0),
        critChance:  (p.critChance  || 0.15) + (b.critChance  || 0),
        critMult:    (p.critMult    || 1.75) + (b.critMult    || 0),
        poisonChance:(p.poisonChance|| 0)    + (b.poisonChance|| 0),
        burnChance:  (p.burnChance  || 0)    + (b.burnChance  || 0),
        defPen:      (p.defPen      || 0)    + (b.defPen      || 0),
        alwaysFlee:  p.alwaysFlee || b.alwaysFlee || false,
        critBurn:    p.critBurn   || b.critBurn   || false,
      };
    });
    addLog(`✨ Perk unlocked: ${perk.name}!`, 'levelup');
    notify(`Perk unlocked: ${perk.name}!`, 'success');
    setPendingLevelUp(false);
  }, [addLog, notify]);

  const claimQuest = useCallback((questId) => {
    const def = QUESTS.find(d => d.id === questId);
    if (!def) return;
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'claimed' } : q));
    setPlayer(p => {
      const withGold = { ...p, gold: p.gold + def.reward.gold };
      return applyXp(withGold, def.reward.xp);
    });
    addLog(`💰 Claimed reward: +${def.reward.gold} Gold, +${def.reward.xp} XP`, 'victory');
    notify(`Reward claimed! +${def.reward.gold}g +${def.reward.xp}xp`, 'success');
  }, [addLog, notify, applyXp]);

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
    const defPen = (player.defPen || 0) + (battleState.buffs?.defPen || 0);
    const atk = player.atk + player.weapon.atk + battleState.buffs.atk;
    const enemyDef = Math.max(0, battleState.enemy.def - defPen);
    const raw = Math.max(1, atk - enemyDef + Math.floor(Math.random() * 6) - 2);
    const critChance = player.critChance ?? 0.15;
    const critMult   = player.critMult   ?? 1.75;
    const isCrit = Math.random() < critChance;
    const finalDmg = isCrit ? Math.floor(raw * critMult) : raw;

    // Check if enemy dodges
    const enemyDodge = ENEMY_DODGE_CHANCE[battleState.enemy.id] ?? 0;
    if (enemyDodge > 0 && Math.random() < enemyDodge) {
      addLog(`👻 ${battleState.enemy.name} phases through your attack — Miss!`, 'danger');
      setBattleState(prev => ({ ...prev, turn: 'enemy', lastDmg: { value: 0, isCrit: false, target: 'enemy', id: Date.now(), dodged: true } }));
      return;
    }

    // Check status application
    const poisonRoll = Math.random();
    const burnRoll   = Math.random();
    const applyPoison = (player.poisonChance || 0) > 0 && poisonRoll < (player.poisonChance || 0);
    const applyBurn   = ((player.burnChance   || 0) > 0 && burnRoll   < (player.burnChance   || 0))
                      || (isCrit && (player.critBurn || false));

    addLog(`${isCrit ? '💥 Critical! ' : ''}You deal ${finalDmg} damage to ${battleState.enemy.name}.${applyPoison ? ' 🐍 Poisoned!' : ''}${applyBurn ? ' 🔥 Burned!' : ''}`, isCrit ? 'crit' : 'player');

    if (applyPoison) advanceQuests('inflict_status', 'poison');
    if (applyBurn)   advanceQuests('inflict_status', 'burn');

    setBattleState(prev => {
      const newHp = Math.max(0, prev.enemy.hp - finalDmg);
      let newEnemyStatus = [...(prev.enemyStatus || [])];
      if (applyPoison && !newEnemyStatus.find(s => s.id === 'poison')) {
        newEnemyStatus.push({ id: 'poison', turnsLeft: STATUS_EFFECTS.poison.duration });
      }
      if (applyBurn && !newEnemyStatus.find(s => s.id === 'burn')) {
        newEnemyStatus.push({ id: 'burn', turnsLeft: STATUS_EFFECTS.burn.duration });
      }
      const next = {
        ...prev,
        enemy: { ...prev.enemy, hp: newHp },
        enemyStatus: newEnemyStatus,
        lastDmg: { value: finalDmg, isCrit, target: 'enemy', id: Date.now() },
      };
      return newHp <= 0 ? { ...next, turn: 'resolved' } : { ...next, turn: 'enemy' };
    });
  }, [battleState, player, addLog, advanceQuests]);

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
      let newStatus = p.statusEffects || [];
      if (item.effect === 'heal') {
        const healed = Math.min(item.value, p.maxHp - p.hp);
        newHp = p.hp + healed;
        addLog(`💊 You use ${item.name} and restore ${healed} HP.`, 'heal');
      }
      if (item.effect === 'cure') {
        newStatus = (p.statusEffects || []).filter(s => s.id !== 'poison' && s.id !== 'burn');
        addLog(`🌿 You use ${item.name} — poison and burn are cured!`, 'heal');
      }
      return { ...p, hp: newHp, inventory: newInv, statusEffects: newStatus };
    });
    if (inBattle && item.effect === 'buff') {
      setBattleState(prev => prev ? { ...prev, buffs: { ...prev.buffs, atk: prev.buffs.atk + item.value } } : prev);
      addLog(`✨ You use ${item.name}! ATK +${item.value} for this battle.`, 'buff');
    }
    if (inBattle && item.effect === 'inflict_poison') {
      setBattleState(prev => {
        if (!prev) return prev;
        const already = (prev.enemyStatus || []).find(s => s.id === 'poison');
        if (already) { addLog(`🐍 Enemy is already poisoned!`, 'player'); return { ...prev, turn: 'enemy' }; }
        addLog(`🐍 You use ${item.name} — enemy is poisoned!`, 'player');
        advanceQuests('inflict_status', 'poison');
        return { ...prev, enemyStatus: [...(prev.enemyStatus || []), { id: 'poison', turnsLeft: 3 }], turn: 'enemy' };
      });
    }
    if (inBattle && item.effect === 'inflict_burn') {
      setBattleState(prev => {
        if (!prev) return prev;
        const already = (prev.enemyStatus || []).find(s => s.id === 'burn');
        if (already) { addLog(`🔥 Enemy is already burning!`, 'player'); return { ...prev, turn: 'enemy' }; }
        addLog(`🔥 You use ${item.name} — enemy is burning!`, 'player');
        advanceQuests('inflict_status', 'burn');
        return { ...prev, enemyStatus: [...(prev.enemyStatus || []), { id: 'burn', turnsLeft: 2 }], turn: 'enemy' };
      });
    }
    if (inBattle && item.effect === 'evasion_tonic') {
      const alreadyActive = (battleState?.buffs?.dodgeChance ?? 0) > 0;
      if (alreadyActive) {
        addLog(`🪬 Evasion Tonic is already active!`, 'buff');
        setBattleState(prev => prev ? { ...prev, turn: 'enemy' } : prev);
      } else {
        setBattleState(prev => prev ? {
          ...prev,
          buffs: { ...prev.buffs, dodgeChance: 0.30 }, // fixed 30%, not additive
          turn: 'enemy',
        } : prev);
        addLog(`🪬 You use ${item.name}! 30% dodge chance for this battle.`, 'buff');
      }
    }
    if (inBattle && item.effect === 'piercing_oil') {
      setBattleState(prev => prev ? {
        ...prev,
        buffs: { ...prev.buffs, defPen: (prev.buffs?.defPen || 0) + item.value },
        turn: 'enemy',
      } : prev);
      addLog(`🗡️ You use ${item.name}! +${item.value} DEF penetration for this battle.`, 'buff');
    }
    if (inBattle && !['inflict_poison', 'inflict_burn', 'evasion_tonic', 'piercing_oil'].includes(item.effect)) {
      setBattleState(prev => prev ? { ...prev, turn: 'enemy' } : prev);
    }
  }, [addLog, advanceQuests]);

  const enemyAttack = useCallback(() => {
    if (!battleState) return;
    const { enemy } = battleState;
    const isDefending = battleState.turn === 'enemy_defend';
    const defBonus = isDefending ? (battleState.defendBonus || 0) : 0;

    // Tick enemy status effects (poison/burn on enemy)
    let enemyStatusDmg = 0;
    let newEnemyStatus = (battleState.enemyStatus || []).map(s => {
      const effect = STATUS_EFFECTS[s.id];
      if (effect?.damage > 0) {
        enemyStatusDmg += effect.damage;
        addLog(`${effect.icon} ${enemy.name} takes ${effect.damage} ${s.id} damage!`, 'player');
      }
      return s.turnsLeft > 1 ? { ...s, turnsLeft: s.turnsLeft - 1 } : null;
    }).filter(Boolean);

    if (enemyStatusDmg > 0) {
      const newHp = Math.max(0, enemy.hp - enemyStatusDmg);
      if (newHp <= 0) {
        setBattleState(prev => ({
          ...prev,
          enemy: { ...prev.enemy, hp: 0 },
          enemyStatus: newEnemyStatus,
          turn: 'resolved',
        }));
        return;
      }
      setBattleState(prev => ({ ...prev, enemy: { ...prev.enemy, hp: newHp }, enemyStatus: newEnemyStatus }));
    }

    // ── Player dodge check — applies to ALL attacks including boss ────────────
    const playerDodge = battleState.buffs?.dodgeChance ?? 0;
    if (playerDodge > 0 && Math.random() < playerDodge) {
      addLog(`🪬 You dodge ${enemy.name}'s attack!`, 'player');
      setBattleState(prev => ({
        ...prev, turn: 'player', defendBonus: 0, round: (prev.round || 1) + 1, lastDmg: null,
      }));
      return;
    }

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

    // Check if enemy can inflict a status effect
    const statusChanceDef = ENEMY_STATUS_CHANCE[enemy.id];
    let inflictStatus = null;
    if (statusChanceDef && Math.random() < statusChanceDef.chance) {
      const existing = (player.statusEffects || []).find(s => s.id === statusChanceDef.effect);
      if (!existing) inflictStatus = statusChanceDef.effect;
    }

    // Handle stun — skip player turn instead of dealing damage
    if (inflictStatus === 'stun') {
      addLog(`${enemy.icon} ${enemy.name} stuns you! 💫 You will lose your next turn!`, 'danger');
      setPlayer(p => ({ ...p, hp: Math.max(0, p.hp - dmg) }));
      setBattleState(prev => ({
        ...prev,
        turn: 'player_stunned', // BattleScreen will auto-skip this turn
        defendBonus: 0,
        round: (prev.round || 1) + 1,
        lastDmg: { value: dmg, isCrit: false, target: 'player', id: Date.now() },
      }));
      return;
    }

    const statusMsg = inflictStatus
      ? ` ${STATUS_EFFECTS[inflictStatus]?.icon} You are ${inflictStatus}ed!`
      : '';
    addLog(`${enemy.icon} ${enemy.name} attacks you for ${dmg} damage!${statusMsg}`, 'danger');

    // Tick existing player status effects (no stun handling here anymore)
    let statusDmg = 0;
    let newStatuses = (player.statusEffects || [])
      .map(s => {
        const effect = STATUS_EFFECTS[s.id];
        if (effect?.damage > 0) {
          statusDmg += effect.damage;
          addLog(`${effect.icon} ${effect.name} deals ${effect.damage} damage!`, 'danger');
        }
        return s.turnsLeft > 1 ? { ...s, turnsLeft: s.turnsLeft - 1 } : null;
      })
      .filter(Boolean);

    // Apply new status from this attack
    if (inflictStatus && inflictStatus !== 'stun') {
      newStatuses.push({ id: inflictStatus, turnsLeft: STATUS_EFFECTS[inflictStatus].duration });
    }

    const totalDmg = dmg + statusDmg;

    setPlayer(p => ({ ...p, hp: Math.max(0, p.hp - totalDmg), statusEffects: newStatuses }));
    setBattleState(prev => ({
      ...prev,
      turn: 'player',
      defendBonus: 0,
      round: (prev.round || 1) + 1,
      lastDmg: { value: totalDmg, isCrit: false, target: 'player', id: Date.now() },
    }));
  }, [battleState, player, addLog]);

  const resolveVictory = useCallback(() => {
    if (!battleState) return;
    const { enemy } = battleState;
    addLog(`🏆 You defeated ${enemy.name}! +${enemy.xp} XP, +${enemy.gold} Gold`, 'victory');
    advanceQuests('kill', enemy.id);
    setPlayer(p => {
      const withRewards = {
        ...p,
        gold: p.gold + enemy.gold,
        totalKills: p.totalKills + 1,
        defeatedBosses: enemy.isBoss ? [...p.defeatedBosses, enemy.id] : p.defeatedBosses,
      };
      return applyXp(withRewards, enemy.xp);
    });
    setBattleState(null);
    if (enemy.id === 'shadow_king') {
      // Mark slot as pending deletion in case player refreshes on victory screen
      try { localStorage.setItem(PENDING_VICTORY_KEY, String(activeSlot)); } catch {}
      setTimeout(() => setScreen('victory'), 500);
    }
    else setTimeout(() => setScreen('explore'), 300);
  }, [battleState, addLog, advanceQuests, applyXp]);

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
    pendingLevelUp, pickPerk,
    travel, startBattle, playerAttack, playerDefend, enemyAttack,
    resolveVictory, useItem, buyItem, rest, claimQuest, addLog, notify,
    loadSlot, eraseSlot, goToTitle, clearVictoryAndGoTitle,
  };
}
