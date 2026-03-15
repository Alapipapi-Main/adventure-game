# ⚔️ Shadows of Vor'thaan

A dark fantasy action/adventure browser RPG built with **React + Vite**.

## 🎮 Gameplay

- **Explore** 6 unique locations: Village, Tavern, Blacksmith, Forest Edge, Dark Wood, Ruined Shrine, and Ancient Ruins
- **Battle** 10 enemy types including Goblins, Orcs, Wraiths, and the final boss — **The Shadow King**
- **Level up** your character and unlock better stats
- **Buy** weapons and armor from the shop (5 tiers each)
- **Use items** like potions in and out of battle
- **Defend** to reduce incoming damage
- **Flee** from battles (60% success rate)

## 🗺️ Locations

| Location | Danger | Notes |
|----------|--------|-------|
| Ashenveil Village | Safe | Starting area |
| The Broken Flagon (Tavern) | Safe | Shop + rest |
| Gregor's Forge (Blacksmith) | Safe | Weapons shop |
| Edge of the Dark Wood | Low | Goblins, Wolves |
| The Dark Wood | Medium | Orcs, Shadow Wolves, Wraiths |
| Ruined Shrine | High | Skeletons, Cursed Shades |
| Ancient Ruins of Vor'thaan | Boss | Stone Golems + Shadow King |

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 🏗️ Build for Production

```bash
npm run build
```

## 🌐 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select the repo — Vercel auto-detects Vite
4. Click **Deploy** — done!

No extra configuration needed. Vercel handles Vite builds automatically.

## 🛠️ Tech Stack

- **React 19** + **Vite 6**
- CSS Modules for scoped styling
- Google Fonts: Cinzel Decorative, Cinzel, Crimson Text
- Zero external runtime dependencies

## 📁 Project Structure

```
src/
├── App.jsx            # Root component & screen router
├── App.css            # Global app styles + toast
├── index.css          # CSS variables & resets
├── main.jsx           # Entry point
├── gameData.js        # All game data (locations, enemies, items)
├── useGameState.js    # Game logic hook
├── HUD.jsx            # Sticky stats bar
├── ExploreScreen.jsx  # World map & navigation
├── BattleScreen.jsx   # Turn-based combat
├── ShopScreen.jsx     # Buy weapons/armor/items
├── InventoryModal.jsx # View & use items
└── SpecialScreens.jsx # Title, Game Over, Victory
```
