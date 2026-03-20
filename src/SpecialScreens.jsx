import { useState } from 'react';
import { getAllSlots } from './useGameState';
import SaveSlotPicker from './SaveSlotPicker';
import styles from './SpecialScreens.module.css';

// ── Title ────────────────────────────────────────────────────────────────────
export function TitleScreen({ onNewGame, onContinue, hasAnySave }) {
  const [audioStarted, setAudioStarted] = useState(false);

  return (
    <div className={styles.titleWrap} onClick={() => setAudioStarted(true)}>
      <div className={styles.stars} aria-hidden>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className={styles.star} style={{
            left: `${Math.random() * 100}%`,
            top:  `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            width:  `${1 + Math.random() * 2}px`,
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

        {hasAnySave && (
          <button className={styles.continueBtn} onClick={onContinue}>
            ▶ Continue Adventure
          </button>
        )}

        <button className={styles.startBtn} onClick={onNewGame}>
          ⚔️ New Game
        </button>

        {hasAnySave && (
          <p className={styles.saveNote}>💾 {hasAnySave} save slot{hasAnySave > 1 ? 's' : ''} found</p>
        )}
      </div>

      <div className={`${styles.audioHint} ${audioStarted ? styles.audioHintHidden : ''}`}>
        🔊 Click anywhere to start music
      </div>
    </div>
  );
}

// ── Game Over ─────────────────────────────────────────────────────────────────
export function GameOverScreen({ player, activeSlot, onLoadSlot, onEraseSlot, onGoTitle }) {
  const [showPicker, setShowPicker] = useState(false);
  const slots       = getAllSlots();
  const otherSlots  = slots.filter(s => !s.empty && s.slot !== activeSlot);
  const hasOthers   = otherSlots.length > 0;

  return (
    <div className={styles.gameOverWrap}>
      {showPicker && (
        <SaveSlotPicker
          mode="load"
          onSelect={(slot) => { setShowPicker(false); onLoadSlot(slot); }}
          onErase={(slot) => { onEraseSlot(slot); }}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div className={styles.gameOverContent}>
        <div className={styles.skull}>💀</div>
        <h2 className={styles.gameOverTitle}>You Have Fallen</h2>
        <p className={styles.gameOverSub}>The darkness claims another soul…</p>

        <div className={styles.stats}>
          <div className={styles.statRow}><span>Level Reached</span><span>{player.level}</span></div>
          <div className={styles.statRow}><span>Enemies Slain</span><span>{player.totalKills}</span></div>
          <div className={styles.statRow}><span>Gold Gathered</span><span>{player.gold}</span></div>
          <div className={styles.statRow}><span>Save Slot</span><span>Slot {activeSlot}</span></div>
        </div>

        <div className={styles.deathActions}>
          {/* Retry — reload the same slot from last save */}
          <button className={styles.retryBtn} onClick={() => onLoadSlot(activeSlot)}>
            🔄 Retry from Last Save
            <span className={styles.btnSub}>Reload Slot {activeSlot}</span>
          </button>

          {/* Load a different slot */}
          {hasOthers && (
            <button className={styles.loadOtherBtn} onClick={() => setShowPicker(true)}>
              📂 Load Another Save
              <span className={styles.btnSub}>{otherSlots.length} other slot{otherSlots.length > 1 ? 's' : ''} available</span>
            </button>
          )}

          {/* Back to title */}
          <button className={styles.titleBtn} onClick={onGoTitle}>
            🏠 Back to Title
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Victory ───────────────────────────────────────────────────────────────────
export function VictoryScreen({ player, activeSlot, onNewGame, onLoadSlot, onEraseSlot, onClearVictory }) {
  const [showPicker, setShowPicker] = useState(false);

  // Only count slots that already have save data (excluding the winning slot)
  const otherSlots = getAllSlots().filter(s => !s.empty && s.slot !== activeSlot);
  const hasOtherSlots = otherSlots.length > 0;

  const handleNewGame   = () => { onClearVictory(); };
  const handleLoadOther = (slot) => {
    setShowPicker(false);
    onLoadSlot(slot); // App.jsx handles new-game setup if slot is empty via newGameSlot state
  };

  const openPicker = () => {
    onEraseSlot(activeSlot);
    setShowPicker(true);
  };

  return (
    <div className={styles.victoryWrap}>
      {showPicker && (
        <SaveSlotPicker
          mode="load"
          onSelect={handleLoadOther}
          onErase={(slot) => { onEraseSlot(slot); }}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div className={styles.victoryContent}>
        <div className={styles.victoryIcon}>🏆</div>
        <h2 className={styles.victoryTitle}>Victory!</h2>
        <p className={styles.victorySub}>
          The Shadow King is vanquished.<br />Light returns to Vor'thaan.
        </p>

        <div className={styles.stats}>
          <div className={styles.statRow}><span>Final Level</span><span>{player.level}</span></div>
          <div className={styles.statRow}><span>Enemies Slain</span><span>{player.totalKills}</span></div>
          <div className={styles.statRow}><span>Gold Collected</span><span>{player.gold}</span></div>
          <div className={styles.statRow}><span>Weapon</span><span>{player.weapon.name}</span></div>
          <div className={styles.statRow}><span>Save Slot</span><span>Slot {activeSlot} — cleared ✓</span></div>
        </div>

        <p className={styles.victoryNote}>💾 Your save has been cleared — the legend is complete.</p>

        <div className={styles.deathActions}>
          <button
            className={styles.retryBtn}
            style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.25),rgba(201,168,76,0.05))', borderColor: 'var(--gold)', color: 'var(--gold-light)' }}
            onClick={handleNewGame}
          >
            ⚔️ Start a New Adventure
            <span className={styles.btnSub}>Return to title & pick a slot</span>
          </button>

          <button
            className={`${styles.loadOtherBtn} ${!hasOtherSlots ? styles.disabledBtn : ''}`}
            onClick={hasOtherSlots ? openPicker : undefined}
            disabled={!hasOtherSlots}
          >
            📂 Load Another Save
            <span className={styles.btnSub}>
              {hasOtherSlots
                ? `${otherSlots.length} save${otherSlots.length > 1 ? 's' : ''} available`
                : 'No other saves found'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
