import { DIFFICULTIES } from './gameData';
import styles from './HUD.module.css';

export default function HUD({ player, quests, difficulty, musicVol, sfxVol, onInventory, onQuestBoard, onAudio }) {
  const hpPct  = (player.hp / player.maxHp) * 100;
  const xpPct  = (player.xp / player.xpToNext) * 100;
  const hpColor = hpPct > 60 ? 'var(--hp-green)' : hpPct > 30 ? 'var(--hp-yellow)' : 'var(--hp-red)';
  const readyQuests = quests.filter(q => q.status === 'completed').length;
  const isMuted = musicVol === 0 && sfxVol === 0;
  const diff = DIFFICULTIES[difficulty] ?? DIFFICULTIES.normal;

  return (
    <div className={styles.hud}>
      <div className={styles.left}>
        <span className={styles.name}>⚔️ {player.name}</span>
        <span className={styles.level}>Lv.{player.level}</span>
        <span className={`${styles.diffBadge} ${styles[`diff_${difficulty}`]}`}>
          {diff.icon} {diff.label}
        </span>
      </div>

      <div className={styles.bars}>
        <div className={styles.barRow}>
          <span className={styles.barLabel}>HP</span>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${hpPct}%`, background: hpColor }} />
          </div>
          <span className={styles.barVal}>{player.hp}/{player.maxHp}</span>
        </div>
        <div className={styles.barRow}>
          <span className={styles.barLabel}>XP</span>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${xpPct}%`, background: 'var(--xp-blue)' }} />
          </div>
          <span className={styles.barVal}>{player.xp}/{player.xpToNext}</span>
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.gold}>💰 {player.gold}</span>
        <button className={styles.invBtn} onClick={onInventory}>🎒 Bag ({player.inventory.length})</button>
        <button className={styles.questHudBtn} onClick={onQuestBoard}>
          📜 Quests
          {readyQuests > 0 && <span className={styles.hudBadge}>{readyQuests}</span>}
        </button>
        <button className={styles.audioBtn} onClick={onAudio} title="Audio Settings">
          {isMuted ? '🔇' : '🎵'}
        </button>
      </div>
    </div>
  );
}
