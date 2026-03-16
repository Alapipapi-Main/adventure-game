import styles from './SpecialScreens.module.css';

export function TitleScreen({ onStart, onContinue, hasSave }) {
  return (
    <div className={styles.titleWrap}>
      <div className={styles.stars} aria-hidden>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className={styles.star} style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
          }} />
        ))}
      </div>

      <div className={styles.titleContent}>
        <div className={styles.emblem}>⚔️</div>
        <h1 className={styles.gameTitle}>Shadows of<br />Vor'thaan</h1>
        <p className={styles.tagline}>A Dark Fantasy Adventure</p>
        <p className={styles.lore}>
          The cursed lands of Vor'thaan are overrun by darkness. Ancient evil stirs
          beneath shattered ruins. You are the last hope — an adventurer forged by
          desperation, armed only with a rusty blade and the will to fight.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}><span>⚔️</span> Turn-based Combat</div>
          <div className={styles.feature}><span>🗺️</span> Explore 6 Locations</div>
          <div className={styles.feature}><span>📜</span> Quest System</div>
          <div className={styles.feature}><span>👑</span> Epic Boss Battle</div>
        </div>

        {hasSave && (
          <button className={styles.continueBtn} onClick={onContinue}>
            ▶ Continue Adventure
          </button>
        )}

        <button className={styles.startBtn} onClick={onStart}>
          {hasSave ? 'New Game' : 'Begin Your Journey'}
        </button>

        {hasSave && (
          <p className={styles.saveNote}>⚠️ Starting a new game will erase your saved progress.</p>
        )}
      </div>
    </div>
  );
}

export function GameOverScreen({ player, onRestart }) {
  return (
    <div className={styles.gameOverWrap}>
      <div className={styles.gameOverContent}>
        <div className={styles.skull}>💀</div>
        <h2 className={styles.gameOverTitle}>You Have Fallen</h2>
        <p className={styles.gameOverSub}>The darkness claims another soul...</p>
        <div className={styles.stats}>
          <div className={styles.statRow}><span>Level Reached</span><span>{player.level}</span></div>
          <div className={styles.statRow}><span>Enemies Slain</span><span>{player.totalKills}</span></div>
          <div className={styles.statRow}><span>Gold Gathered</span><span>{player.gold}</span></div>
        </div>
        <button className={styles.restartBtn} onClick={onRestart}>Rise Again</button>
      </div>
    </div>
  );
}

export function VictoryScreen({ player, onRestart }) {
  return (
    <div className={styles.victoryWrap}>
      <div className={styles.victoryContent}>
        <div className={styles.victoryIcon}>🏆</div>
        <h2 className={styles.victoryTitle}>Victory!</h2>
        <p className={styles.victorySub}>The Shadow King is vanquished.<br />Light returns to Vor'thaan.</p>
        <div className={styles.stats}>
          <div className={styles.statRow}><span>Final Level</span><span>{player.level}</span></div>
          <div className={styles.statRow}><span>Enemies Slain</span><span>{player.totalKills}</span></div>
          <div className={styles.statRow}><span>Gold Collected</span><span>{player.gold}</span></div>
          <div className={styles.statRow}><span>Weapon</span><span>{player.weapon.name}</span></div>
        </div>
        <button className={styles.playAgainBtn} onClick={onRestart}>Play Again</button>
      </div>
    </div>
  );
}
