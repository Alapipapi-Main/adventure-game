import { useState } from 'react';
import { DIFFICULTIES } from './gameData';
import styles from './NewGameSetup.module.css';

export default function NewGameSetup({ onStart, onClose }) {
  const [name, setName]           = useState('');
  const [difficulty, setDifficulty] = useState('normal');
  const [nameError, setNameError]   = useState('');

  const handleStart = () => {
    const trimmed = name.trim();
    if (!trimmed) { setNameError('Please enter a name for your hero.'); return; }
    if (trimmed.length > 20) { setNameError('Name must be 20 characters or less.'); return; }
    onStart({ name: trimmed, difficulty });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>⚔️ Create Your Hero</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          {/* Name input */}
          <div className={styles.section}>
            <label className={styles.label}>Hero Name</label>
            <input
              className={`${styles.nameInput} ${nameError ? styles.inputError : ''}`}
              type="text"
              placeholder="Enter your name..."
              value={name}
              maxLength={20}
              onChange={e => { setName(e.target.value); setNameError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
              autoFocus
            />
            {nameError && <p className={styles.errorText}>{nameError}</p>}
          </div>

          {/* Difficulty picker */}
          <div className={styles.section}>
            <label className={styles.label}>Difficulty</label>
            <div className={styles.difficulties}>
              {Object.values(DIFFICULTIES).map(d => (
                <button
                  key={d.id}
                  className={`${styles.diffBtn} ${difficulty === d.id ? styles.diffSelected : ''}`}
                  onClick={() => setDifficulty(d.id)}
                >
                  <span className={styles.diffIcon}>{d.icon}</span>
                  <div className={styles.diffInfo}>
                    <div className={styles.diffLabel}>{d.label}</div>
                    <div className={styles.diffDesc}>{d.description}</div>
                  </div>
                  {difficulty === d.id && <span className={styles.diffCheck}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button className={styles.startBtn} onClick={handleStart}>
            Begin Adventure →
          </button>
        </div>
      </div>
    </div>
  );
}
