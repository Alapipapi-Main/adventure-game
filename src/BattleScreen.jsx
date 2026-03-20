import { useEffect, useState, useRef } from 'react';
import { BOSS_PATTERNS, BOSS_ATTACKS } from './gameData';
import styles from './BattleScreen.module.css';

function FloatingNumber({ value, isCrit, target, id }) {
  return (
    <div
      key={id}
      className={`${styles.floatNum} ${isCrit ? styles.floatCrit : ''} ${target === 'player' ? styles.floatPlayer : styles.floatEnemy}`}
    >
      {isCrit ? '💥 ' : ''}{value}
    </div>
  );
}

export default function BattleScreen({
  player, battleState, onAttack, onDefend, onFlee, onEnemyTurn, onResolveVictory, onUseItem, log,
}) {
  const [floats, setFloats] = useState([]);
  const [enemyShake, setEnemyShake] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [enemyGlow, setEnemyGlow] = useState(false);
  const [playerGlow, setPlayerGlow] = useState(false);
  const [screenFlash, setScreenFlash] = useState(null);
  const prevDmg = useRef(null);

  // Trigger animations when lastDmg changes
  useEffect(() => {
    if (!battleState?.lastDmg) return;
    const { value, isCrit, target, id } = battleState.lastDmg;
    if (prevDmg.current === id) return;
    prevDmg.current = id;

    const floatId = Date.now() + Math.random();
    setFloats(prev => [...prev, { value, isCrit, target, id: floatId }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== floatId)), 900);

    if (target === 'enemy') {
      setEnemyShake(true);
      setEnemyGlow(true);
      setTimeout(() => setEnemyShake(false), 400);
      setTimeout(() => setEnemyGlow(false), 350);
    } else {
      setPlayerShake(true);
      setPlayerGlow(true);
      setTimeout(() => setPlayerShake(false), 400);
      setTimeout(() => setPlayerGlow(false), 350);
    }

    setScreenFlash(isCrit ? 'crit' : target === 'player' ? 'hit' : null);
    setTimeout(() => setScreenFlash(null), 300);
  }, [battleState?.lastDmg?.id]);

  useEffect(() => {
    if (!battleState) return;
    if (battleState.turn === 'enemy' || battleState.turn === 'enemy_defend') {
      const t = setTimeout(onEnemyTurn, 900);
      return () => clearTimeout(t);
    }
    if (battleState.turn === 'resolved') {
      const t = setTimeout(onResolveVictory, 700);
      return () => clearTimeout(t);
    }
  }, [battleState?.turn]);

  if (!battleState) return null;

  const { enemy } = battleState;
  const enemyHpPct  = (enemy.hp / enemy.maxHp) * 100;
  const playerHpPct = (player.hp / player.maxHp) * 100;
  const isPlayerTurn = battleState.turn === 'player';
  const potions = player.inventory.filter(i => i.type === 'consumable');

  const hpColor = pct => pct > 60 ? 'var(--hp-green)' : pct > 30 ? 'var(--hp-yellow)' : 'var(--hp-red)';

  // Boss phase & next attack preview
  const bossPhase = battleState.bossPhase ?? 1;
  const bossPatternIdx = battleState.bossPatternIdx ?? 0;
  const nextAttackId = enemy.isBoss
    ? BOSS_PATTERNS[bossPhase === 2 ? 'phase2' : 'phase1'][bossPatternIdx % BOSS_PATTERNS[bossPhase === 2 ? 'phase2' : 'phase1'].length]
    : null;
  const nextAttack = nextAttackId ? BOSS_ATTACKS[nextAttackId] : null;

  return (
    <div className={`${styles.wrap} ${screenFlash === 'hit' ? styles.flashHit : ''} ${screenFlash === 'crit' ? styles.flashCrit : ''}`}>
      {enemy.isBoss && (
        <div className={styles.bossAlert}>
          <span>👑 BOSS — {enemy.name}</span>
          <span className={`${styles.bossPhase} ${bossPhase === 2 ? styles.phase2 : ''}`}>
            {bossPhase === 1 ? 'Phase 1' : '⚠️ Phase 2'}
          </span>
          {nextAttack && isPlayerTurn && (
            <span className={styles.nextAttack}>
              Next: <strong>{nextAttack.name}</strong>
            </span>
          )}
        </div>
      )}

      <div className={styles.arena}>
        {/* Enemy */}
        <div className={`${styles.combatant} ${styles.enemyCombatant}`}>
          <div className={styles.floatAnchor}>
            {floats.filter(f => f.target === 'enemy').map(f => (
              <FloatingNumber key={f.id} {...f} />
            ))}
            <div className={`${styles.sprite} ${enemyShake ? styles.shake : ''} ${enemyGlow ? styles.hitGlow : ''} ${(battleState.turn === 'enemy' || battleState.turn === 'enemy_defend') ? styles.attacking : ''}`}>
              {enemy.icon}
            </div>
          </div>
          <div className={styles.combatantName}>{enemy.name}</div>
          <div className={styles.combatantLevel}>Level {enemy.level}</div>
          <div className={styles.hpBar}>
            <div className={styles.hpFill} style={{ width: `${enemyHpPct}%`, background: hpColor(enemyHpPct) }} />
          </div>
          <div className={styles.hpText}>{enemy.hp} / {enemy.maxHp}</div>
        </div>

        <div className={styles.vsText}>⚔️</div>

        {/* Player */}
        <div className={`${styles.combatant} ${styles.playerCombatant}`}>
          <div className={styles.floatAnchor}>
            {floats.filter(f => f.target === 'player').map(f => (
              <FloatingNumber key={f.id} {...f} />
            ))}
            <div className={`${styles.sprite} ${playerShake ? styles.shake : ''} ${playerGlow ? styles.hitGlow : ''}`}>🧙</div>
          </div>
          <div className={styles.combatantName}>{player.name}</div>
          <div className={styles.combatantLevel}>Level {player.level}</div>
          <div className={styles.hpBar}>
            <div className={styles.hpFill} style={{ width: `${playerHpPct}%`, background: hpColor(playerHpPct) }} />
          </div>
          <div className={styles.hpText}>{player.hp} / {player.maxHp}</div>
          <div className={styles.statsRow}>
            <span>⚔️ {player.atk + player.weapon.atk + (battleState.buffs?.atk || 0)}</span>
            <span>🛡️ {player.def + player.armor.def}</span>
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className={styles.battleLog}>
        {[...log].slice(-6).reverse().map(entry => (
          <div key={entry.id} className={`${styles.logEntry} ${styles[entry.type] || ''}`}>
            {entry.msg}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <div className={styles.turnIndicator}>
          {isPlayerTurn ? '⚡ Your Turn' : '⏳ Enemy Turn...'}
        </div>
        <div className={styles.buttons}>
          <button className={`${styles.btn} ${styles.attackBtn}`} onClick={onAttack} disabled={!isPlayerTurn}>
            ⚔️ Attack
          </button>
          <button className={`${styles.btn} ${styles.defendBtn}`} onClick={onDefend} disabled={!isPlayerTurn}>
            🛡️ Defend
          </button>
          {potions.length > 0 && (
            <button className={`${styles.btn} ${styles.itemBtn}`} onClick={() => onUseItem(potions[0], true)} disabled={!isPlayerTurn}>
              {potions[0].icon} {potions[0].name}
            </button>
          )}
          <button className={`${styles.btn} ${styles.fleeBtn}`} onClick={onFlee} disabled={!isPlayerTurn}>
            💨 Flee
          </button>
        </div>
      </div>
    </div>
  );
}
