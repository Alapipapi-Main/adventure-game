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
    loot: [],
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
    hasCrafting: true,
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
    exits: ['forest_edge', 'sunken_dungeon', 'ancient_ruins'],
    enemies: ['orc', 'dark_wolf', 'forest_wraith'],
    loot: [{ id: 'magic_herb', name: 'Glowmoss', type: 'material', value: 15, icon: '🌿', description: 'A luminescent herb used in potions' }],
  },
  sunken_dungeon: {
    id: 'sunken_dungeon',
    name: 'The Sunken Dungeon',
    description: 'Collapsed stone corridors stretch into flooded darkness. The air reeks of mould and old blood. Something heavy drags itself through the standing water below.',
    image: '🕳️',
    exits: ['dark_wood', 'ancient_ruins'],
    enemies: ['cave_troll', 'bone_archer', 'phantom_knight'],
    loot: [
      { id: 'greater_potion', name: 'Greater Potion', type: 'consumable', effect: 'heal', value: 80, icon: '💊', description: 'Restores 80 HP' },
      { id: 'piercing_oil', name: 'Piercing Oil', type: 'consumable', effect: 'piercing_oil', value: 15, icon: '🗡️', description: 'Boosts DEF penetration by 15 for this battle' },
    ],
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
    exits: ['dark_wood', 'sunken_dungeon'],
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
  cave_troll: { id: 'cave_troll', name: 'Cave Troll', icon: '🪨', hp: 130, maxHp: 130, atk: 22, def: 10, xp: 100, gold: 45, level: 5 },
  bone_archer: { id: 'bone_archer', name: 'Bone Archer', icon: '🏹', hp: 55, maxHp: 55, atk: 32, def: 4, xp: 95, gold: 50, level: 5 },
  phantom_knight: { id: 'phantom_knight', name: 'Phantom Knight', icon: '👻', hp: 85, maxHp: 85, atk: 28, def: 8, xp: 110, gold: 55, level: 6, dodgeChance: 0.20 },
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
  { id: 'health_potion',   name: 'Health Potion',   type: 'consumable', effect: 'heal',         value: 40,  icon: '🧪', price: 30,  description: 'Restores 40 HP' },
  { id: 'greater_potion',  name: 'Greater Potion',  type: 'consumable', effect: 'heal',         value: 80,  icon: '💊', price: 60,  description: 'Restores 80 HP' },
  { id: 'supreme_potion',  name: 'Supreme Potion',  type: 'consumable', effect: 'heal',         value: 150, icon: '⚗️', price: 120, description: 'Restores 150 HP — for the toughest fights' },
  { id: 'elixir',          name: 'Elixir of Power', type: 'consumable', effect: 'buff',         value: 20,  icon: '✨', price: 100, description: 'Boosts ATK by 20 for this battle' },
  { id: 'antidote',        name: 'Antidote',        type: 'consumable', effect: 'cure',         value: 0,   icon: '🌿', price: 25,  description: 'Cures poison and burn' },
  { id: 'venom_vial',      name: 'Venom Vial',      type: 'consumable', effect: 'inflict_poison', value: 0,  icon: '🐍', price: 60,  description: 'Poisons the enemy for 3 turns (8 dmg/turn)' },
  { id: 'flame_scroll',    name: 'Flame Scroll',    type: 'consumable', effect: 'inflict_burn',   value: 0,  icon: '🔥', price: 80,  description: 'Burns the enemy for 2 turns (12 dmg/turn)' },
  { id: 'evasion_tonic',   name: 'Evasion Tonic',   type: 'consumable', effect: 'evasion_tonic',  value: 0,  icon: '🪬', price: 75,  description: 'Grants 30% dodge chance for this battle' },
  { id: 'piercing_oil',    name: 'Piercing Oil',    type: 'consumable', effect: 'piercing_oil',   value: 15, icon: '🗡️', price: 90,  description: 'Boosts DEF penetration by 15 for this battle' },
];

// ── Crafting recipes ──────────────────────────────────────────────────────────
export const RECIPES = [
  {
    id: 'healing_salve',
    name: 'Healing Salve',
    icon: '🩹',
    description: 'A thick salve that restores 60 HP — better than a Health Potion.',
    materials: [{ id: 'leather_scrap', name: 'Leather Scrap', icon: '🟫', qty: 2 }],
    result: { id: 'healing_salve', name: 'Healing Salve', type: 'consumable', effect: 'heal', value: 60, icon: '🩹', description: 'Restores 60 HP' },
  },
  {
    id: 'reinforced_wrap',
    name: 'Reinforced Wrap',
    icon: '🪢',
    description: 'Strips of hardened leather wrapped around your armour. +10 DEF for one battle.',
    materials: [{ id: 'leather_scrap', name: 'Leather Scrap', icon: '🟫', qty: 3 }],
    result: { id: 'reinforced_wrap', name: 'Reinforced Wrap', type: 'consumable', effect: 'reinforced_wrap', value: 10, icon: '🪢', description: '+10 DEF for this battle' },
  },
  {
    id: 'glowing_draught',
    name: 'Glowing Draught',
    icon: '💚',
    description: 'A potion infused with Glowmoss energy. Restores 100 HP.',
    materials: [
      { id: 'magic_herb', name: 'Glowmoss', icon: '🌿', qty: 1 },
      { id: 'health_potion', name: 'Health Potion', icon: '🧪', qty: 1 },
    ],
    result: { id: 'glowing_draught', name: 'Glowing Draught', type: 'consumable', effect: 'heal', value: 100, icon: '💚', description: 'Restores 100 HP' },
  },
  {
    id: 'toxic_flask',
    name: 'Toxic Flask',
    icon: '☠️',
    description: 'A concentrated Glowmoss extract. Poisons enemy for 4 turns (8 dmg/turn) — stronger than a Venom Vial.',
    materials: [{ id: 'magic_herb', name: 'Glowmoss', icon: '🌿', qty: 2 }],
    result: { id: 'toxic_flask', name: 'Toxic Flask', type: 'consumable', effect: 'inflict_poison_long', value: 4, icon: '☠️', description: 'Poisons enemy for 4 turns (8 dmg/turn)' },
  },
  {
    id: 'leather_pouch',
    name: 'Leather Pouch',
    icon: '👝',
    description: 'A sturdy pouch that expands your battle item slots from 3 to 5.',
    materials: [
      { id: 'leather_scrap', name: 'Leather Scrap', icon: '🟫', qty: 3 },
      { id: 'magic_herb', name: 'Glowmoss', icon: '🌿', qty: 1 },
    ],
    result: { id: 'leather_pouch', name: 'Leather Pouch', type: 'passive', effect: 'expand_slots', value: 2, icon: '👝', description: 'Expands battle item slots to 5' },
  },
];
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
  id: 'shadow_hunter',
  title: 'Shadow Hunter',
  description: 'Defeat 5 Shadow Wolves lurking in the Dark Wood.',
  icon: '🐾',
  type: 'kill_enemy',
  target: 'dark_wolf',
  goal: 5,
  reward: { gold: 220, xp: 350 },
  },
  {
    id: 'shrine_seeker',
    title: 'Shrine Seeker',
    description: 'Seek out the Ruined Shrine of the Ancients hidden deep in the forest.',
    icon: '🗿',
    type: 'visit_location',
    target: 'ruined_shrine',
    goal: 1,
    reward: { gold: 70, xp: 110 },
  },
  {
    id: 'bone_breaker',
    title: 'Bone Breaker',
    description: 'Skeleton Warriors guard the shrine. Shatter 3 of them.',
    icon: '💀',
    type: 'kill_enemy',
    target: 'skeleton_warrior',
    goal: 3,
    reward: { gold: 140, xp: 240 },
  },
  {
    id: 'shade_hunter',
    title: 'Shade Hunter',
    description: 'Cursed Shades haunt the shrine grounds. Banish 3 of them.',
    icon: '🌑',
    type: 'kill_enemy',
    target: 'cursed_shade',
    goal: 3,
    reward: { gold: 150, xp: 260 },
  },
  {
    id: 'golem_smasher',
    title: 'Golem Smasher',
    description: 'Stone Golems block the path to the Shadow King. Destroy 2.',
    icon: '🗿',
    type: 'kill_enemy',
    target: 'stone_golem',
    goal: 2,
    reward: { gold: 180, xp: 300 },
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
  {
    id: 'poison_master',
    title: 'Poison Master',
    description: 'Inflict poison on 5 enemies using Venom Blade, Death Mark, or a Venom Vial.',
    icon: '🐍',
    type: 'inflict_status',
    target: 'poison',
    goal: 5,
    reward: { gold: 160, xp: 280 },
  },
  {
    id: 'pyromancer',
    title: 'Pyromancer',
    description: 'Burn 5 enemies using Fire Touch, Inferno, Archmage, or a Flame Scroll.',
    icon: '🔥',
    type: 'inflict_status',
    target: 'burn',
    goal: 5,
    reward: { gold: 190, xp: 320 },
  },
  {
    id: 'dungeon_explorer',
    title: 'Dungeon Explorer',
    description: 'Descend into the Sunken Dungeon and face what lurks in the dark.',
    icon: '🕳️',
    type: 'visit_location',
    target: 'sunken_dungeon',
    goal: 1,
    reward: { gold: 90, xp: 140 },
  },
  {
    id: 'troll_slayer',
    title: 'Troll Slayer',
    description: 'Cave Trolls guard the dungeon corridors. Crush 3 of them.',
    icon: '🪨',
    type: 'kill_enemy',
    target: 'cave_troll',
    goal: 3,
    reward: { gold: 160, xp: 270 },
  },
  {
    id: 'archer_down',
    title: 'Archer Down',
    description: 'Bone Archers pick off intruders from the shadows. Silence 3 of them.',
    icon: '🏹',
    type: 'kill_enemy',
    target: 'bone_archer',
    goal: 3,
    reward: { gold: 170, xp: 280 },
  },
  {
    id: 'ghost_buster',
    title: 'Ghost Buster',
    description: 'Phantom Knights phase in and out of reality. Destroy 3 of these elusive foes.',
    icon: '👻',
    type: 'kill_enemy',
    target: 'phantom_knight',
    goal: 3,
    reward: { gold: 200, xp: 340 },
  },
  {
    id: 'apprentice_crafter',
    title: 'Apprentice Crafter',
    description: 'Gregor will teach you his trade. Craft 3 items at the Forge.',
    icon: '⚒️',
    type: 'craft_any',
    goal: 3,
    reward: { gold: 120, xp: 180 },
  },
  {
    id: 'toxic_brewer',
    title: 'Toxic Brewer',
    description: 'Master the art of poison. Craft a Toxic Flask from concentrated Glowmoss.',
    icon: '☠️',
    type: 'craft_specific',
    target: 'toxic_flask',
    goal: 1,
    reward: { gold: 180, xp: 280 },
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
  perks: [],          // array of perk ids earned
  critChance: 0.15,   // base 15%, increased by Rogue perks
  critMult: 1.75,     // base 1.75×, increased by Assassin
  poisonChance: 0,    // unlocked by Venom Blade
  burnChance: 0,      // unlocked by Fire Touch
  defPen: 0,          // DEF penetration from Spellblade
  alwaysFlee: false,  // unlocked by Shadowstep
  statusEffects: [],  // active status effects: { id, turnsLeft }
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
  easy:   { id: 'easy',   label: 'Easy',   icon: '🌿', enemyAtkMult: 0.7,  enemyDefMult: 0.7,  enemyHpMult: 0.8,  goldMult: 0.7, xpMult: 0.75, description: 'Enemies are weaker, but rewards are reduced' },
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

// ── Skill tree ────────────────────────────────────────────────────────────────
export const SKILL_PATHS = {
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    icon: '🛡️',
    color: '#3498db',
    description: 'Tank path — more HP and defence',
    perks: [
      { id: 'iron_skin',    name: 'Iron Skin',     icon: '🛡️', description: '+15 max HP, +3 DEF',           bonuses: { maxHp: 15, def: 3 } },
      { id: 'fortitude',   name: 'Fortitude',     icon: '💪', description: '+25 max HP, +5 DEF',           bonuses: { maxHp: 25, def: 5 } },
      { id: 'bulwark',     name: 'Bulwark',       icon: '🏰', description: '+40 max HP, Defend blocks 50% more damage', bonuses: { maxHp: 40, defendBonus: 10 } },
      { id: 'titan',       name: 'Titan',         icon: '⚓', description: '+50 max HP, +8 DEF',           bonuses: { maxHp: 50, def: 8 } },
      { id: 'juggernaut',  name: 'Juggernaut',    icon: '🗿', description: '+60 max HP, +10 DEF',          bonuses: { maxHp: 60, def: 10 } },
    ],
  },
  rogue: {
    id: 'rogue',
    name: 'Rogue',
    icon: '🗡️',
    color: '#e74c3c',
    description: 'Crit path — higher crit chance and poison attacks',
    perks: [
      { id: 'keen_eye',    name: 'Keen Eye',      icon: '👁️', description: '+10% crit chance',            bonuses: { critChance: 0.10 } },
      { id: 'venom_blade', name: 'Venom Blade',   icon: '🐍', description: 'Attacks have 25% chance to poison enemies (3 turns, 8 dmg/turn)', bonuses: { poisonChance: 0.25 } },
      { id: 'shadowstep',  name: 'Shadowstep',    icon: '👤', description: 'Flee always succeeds',        bonuses: { alwaysFlee: true } },
      { id: 'assassin',    name: 'Assassin',      icon: '🎯', description: '+15% crit chance, crits deal 2.5× damage', bonuses: { critChance: 0.15, critMult: 0.75 } },
      { id: 'deathmark',   name: 'Death Mark',    icon: '💀', description: '+20% crit chance, 40% poison chance', bonuses: { critChance: 0.20, poisonChance: 0.15 } },
    ],
  },
  mage: {
    id: 'mage',
    name: 'Mage',
    icon: '🔮',
    color: '#9b59b6',
    description: 'ATK path — high damage and burn attacks',
    perks: [
      { id: 'arcane_focus', name: 'Arcane Focus', icon: '🔮', description: '+8 ATK',                      bonuses: { atk: 8 } },
      { id: 'fire_touch',   name: 'Fire Touch',   icon: '🔥', description: 'Attacks have 25% chance to burn enemies (2 turns, 12 dmg/turn)', bonuses: { burnChance: 0.25 } },
      { id: 'spellblade',   name: 'Spellblade',   icon: '⚡', description: '+12 ATK, spells ignore 5 enemy DEF', bonuses: { atk: 12, defPen: 5 } },
      { id: 'inferno',      name: 'Inferno',      icon: '🌋', description: '+15 ATK, 40% burn chance',    bonuses: { atk: 15, burnChance: 0.15 } },
      { id: 'archmage',     name: 'Archmage',     icon: '🌟', description: '+20 ATK, crits always burn',  bonuses: { atk: 20, critBurn: true } },
    ],
  },
};

// ── Status effects ────────────────────────────────────────────────────────────
export const STATUS_EFFECTS = {
  poison: { id: 'poison', name: 'Poison',  icon: '🐍', color: '#2ecc71', damage: 8,  duration: 3, description: 'Takes 8 damage per turn for 3 turns' },
  burn:   { id: 'burn',   name: 'Burn',    icon: '🔥', color: '#e67e22', damage: 12, duration: 2, description: 'Takes 12 damage per turn for 2 turns' },
  stun:   { id: 'stun',   name: 'Stunned', icon: '💫', color: '#f1c40f', damage: 0,  duration: 1, description: 'Skips next turn' },
};

// Enemies that can inflict status effects on the player
export const ENEMY_STATUS_CHANCE = {
  forest_wraith:  { effect: 'poison', chance: 0.30 },
  cursed_shade:   { effect: 'poison', chance: 0.35 },
  stone_golem:    { effect: 'stun',   chance: 0.25 },
  shadow_knight:  { effect: 'burn',   chance: 0.20 },
  phantom_knight: { effect: 'poison', chance: 0.25 },
};

// Enemies that can dodge player attacks
export const ENEMY_DODGE_CHANCE = {
  phantom_knight: 0.20,
};
