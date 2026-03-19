import styles from './AudioSettings.module.css';

export default function AudioSettings({ musicVol, sfxVol, onMusicVol, onSfxVol, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>🎵 Audio Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <label className={styles.label}>🎵 Music</label>
            <div className={styles.sliderWrap}>
              <input
                type="range" min="0" max="1" step="0.05"
                value={musicVol}
                onChange={e => onMusicVol(parseFloat(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.val}>{Math.round(musicVol * 100)}%</span>
            </div>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>🔊 Sound FX</label>
            <div className={styles.sliderWrap}>
              <input
                type="range" min="0" max="1" step="0.05"
                value={sfxVol}
                onChange={e => onSfxVol(parseFloat(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.val}>{Math.round(sfxVol * 100)}%</span>
            </div>
          </div>

          <p className={styles.hint}>
            Set either slider to 0 to mute.
          </p>
        </div>
      </div>
    </div>
  );
}
