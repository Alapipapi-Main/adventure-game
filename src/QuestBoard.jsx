import { QUESTS } from './gameData';
import styles from './QuestBoard.module.css';

export default function QuestBoard({ quests, onClaim, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span>📜</span>
            <h2 className={styles.title}>Quest Board</h2>
          </div>
          <p className={styles.subtitle}>Bounties & requests from the villagers of Ashenveil</p>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.list}>
          {QUESTS.map(def => {
            const state = quests.find(q => q.id === def.id);
            const status = state?.status ?? 'active';
            const progress = state?.progress ?? 0;
            const pct = Math.min(100, (progress / def.goal) * 100);

            return (
              <div key={def.id} className={`${styles.quest} ${styles[status]}`}>
                <div className={styles.questTop}>
                  <span className={styles.questIcon}>{def.icon}</span>
                  <div className={styles.questInfo}>
                    <div className={styles.questTitle}>{def.title}</div>
                    <div className={styles.questDesc}>{def.description}</div>
                  </div>
                  <div className={styles.questRight}>
                    <div className={styles.reward}>
                      <span>💰 {def.reward.gold}g</span>
                      <span>⭐ {def.reward.xp} xp</span>
                    </div>
                    {status === 'active' && (
                      <span className={styles.badge} style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        In Progress
                      </span>
                    )}
                    {status === 'completed' && (
                      <button className={styles.claimBtn} onClick={() => onClaim(def.id)}>
                        Claim Reward
                      </button>
                    )}
                    {status === 'claimed' && (
                      <span className={styles.badge} style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)', border: '1px solid var(--border)' }}>
                        ✓ Claimed
                      </span>
                    )}
                  </div>
                </div>

                {status !== 'claimed' && (
                  <div className={styles.progressRow}>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${pct}%`,
                          background: status === 'completed' ? 'var(--gold)' : 'var(--xp-blue)',
                        }}
                      />
                    </div>
                    <span className={styles.progressText}>{progress} / {def.goal}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
