import { useState, useCallback } from 'react';
import {
  ACHIEVEMENTS,
  readAchievements, writeAchievements,
  readBestiary, recordBestiaryKill, recordBestiaryEncounter,
} from './achievementData';
import { ENEMIES } from './gameData';

const TOTAL_ENEMIES = Object.keys(ENEMIES).filter(id => id !== 'shadow_king').length + 1; // include boss
const TOTAL_QUESTS  = 20;
const TOTAL_PERKS   = 15;
const TOTAL_LOCS    = 7;

export default function useAchievements(notify) {
  const [unlocked, setUnlocked] = useState(() => readAchievements());

  const unlock = useCallback((id) => {
    setUnlocked(prev => {
      if (prev[id]) return prev; // already unlocked
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (!ach) return prev;
      const next = { ...prev, [id]: { unlockedAt: new Date().toISOString() } };
      writeAchievements(next);
      notify(`🏆 Achievement: ${ach.title}!`, 'levelup');
      return next;
    });
  }, [notify]);

  // ── Check functions — called from game events ─────────────────────────────

  const checkCombat = useCallback((player, enemy, battleFlags) => {
    const bestiary = recordBestiaryKill(enemy.id);

    // First kill — fires on any kill, unlock() is idempotent so only fires once
    unlock('first_blood');

    // Kill milestones (totalKills is pre-increment here, so +1)
    const newTotal = player.totalKills + 1;
    if (newTotal >= 50)  unlock('veteran');
    if (newTotal >= 100) unlock('warlord');

    // Boss slayer
    if (enemy.id === 'shadow_king') unlock('boss_slayer');

    // Untouchable — won without taking damage
    if (battleFlags.damageTaken === 0) unlock('untouchable');

    // Flawless — won without ever using Defend or Flee
    if (!battleFlags.usedDefend && !battleFlags.usedFlee) unlock('flawless');

    // Bestiary — all enemies encountered
    const bestiaryKeys = Object.keys(bestiary);
    if (bestiaryKeys.length >= TOTAL_ENEMIES) unlock('monster_hunter');

    // Exterminator — at least 1 kill of every type
    const allKilled = Object.values(ENEMIES).every(e => (bestiary[e.id]?.kills || 0) >= 1);
    if (allKilled) unlock('exterminator');
  }, [unlock]);

  const checkPoison = useCallback((totalPoisons) => {
    if (totalPoisons >= 10) unlock('poisoner');
  }, [unlock]);

  const checkBurn = useCallback((totalBurns) => {
    if (totalBurns >= 10) unlock('pyro');
  }, [unlock]);

  const checkExploration = useCallback((visitedLocations) => {
    if (visitedLocations.includes('sunken_dungeon')) unlock('dungeon_diver');
    if (visitedLocations.includes('ruined_shrine'))  unlock('shrine_seeker');
    if (visitedLocations.length >= TOTAL_LOCS)       unlock('explorer');
  }, [unlock]);

  const checkQuests = useCallback((claimedCount) => {
    if (claimedCount >= 5)           unlock('bounty_hunter');
    if (claimedCount >= TOTAL_QUESTS) unlock('quest_master');
  }, [unlock]);

  const checkPerks = useCallback((perkCount) => {
    if (perkCount >= 1)           unlock('first_perk');
    if (perkCount >= 5)           unlock('path_chosen');
    if (perkCount >= TOTAL_PERKS) unlock('fully_mastered');
  }, [unlock]);

  const checkCrafting = useCallback((totalCrafted) => {
    if (totalCrafted >= 1) unlock('tinker');
    if (totalCrafted >= 5) unlock('master_crafter');
  }, [unlock]);

  const checkVictory = useCallback((player, difficulty) => {
    if (difficulty === 'hard')     unlock('hardened');
    if (player.level < 8)         unlock('speed_runner');
  }, [unlock]);

  const checkBestiaryEncounter = useCallback((enemyId) => {
    recordBestiaryEncounter(enemyId);
  }, []);

  return {
    unlocked,
    checkCombat,
    checkPoison,
    checkBurn,
    checkExploration,
    checkQuests,
    checkPerks,
    checkCrafting,
    checkVictory,
    checkBestiaryEncounter,
  };
}
