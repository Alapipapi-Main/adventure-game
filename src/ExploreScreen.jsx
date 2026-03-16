import { useState } from 'react';
import { LOCATIONS, ENEMIES } from './gameData';
import styles from './ExploreScreen.module.css';

export default function ExploreScreen({ player, quests, onTravel, onStartBattle, onShop, onQuestBoard, onRest, log }) {
  const location = LOCATIONS[player.location];
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      const enemyId = location.enemies[Math.floor(Math.random() * location.enemies.length)];
      onStartBattle(enemyId);
    }, 600);
  };

  const canRest     = player.location === 'village' || player.location === 'tavern';
  const hasShop     = location.shopItems;
  const hasQuestBoard = location.hasQuestBoard;
  const hasBoss     = location.boss && !player.defeatedBosses.includes(location.boss);
  const readyQuests = quests.filter(q => q.status === 'completed').length;

  return (
    <div className={styles.wrap}>
      <div className={styles.locationHeader}>
        <span className={styles.locationIcon}>{location.image}</span>
        <div>
          <h2 className={styles.locationName}>{location.name}</h2>
          <p className={styles.locationDesc}>{location.description}</p>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.actions}>
          <h3 className={styles.sectionTitle}>Actions</h3>

          {hasBoss && (
            <button className={`${styles.actionBtn} ${styles.bossBtn}`} onClick={() => onStartBattle(location.boss)}>
              <span>👑</span>
              <div>
                <div className={styles.btnTitle}>Challenge the Boss</div>
                <div className={styles.btnSub}>{ENEMIES[location.boss].name} awaits</div>
              </div>
            </button>
          )}

          {location.enemies.length > 0 && (
            <button className={`${styles.actionBtn} ${styles.fightBtn}`} onClick={handleSearch} disabled={searching}>
              <span>{searching ? '🔍' : '⚔️'}</span>
              <div>
                <div className={styles.btnTitle}>{searching ? 'Searching...' : 'Explore & Fight'}</div>
                <div className={styles.btnSub}>Search for enemies to battle</div>
              </div>
            </button>
          )}

          {hasQuestBoard && (
            <button className={`${styles.actionBtn} ${styles.questBtn}`} onClick={onQuestBoard}>
              <span>📜</span>
              <div>
                <div className={styles.btnTitle}>
                  Quest Board
                  {readyQuests > 0 && <span className={styles.questBadge}>{readyQuests} ready</span>}
                </div>
                <div className={styles.btnSub}>View bounties & claim rewards</div>
              </div>
            </button>
          )}

          {hasShop && (
            <button className={`${styles.actionBtn} ${styles.shopBtn}`} onClick={onShop}>
              <span>🛒</span>
              <div>
                <div className={styles.btnTitle}>Visit Shop</div>
                <div className={styles.btnSub}>Buy weapons, armor & potions</div>
              </div>
            </button>
          )}

          {canRest && (
            <button className={`${styles.actionBtn} ${styles.restBtn}`} onClick={onRest}>
              <span>🌙</span>
              <div>
                <div className={styles.btnTitle}>Rest</div>
                <div className={styles.btnSub}>Restore all HP (free)</div>
              </div>
            </button>
          )}

          <div className={styles.divider}>Travel to</div>

          {location.exits.map(exitId => {
            const exit = LOCATIONS[exitId];
            return (
              <button key={exitId} className={`${styles.actionBtn} ${styles.travelBtn}`} onClick={() => onTravel(exitId)}>
                <span>{exit.image}</span>
                <div>
                  <div className={styles.btnTitle}>{exit.name}</div>
                  <div className={styles.btnSub}>
                    {exit.enemies.length > 0 ? '⚔️ Dangerous' : '🕊️ Safe area'}
                    {exit.boss && !player.defeatedBosses.includes(exit.boss) ? ' · Boss here' : ''}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className={styles.logPanel}>
          <h3 className={styles.sectionTitle}>Adventure Log</h3>
          <div className={styles.log}>
            {log.length === 0 && <div className={styles.logEmpty}>Your adventure begins…</div>}
            {[...log].reverse().map(entry => (
              <div key={entry.id} className={`${styles.logEntry} ${styles[entry.type] || ''}`}>
                {entry.msg}
              </div>
            ))}
          </div>

          <div className={styles.playerStats}>
            <h4 className={styles.statsTitle}>Equipment</h4>
            <div className={styles.statsGrid}>
              <div className={styles.stat}><span>Weapon</span><span>{player.weapon.icon} {player.weapon.name} (+{player.weapon.atk} ATK)</span></div>
              <div className={styles.stat}><span>Armor</span><span>{player.armor.icon} {player.armor.name} (+{player.armor.def} DEF)</span></div>
              <div className={styles.stat}><span>Total ATK</span><span>{player.atk + player.weapon.atk}</span></div>
              <div className={styles.stat}><span>Total DEF</span><span>{player.def + player.armor.def}</span></div>
              <div className={styles.stat}><span>Kills</span><span>⚔️ {player.totalKills}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
