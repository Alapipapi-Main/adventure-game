# ⚔️ Shadows of Vor'thaan

A dark fantasy action/adventure browser RPG built with **React + Vite**. No external game libraries — all logic, audio, and UI are hand-crafted.

## 🎮 Gameplay

- **Explore** 6 unique locations across a cursed land
- **Battle** 10 enemy types in turn-based combat, including a final boss
- **Level up** — gain XP to grow HP, ATK, and DEF automatically
- **Equip** weapons and armor from the shop (5 tiers each)
- **Use items** like potions and elixirs in and out of battle
- **Defend** to halve incoming damage on the next hit
- **Flee** from battles (60% success rate)
- **Complete quests** from the Tavern notice board for bonus gold and XP
- **Save progress** across 3 independent save slots with auto-save

## 🗺️ Locations

| Location | Danger | Notes |
|----------|--------|-------|
| Ashenveil Village | Safe | Starting area |
| The Broken Flagon (Tavern) | Safe | Shop + Rest + Quest Board |
| Gregor's Forge (Blacksmith) | Safe | Weapons & armor shop |
| Edge of the Dark Wood | Low | Goblins, Dire Wolves |
| The Dark Wood | Medium | Orcs, Shadow Wolves, Wraiths |
| Ruined Shrine of the Ancients | High | Skeleton Warriors, Cursed Shades |
| Ancient Ruins of Vor'thaan | Boss | Stone Golems, Shadow Knights + Shadow King |

## 📜 Quest System

6 quests available from the Tavern quest board:

| Quest | Goal | Reward |
|-------|------|--------|
| First Blood | Slay 1 enemy | 30g + 50 XP |
| Goblin Slayer | Slay 5 Goblins | 80g + 120 XP |
| Wolf Hunter | Slay 3 Dire Wolves | 60g + 90 XP |
| Into the Dark | Visit the Dark Wood | 50g + 80 XP |
| Orc Bane | Slay 3 Orcs | 120g + 200 XP |
| Ruins Delver | Slay 3 Shadow Knights | 250g + 450 XP |

## 💾 Save System

- **3 save slots** — each slot is independent and never overwrites another
- **Auto-save** triggers after every meaningful action (travel, battle, purchase, level-up)
- **Retry on death** — reloads your slot with HP fully restored
- **Victory clears the slot** — beating the game automatically deletes the winning save so the slot is free for a new run
- Slot data stored in `localStorage` under versioned keys (`vorhaan_save_v1_slot1` etc.)

## 🎵 Audio System

All audio is procedurally generated via the **Web Audio API** — no audio files needed. Music starts on first user interaction and crossfades smoothly between screens.

### Music tracks

| Track | Plays during |
|-------|-------------|
| Title | Title screen |
| Explore | World exploration |
| Battle | Regular enemy combat |
| Boss | Shadow King encounter |
| Game Over | Death screen |
| Victory | Victory screen |
| Shop | Shop modal |

### Sound effects

Attack, critical hit, taking damage, heal, level-up fanfare, victory, death, purchase, flee, travel, menu click. Access volume controls via the 🎵 button in the HUD. Settings persist between sessions.

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
├── gameData.js            # Locations, enemies, weapons, armor, quests
├── useGameState.js        # All game logic (battle, quests, save slots)
├── useAudio.js            # Procedural music & SFX via Web Audio API
├── HUD.jsx                # Sticky stats bar (HP, XP, gold, buttons)
├── ExploreScreen.jsx      # World navigation & action panel
├── BattleScreen.jsx       # Turn-based combat with animations
├── ShopScreen.jsx         # Buy weapons, armor & consumables
├── InventoryModal.jsx     # View & use carried items
├── QuestBoard.jsx         # Quest list with progress & claim rewards
├── SaveSlotPicker.jsx     # 3-slot save/load picker modal
├── AudioSettings.jsx      # Music & SFX volume sliders
└── SpecialScreens.jsx     # Title, Game Over, Victory screens
```
