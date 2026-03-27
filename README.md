# ⚔️ Shadows of Vor'thaan

A dark fantasy action/adventure browser RPG built with **React + Vite**. No external game libraries — all logic, audio, and UI are hand-crafted.

## 🎮 Gameplay

- **Explore** 7 unique locations across a cursed land
- **Battle** 13 enemy types in turn-based combat, including a final boss with multiple attack phases
- **Level up** — at every odd level (3, 5, 7, 9, 11...) a skill tree popup lets you choose a permanent perk — until all paths are mastered
- **Status effects** — Poison, Burn, and Stun affect both players and enemies
- **Dodge mechanic** — Phantom Knights phase through attacks; Evasion Tonic gives you the same ability
- **Craft items** at Gregor's Forge — combine Leather Scrap and Glowmoss into salves, wraps, draughts, and more
- **Loot drops** — enemies have a 40% chance to drop materials or consumables from their location
- **Equip** weapons and armor from the shop (5 tiers each)
- **Use items** like potions, elixirs, antidotes, venom vials, and flame scrolls in battle
- **Defend** to reduce incoming damage on the next hit
- **Flee** from battles (60% success rate, 100% with Shadowstep perk)
- **Complete quests** from the Tavern notice board for bonus gold and XP
- **World Map** — animated SVG map showing all 7 locations with fog of war, travel by clicking reachable nodes
- **Bestiary** — discover all 13 enemy types, track kill counts and first encounter dates

## 🌳 Skill Tree

At every odd level from 3 upward (3, 5, 7, 9, 11...) a perk picker appears — until all 15 perks across all paths are unlocked. Choose one perk from three paths — choices are permanent for the run.

### 🛡️ Warrior Path — Tank
| Perk | Effect |
|------|--------|
| Iron Skin | +15 max HP, +3 DEF |
| Fortitude | +25 max HP, +5 DEF |
| Bulwark | +40 max HP, Defend blocks 50% more damage |
| Titan | +50 max HP, +8 DEF |
| Juggernaut | +60 max HP, +10 DEF |

### 🗡️ Rogue Path — Crit & Poison
| Perk | Effect |
|------|--------|
| Keen Eye | +10% crit chance |
| Venom Blade | 25% chance to poison enemies on hit |
| Shadowstep | Flee always succeeds |
| Assassin | +15% crit chance, crits deal 2.5× damage |
| Death Mark | +20% crit chance, 40% poison chance |

### 🔮 Mage Path — ATK & Burn
| Perk | Effect |
|------|--------|
| Arcane Focus | +8 ATK |
| Fire Touch | 25% chance to burn enemies on hit |
| Spellblade | +12 ATK, attacks ignore 5 enemy DEF |
| Inferno | +15 ATK, 40% burn chance |
| Archmage | +20 ATK, crits always burn |

## ☠️ Status Effects

| Effect | Source | Damage | Duration |
|--------|--------|--------|----------|
| 🐍 Poison | Rogue perks, Forest Wraith, Cursed Shade | 8/turn | 3 turns |
| 🔥 Burn | Mage perks, Shadow Knight | 12/turn | 2 turns |
| 💫 Stun | Stone Golem | Skip turn | 1 turn |

Use an **Antidote** to cure Poison and Burn instantly.

## 🎭 Character Setup

When starting a new game, you choose:

- **Hero Name** — personalise your character (up to 20 characters)
- **Difficulty** — affects all enemy stats and rewards for the entire run

| Difficulty | Enemy ATK | Enemy DEF | Enemy HP | Gold | XP |
|-----------|-----------|-----------|----------|------|----|
| 🌿 Easy   | ×0.7      | ×0.7      | ×0.8     | ×0.7 | ×0.75 |
| ⚔️ Normal | ×1.0      | ×1.0      | ×1.0     | ×1.0 | ×1.0 |
| 💀 Hard   | ×1.35     | ×1.25     | ×1.35    | ×1.5 | ×1.25 |

## 👑 Shadow King Boss Patterns

**Phase 1** (HP > 50%): Shadow Strike → Dark Charge → Void Curse rotation

**Phase 2** (HP ≤ 50%): Adds Dark Ritual (self-heal 40 HP), more aggressive rotation

The next attack is previewed in the battle UI.

## 🗺️ Locations

| Location | Danger | Enemies | Loot Drops |
|----------|--------|---------|------------|
| Ashenveil Village | Safe | — | — |
| The Broken Flagon (Tavern) | Safe | — | — |
| Gregor's Forge (Blacksmith) | Safe | — | — |
| Edge of the Dark Wood | Low | Goblins, Dire Wolves | 🟫 Leather Scrap |
| The Dark Wood | Medium | Orcs, Shadow Wolves, Wraiths | 🌿 Glowmoss |
| Ruined Shrine of the Ancients | High | Skeleton Warriors, Cursed Shades | Health Potion, Ancient Scroll |
| The Sunken Dungeon | High | Cave Trolls, Bone Archers, Phantom Knights | Greater Potion, Piercing Oil |
| Ancient Ruins of Vor'thaan | Boss | Stone Golems, Shadow Knights + Shadow King | Health Potion, Elixir of Power |

## ⚒️ Crafting System

Visit **Gregor's Forge** (Blacksmith) and select **Craft Items** to combine materials dropped during exploration into powerful consumables.

| Recipe | Materials | Result |
|--------|-----------|--------|
| Healing Salve | 2× Leather Scrap | Restores 60 HP |
| Reinforced Wrap | 3× Leather Scrap | +10 DEF for one battle |
| Glowing Draught | 1× Glowmoss + 1× Health Potion | Restores 100 HP |
| Toxic Flask | 2× Glowmoss | Poisons enemy for 4 turns |
| Leather Pouch | 3× Leather Scrap + 1× Glowmoss | Expands battle item slots to 5 |

Materials drop during exploration: **Leather Scrap** from the Forest Edge, **Glowmoss** from the Dark Wood.

## 📜 Quest System

20 quests available from the Tavern quest board:

| Quest | Goal | Reward |
|-------|------|--------|
| First Blood | Slay 1 enemy | 30g + 50 XP |
| Goblin Slayer | Slay 5 Goblins | 80g + 120 XP |
| Wolf Hunter | Slay 3 Dire Wolves | 60g + 90 XP |
| Into the Dark | Visit the Dark Wood | 50g + 80 XP |
| Orc Bane | Slay 3 Orcs | 120g + 200 XP |
| Shrine Seeker | Visit the Ruined Shrine | 70g + 110 XP |
| Bone Breaker | Slay 3 Skeleton Warriors | 140g + 240 XP |
| Shade Hunter | Banish 3 Cursed Shades | 150g + 260 XP |
| Golem Smasher | Destroy 2 Stone Golems | 180g + 300 XP |
| Ruins Delver | Slay 3 Shadow Knights | 250g + 450 XP |
| Poison Master | Inflict poison on 5 enemies | 160g + 280 XP |
| Pyromancer | Burn 5 enemies | 190g + 320 XP |
| Dungeon Explorer | Visit the Sunken Dungeon | 90g + 140 XP |
| Troll Slayer | Crush 3 Cave Trolls | 160g + 270 XP |
| Archer Down | Silence 3 Bone Archers | 170g + 280 XP |
| Ghost Buster | Destroy 3 Phantom Knights | 200g + 340 XP |
| Apprentice Crafter | Craft 3 items at the Forge | 120g + 180 XP |
| Toxic Brewer | Craft a Toxic Flask | 180g + 280 XP |

## 🏆 Achievements & Bestiary

Press the **🏆** button in the HUD to open the panel. Achievements persist across all runs in a separate `localStorage` key — erasing a save slot never resets them.

### Achievement Categories
| Category | Achievements |
|----------|-------------|
| ⚔️ Combat | First Blood, Veteran (50 kills), Warlord (100 kills), Untouchable, Flawless, Boss Slayer, Poisoner, Pyromaniac |
| 🗺️ Exploration | Explorer (all 7 locations), Dungeon Diver, Shrine Seeker |
| 📜 Quests | Bounty Hunter (5 quests), Quest Master (all 20) |
| 🌳 Skills | First Step, Path Chosen (5 perks), Fully Mastered (15 perks) |
| ⚒️ Crafting | Tinker (first craft), Master Crafter (5 crafts) |
| 📖 Bestiary | Monster Hunter (encounter all 13), Exterminator (kill all types) |
| 💀 Difficulty | Hardened (beat on Hard), Speed Runner (beat below level 8) |

### 📖 Bestiary
The Bestiary tab shows every enemy in the game. Undiscovered enemies appear as **???** until you fight them. Each entry shows level, your kill count, and first encounter date.

## 💾 Save System

- **3 save slots** — each slot is independent and never overwrites another
- **Auto-save** triggers after every meaningful action
- **Retry on death** — reloads your slot with HP fully restored
- **Victory clears the slot** automatically

## 🎵 Audio System

All audio is procedurally generated via the **Web Audio API** — no audio files needed.

| Track | Plays during |
|-------|-------------|
| Title | Title screen |
| Explore | World exploration |
| Battle | Regular enemy combat |
| Boss | Shadow King encounter |
| Game Over | Death screen |
| Victory | Victory screen |
| Shop | Shop modal |

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 🏗️ Build for Production

```bash
npm run build
```

## 🛠️ Tech Stack

- **React 19** + **Vite 6**
- **CSS Modules** for scoped component styling
- **Web Audio API** for procedural music and sound effects
- **localStorage** for save slots and audio preferences
- Google Fonts: Cinzel Decorative, Cinzel, Crimson Text
- **Zero external runtime dependencies**

## 📁 Project Structure

```
src/
├── App.jsx                # Root component, screen router, audio wiring
├── App.css                # Global styles + toast notifications
├── index.css              # CSS variables & resets
├── main.jsx               # Entry point
├── gameData.js            # Locations, enemies, items, quests, skills, status effects, recipes
├── useGameState.js        # All game logic (battle, quests, crafting, save slots, skills)
├── useAudio.js            # Procedural music & SFX via Web Audio API
├── HUD.jsx                # Sticky stats bar
├── ExploreScreen.jsx      # World navigation & action panel
├── BattleScreen.jsx       # Turn-based combat with animations & status effects
├── ShopScreen.jsx         # Buy weapons, armor & consumables
├── achievementData.js     # Achievement definitions and localStorage helpers
├── useAchievements.js     # Achievement check hook
├── AchievementPanel.jsx   # Achievements & Bestiary tabbed panel
├── WorldMap.jsx           # Animated SVG world map with fog of war
├── InventoryModal.jsx     # View & use carried items
├── QuestBoard.jsx         # Quest list with progress & claim rewards
├── SkillTreeModal.jsx     # Level-up perk picker
├── SaveSlotPicker.jsx     # 3-slot save/load picker modal
├── NewGameSetup.jsx       # Character name & difficulty selection
├── AudioSettings.jsx      # Music & SFX volume sliders
└── SpecialScreens.jsx     # Title, Game Over, Victory screens
```
