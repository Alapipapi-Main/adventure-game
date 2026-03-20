export const LOCATIONS = {
  village: {
    id: 'village',
    name: 'Ashenveil Village',
    description: 'A quiet village on the edge of a cursed forest. Torches flicker in the mist. The villagers whisper of shadows that move between the trees.',
    image: '🏘️',
    exits: ['forest_edge', 'tavern', 'blacksmith'],
    enemies: [],
    loot: [],
  },
  tavern: {
    id: 'tavern',
    name: 'The Broken Flagon',
    description: 'A dimly lit tavern thick with pipe smoke. The barkeeper eyes you with suspicion. A notice board near the door lists bounties on local monsters.',
    image: '🍺',
    exits: ['village'],
    enemies: [],
    loot: [{ id: 'health_potion', name: 'Health Potion', type: 'consumable', effect: 'heal', value: 40, icon: '🧪', description: 'Restores 40 HP' }],
    shopItems: true,
    hasQuestBoard: true,
  },
  blacksmith: {
    id: 'blacksmith',
    name: "Gregor's Forge",
    description: 'The ring of hammer on anvil fills the smoky air. Weapons of all kinds hang on the walls. The blacksmith Gregor looks up from his work.',
    image: '⚒️',
    exits: ['village'],
    enemies: [],
    loot: [],
    shopItems: true,
  },
  forest_edge: {
    id: 'forest_edge',
    name: 'Edge of the Dark Wood',
    description: 'The trees here are ancient and gnarled. Strange glowing eyes peer from the shadows. The path ahead winds deeper into darkness.',
    image: '🌲',
    exits: ['village', 'dark_wood', 'ruined_shrine'],
    enemies: ['goblin', 'wolf'],
    loot: [{ id: 'leather_scrap', name: 'Leather Scrap', type: 'material', value: 5, icon: '🟫', description: 'A piece of old leather' }],
  },
  dark_wood: {
    id: 'dark_wood',
    name: 'The Dark Wood',
    description: 'Twisted branches block out the moonlight. Bones litter the forest floor. Something large moves in the underbrush — watching you.',
    image: '🌑',
    exits: ['forest_edge', 'ancient_ruins'],
    enemies: ['orc', 'dark_wolf', 'forest_wraith'],
    loot: [{ id: 'magic_herb', name: 'Glowmoss', type: 'material', value: 15, icon: '🌿', description: 'A luminescent herb used in potions' }],
  },
  ruined_shrine: {
    id: 'ruined_shrine',
    name: 'Ruined Shrine of the Ancients',
    description: 'A forgotten shrine half-consumed by the forest. Strange runes glow faintly on the stones. An altar holds what appears to be a sealed chest.',
    image: '🗿',
    exits: ['forest_edge'],
    enemies: ['skeleton_warrior', 'cursed_shade'],
    loot: [
      { id: 'ancient_scroll', name: 'Ancient Scroll', type: 'key_item', value: 50, icon: '📜', description: 'A scroll written in a dead language' },
      { id: 'health_potion', name: 'Health Potion', type: 'consumable', effect: 'heal', value: 40, icon: '🧪', description: 'Restores 40 HP' },
    ],
  },
  ancient_ruins: {
    id: 'ancient_ruins',
    name: "Ancient Ruins of Vor'thaan",
    description: 'The ruins of a once-great civilization. The air crackles with dark magic. At the center looms a massive obsidian throne — and upon it sits the Shadow King.',
    image: '🏚️',
    exits: ['dark_wood'],
    enemies: ['stone_golem', 'shadow_knight'],
    loot: [
      { id: 'health_potion', name: 'Health Potion', type: 'consumable', effect: 'heal', value: 40, icon: '🧪', description: 'Restores 40 HP' },
      { id: 'elixir', name: 'Elixir of Power', type: 'consumable', effect: 'buff', value: 20, icon: '✨', description: 'Temporarily boosts ATK by 20' },
    ],
    boss: 'shadow_king',
  },
};

export const ENEMIES = {
  goblin: { id: 'goblin', name: 'Goblin Scout', icon: '👺', hp: 30, maxHp: 30, atk: 8, def: 2, xp: 20, gold: 10, level: 1 },
  wolf: { id: 'wolf', name: 'Dire Wolf', icon: '🐺', hp: 45, maxHp: 45, atk: 12, def: 3, xp: 30, gold: 8, level: 2 },
  orc: { id: 'orc', name: 'Orc Warrior', icon: '👹', hp: 70, maxHp: 70, atk: 18, def: 6, xp: 55, gold: 25, level: 3 },
  dark_wolf: { id: 'dark_wolf', name: 'Shadow Wolf', icon: '🐾', hp: 60, maxHp: 60, atk: 20, def: 5, xp: 50, gold: 15, level: 3 },
  forest_wraith: { id: 'forest_wraith', name: 'Forest Wraith', icon: '👻', hp: 55, maxHp: 55, atk: 22, def: 4, xp: 60, gold: 20, level: 4 },
  skeleton_warrior: { id: 'skeleton_warrior', name: 'Skeleton Warrior', icon: '💀', hp: 80, maxHp: 80, atk: 25, def: 8, xp: 80, gold: 35, level: 5 },
  cursed_shade: { id: 'cursed_shade', name: 'Cursed Shade', icon: '🌑', hp: 65, maxHp: 65, atk: 28, def: 6, xp: 85, gold: 40, level: 5 },
  stone_golem: { id: 'stone_golem', name: 'Stone Golem', icon: '🗿', hp: 120, maxHp: 120, atk: 30, def: 15, xp: 120, gold: 60, level: 6 },
  shadow_knight: { id: 'shadow_knight', name: 'Shadow Knight', icon: '⚔️', hp: 100, maxHp: 100, atk: 35, def: 12, xp: 130, gold: 70, level: 7 },
  shadow_king: { id: 'shadow_king', name: 'The Shadow King', icon: '👑', hp: 250, maxHp: 250, atk: 45, def: 20, xp: 500, gold: 200, level: 10, isBoss: true },
};

export const WEAPONS = [
  { id: 'rusty_sword', name: 'Rusty Sword', icon: '🗡️', atk: 5, price: 0, description: 'A worn blade, better than nothing', tier: 1 },
  { id: 'iron_sword', name: 'Iron Sword', icon: '⚔️', atk: 12, price: 80, description: 'A sturdy iron sword', tier: 2 },
  { id: 'steel_blade', name: 'Steel Blade', icon: '🔪', atk: 22, price: 200, description: 'Forged from fine steel', tier: 3 },
  { id: 'enchanted_sword', name: 'Enchanted Sword', icon: '✨', atk: 35, price: 450, description: 'Glows with arcane power', tier: 4 },
  { id: 'shadowbane', name: 'Shadowbane', icon: '🌟', atk: 55, price: 900, description: 'A legendary blade that slays darkness', tier: 5 },
];

export const ARMORS = [
  { id: 'cloth_rags', name: 'Cloth Rags', icon: '👕', def: 2, price: 0, description: 'Barely any protection', tier: 1 },
  { id: 'leather_armor', name: 'Leather Armor', icon: '🥋', def: 8, price: 60, description: 'Light and flexible', tier: 2 },
  { id: 'chainmail', name: 'Chainmail', icon: '🛡️', def: 16, price: 180, description: 'Interlocked steel rings', tier: 3 },
  { id: 'plate_armor', name: 'Plate Armor', icon: '⚜️', def: 28, price: 400, description: 'Heavy but near-impenetrable', tier: 4 },
  { id: 'shadow_plate', name: 'Shadow Plate', icon: '🌑', def: 42, price: 800, description: 'Forged from shadow-iron', tier: 5 },
];

export const SHOP_ITEMS = [
  { id: 'health_potion', name: 'Health Potion', type: 'consumable', effect: 'heal', value: 40, icon: '🧪', price: 30, description: 'Restores 40 HP' },
  { id: 'greater_potion', name: 'Greater Potion', type: 'consumable', effect: 'heal', value: 80, icon: '💊', price: 60, description: 'Restores 80 HP' },
  { id: 'elixir', name: 'Elixir of Power', type: 'consumable', effect: 'buff', value: 20, icon: '✨', price: 100, description: 'Boosts ATK by 20 for battle' },
  { id: 'antidote', name: 'Antidote', type: 'consumable', effect: 'cure', value: 0, icon: '🌿', price: 25, description: 'Cures poison' },
];

// ── Quest definitions ─────────────────────────────────────────────────────────
export const QUESTS = [
  {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Slay your first enemy to prove you are worthy.',
    icon: '🗡️',
    type: 'kill_any',
    goal: 1,
    reward: { gold: 30, xp: 50 },
  },
  {
    id: 'goblin_slayer',
    title: 'Goblin Slayer',
    description: 'The village is plagued by goblins. Kill 5 of them.',
    icon: '👺',
    type: 'kill_enemy',
    target: 'goblin',
    goal: 5,
    reward: { gold: 80, xp: 120 },
  },
  {
    id: 'wolf_hunter',
    title: 'Wolf Hunter',
    description: 'Dire wolves stalk the forest roads. Slay 3.',
    icon: '🐺',
    type: 'kill_enemy',
    target: 'wolf',
    goal: 3,
    reward: { gold: 60, xp: 90 },
  },
  {
    id: 'deep_explorer',
    title: 'Into the Dark',
    description: 'Venture into the Dark Wood and survive.',
    icon: '🌑',
    type: 'visit_location',
    target: 'dark_wood',
    goal: 1,
    reward: { gold: 50, xp: 80 },
  },
  {
    id: 'orc_bane',
    title: 'Orc Bane',
    description: 'Orcs have set up a camp in the Dark Wood. Defeat 3.',
    icon: '👹',
    type: 'kill_enemy',
    target: 'orc',
    goal: 3,
    reward: { gold: 120, xp: 200 },
  },
  {
    id: 'ruins_delver',
    title: 'Ruins Delver',
    description: 'Shadow Knights guard the Ancient Ruins. Cut down 3 of them to claim the bounty.',
    icon: '🏚️',
    type: 'kill_enemy',
    target: 'shadow_knight',
    goal: 3,
    reward: { gold: 250, xp: 450 },
  },
];

export const INITIAL_QUESTS = QUESTS.map(q => ({
  id: q.id,
  status: 'active',   // active | completed | claimed
  progress: 0,
}));

export const INITIAL_PLAYER = {
  name: 'Hero',
  level: 1,
  hp: 100,
  maxHp: 100,
  atk: 15,
  def: 5,
  xp: 0,
  xpToNext: 100,
  gold: 50,
  weapon: WEAPONS[0],
  armor: ARMORS[0],
  inventory: [
    { id: 'health_potion', name: 'Health Potion', type: 'consumable', effect: 'heal', value: 40, icon: '🧪', description: 'Restores 40 HP' },
  ],
  location: 'village',
  defeatedBosses: [],
  totalKills: 0,
};

export function getXpToNext(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getLevelStats(level) {
  return {
    maxHp: 100 + (level - 1) * 20,
    atk: 15 + (level - 1) * 5,
    def: 5 + (level - 1) * 2,
  };
}

// ── Difficulty settings ───────────────────────────────────────────────────────
export const DIFFICULTIES = {
  easy:   { id: 'easy',   label: 'Easy',   icon: '🌿', enemyAtkMult: 0.7,  enemyDefMult: 0.7,  enemyHpMult: 0.8,  goldMult: 1.2, xpMult: 1.0, description: 'Enemies deal less damage and have less HP' },
  normal: { id: 'normal', label: 'Normal', icon: '⚔️', enemyAtkMult: 1.0,  enemyDefMult: 1.0,  enemyHpMult: 1.0,  goldMult: 1.0, xpMult: 1.0, description: 'The intended experience' },
  hard:   { id: 'hard',   label: 'Hard',   icon: '💀', enemyAtkMult: 1.35, enemyDefMult: 1.25, enemyHpMult: 1.35, goldMult: 1.5, xpMult: 1.25, description: 'Tougher enemies, but greater rewards' },
};

// ── Boss attack patterns (Shadow King) ───────────────────────────────────────
export const BOSS_PATTERNS = {
  // Phase 1 (HP > 50%): normal rotation
  phase1: ['strike', 'strike', 'charge', 'strike', 'curse', 'strike', 'charge', 'strike'],
  // Phase 2 (HP <= 50%): more aggressive, adds dark_heal
  phase2: ['charge', 'strike', 'curse', 'charge', 'strike', 'dark_heal', 'charge', 'curse'],
};

export const BOSS_ATTACKS = {
  strike:    { name: 'Shadow Strike',  atkMult: 1.0,  log: (name) => `👑 ${name} strikes with a shadow blade!` },
  charge:    { name: 'Dark Charge',    atkMult: 1.6,  log: (name) => `💥 ${name} charges up and unleashes Dark Charge!` },
  curse:     { name: 'Void Curse',     atkMult: 0.8,  debuff: { def: -5 }, log: (name) => `🌑 ${name} casts Void Curse — your defences weaken!` },
  dark_heal: { name: 'Dark Ritual',    atkMult: 0.0,  heal: 40, log: (name) => `🩸 ${name} performs a Dark Ritual — restoring 40 HP!` },
};
