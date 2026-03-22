import { DIFFICULTIES } from './gameData';
import styles from './InventoryModal.module.css';

export default function InventoryModal({ player, onUse, onClose, difficulty, battleState }) {
  const perks        = player.perks        || [];
  const critChance   = player.critChance   ?? 0.15;
  const critMult     = player.critMult     ?? 1.75;
  const poisonChance = player.poisonChance ?? 0;
  const burnChance   = player.burnChance   ?? 0;
  const defPen       = player.defPen       ?? 0;
  const alwaysFlee   = player.alwaysFlee   ?? false;
  const diff         = DIFFICULTIES[difficulty] ?? DIFFICULTIES.normal;

  // Perk ATK/DEF bonuses = (current stat) - base from level - weapon/armor
  const baseLevelAtk = 15 + (player.level - 1) * 5;
  const baseLevelDef = 5  + (player.level - 1) * 2;
  const perkAtk = player.atk - baseLevelAtk;
  const perkDef = player.def - baseLevelDef;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>🎒 Inventory</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Equipment</h3>
            <div className={styles.equipRow}>
              <div className={styles.equip}>
                <span>{player.weapon.icon}</span>
                <div>
                  <div className={styles.equipName}>{player.weapon.name}</div>
                  <div className={styles.equipStat}>+{player.weapon.atk} ATK</div>
                </div>
              </div>
              <div className={styles.equip}>
                <span>{player.armor.icon}</span>
                <div>
                  <div className={styles.equipName}>{player.armor.name}</div>
                  <div className={styles.equipStat}>+{player.armor.def} DEF</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Items ({player.inventory.length})</h3>
            {player.inventory.length === 0 && (
              <p className={styles.empty}>Your bag is empty.</p>
            )}
            <div className={styles.items}>
              {player.inventory.map((item, idx) => (
                <div key={idx} className={styles.item}>
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemDesc}>{item.description}</div>
                  </div>
                  {(() => {
                    const alreadyActive = item.effect === 'evasion_tonic' &&
                      battleState && (battleState.buffs?.dodgeChance ?? 0) > 0;
                    return (
                      <button
                        className={styles.useBtn}
                        onClick={() => { if (!alreadyActive) { onUse(item); onClose(); } }}
                        disabled={alreadyActive}
                        title={alreadyActive ? 'Already active this battle' : ''}
                      >
                        {alreadyActive ? '✓ Active' : 'Use'}
                      </button>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Character Stats</h3>
            <div className={styles.statsGrid}>
              <div className={styles.stat}><span>Level</span><span>{player.level}</span></div>
              <div className={styles.stat}><span>Difficulty</span><span>{diff.icon} {diff.label}</span></div>
              <div className={styles.stat}><span>HP</span><span>{player.hp} / {player.maxHp}</span></div>

              {/* ATK breakdown */}
              <div className={styles.stat}>
                <span>Total ATK</span>
                <span className={styles.statMain}>{player.atk + player.weapon.atk}</span>
              </div>
              <div className={styles.statBreak}>
                <span>Base Lv.{player.level}</span><span>+{baseLevelAtk}</span>
              </div>
              {perkAtk > 0 && <div className={styles.statBreak}><span>🔮 Perks</span><span className={styles.perkBonus}>+{perkAtk}</span></div>}
              <div className={styles.statBreak}><span>{player.weapon.icon} {player.weapon.name}</span><span>+{player.weapon.atk}</span></div>

              {/* DEF breakdown */}
              <div className={styles.stat}>
                <span>Total DEF</span>
                <span className={styles.statMain}>{player.def + player.armor.def}</span>
              </div>
              <div className={styles.statBreak}>
                <span>Base Lv.{player.level}</span><span>+{baseLevelDef}</span>
              </div>
              {perkDef > 0 && <div className={styles.statBreak}><span>🛡️ Perks</span><span className={styles.perkBonus}>+{perkDef}</span></div>}
              <div className={styles.statBreak}><span>{player.armor.icon} {player.armor.name}</span><span>+{player.armor.def}</span></div>

              {/* Crit */}
              <div className={styles.stat}><span>Crit Chance</span><span>{Math.round(critChance * 100)}%</span></div>
              <div className={styles.stat}><span>Crit Damage</span><span>{critMult.toFixed(2)}×</span></div>

              {/* Special perk stats — only shown if unlocked */}
              {poisonChance > 0 && <div className={styles.stat}><span>🐍 Poison Chance</span><span className={styles.perkBonus}>{Math.round(poisonChance * 100)}%</span></div>}
              {burnChance   > 0 && <div className={styles.stat}><span>🔥 Burn Chance</span><span className={styles.perkBonus}>{Math.round(burnChance * 100)}%</span></div>}
              {defPen       > 0 && <div className={styles.stat}><span>🗡️ DEF Penetration</span><span className={styles.perkBonus}>{defPen}</span></div>}
              {alwaysFlee       && <div className={styles.stat}><span>👤 Flee</span><span className={styles.perkBonus}>Always succeeds</span></div>}
              {(player.critBurn || false) && <div className={styles.stat}><span>🔥 Crit Burn</span><span className={styles.perkBonus}>Active</span></div>}

              <div className={styles.stat}><span>Gold</span><span>💰 {player.gold}</span></div>
              <div className={styles.stat}><span>Kills</span><span>⚔️ {player.totalKills}</span></div>

              {perks.length > 0 && (
                <div className={styles.stat}><span>Perks</span><span>{perks.length} unlocked</span></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
