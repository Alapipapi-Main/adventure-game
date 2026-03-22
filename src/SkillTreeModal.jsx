import { SKILL_PATHS } from './gameData';
import styles from './SkillTreeModal.module.css';

export default function SkillTreeModal({ player, onPick }) {
  const perks = player.perks || [];

  // Work out which perk each path would offer next
  const options = Object.values(SKILL_PATHS).map(path => {
    const earnedInPath = perks.filter(id => path.perks.find(p => p.id === id));
    const nextPerk = path.perks[earnedInPath.length];
    return nextPerk ? { path, perk: nextPerk } : null;
  }).filter(Boolean);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.levelBadge}>⭐ Level Up!</div>
          <h2 className={styles.title}>Choose Your Path</h2>
          <p className={styles.subtitle}>Pick a perk to grow stronger. This choice is permanent.</p>
        </div>

        <div className={styles.options}>
          {options.map(({ path, perk }) => (
            <button
              key={perk.id}
              className={styles.option}
              style={{ '--path-color': path.color }}
              onClick={() => onPick(perk.id, path.id)}
            >
              <div className={styles.pathLabel} style={{ color: path.color }}>
                {path.icon} {path.name} Path
              </div>
              <div className={styles.perkIcon}>{perk.icon}</div>
              <div className={styles.perkName}>{perk.name}</div>
              <div className={styles.perkDesc}>{perk.description}</div>
            </button>
          ))}

          {options.length === 0 && (
            <div className={styles.maxed}>
              <div className={styles.maxedIcon}>🌟</div>
              <p>All paths mastered — you are at peak power!</p>
              <button className={styles.dismissBtn} onClick={() => onPick(null, null)}>
                Continue Adventure
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
