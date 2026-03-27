import { useEffect, useState, useRef } from 'react';
import { useGameState, getAllSlots, readSlot } from './useGameState';
import { useAudio } from './useAudio';
import useAchievements from './useAchievements';
import HUD from './HUD';
import ExploreScreen from './ExploreScreen';
import BattleScreen from './BattleScreen';
import ShopScreen from './ShopScreen';
import InventoryModal from './InventoryModal';
import QuestBoard from './QuestBoard';
import SaveSlotPicker from './SaveSlotPicker';
import NewGameSetup from './NewGameSetup';
import CraftingModal from './CraftingModal';
import SkillTreeModal from './SkillTreeModal';
import AudioSettings from './AudioSettings';
import AchievementPanel from './AchievementPanel';
import WorldMap from './WorldMap';
import { TitleScreen, GameOverScreen, VictoryScreen } from './SpecialScreens';
import './App.css';

export default function App() {
  const {
    player, screen, setScreen, battleState, setBattleState, log, notification, quests, activeSlot, difficulty,
    pendingLevelUp, pickPerk,
    travel, startBattle, playerAttack, playerDefend, enemyAttack,
    resolveVictory, useItem, craftItem, buyItem, rest, claimQuest, addLog, notify,
    loadSlot, eraseSlot, goToTitle, clearVictoryAndGoTitle,
    visitedLocations, totalPoisons, totalBurns, totalCrafted, battleFlagsRef,
  } = useGameState();

  const { musicVol, sfxVol, setMusicVol, setSfxVol, playMusic, playSfx } = useAudio();
  const {
    unlocked,
    checkCombat, checkPoison, checkBurn, checkExploration,
    checkQuests, checkPerks, checkCrafting, checkVictory,
  } = useAchievements(notify);

  const [showShop,         setShowShop]         = useState(false);
  const [showCraft,        setShowCraft]        = useState(false);
  const [showInventory,    setShowInventory]    = useState(false);
  const [showQuests,       setShowQuests]       = useState(false);
  const [showAudio,        setShowAudio]        = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showMap,          setShowMap]          = useState(false);
  const [slotPicker,       setSlotPicker]       = useState(null);
  const [newGameSlot,      setNewGameSlot]      = useState(null);

  const filledSlots = getAllSlots().filter(s => !s.empty).length;

  // ── Achievement checks tied to game state changes ──────────────────────────
  // Exploration
  useEffect(() => {
    if (visitedLocations.length > 0) checkExploration(visitedLocations);
  }, [visitedLocations]);

  // Poison / Burn milestones
  useEffect(() => { if (totalPoisons > 0) checkPoison(totalPoisons); }, [totalPoisons]);
  useEffect(() => { if (totalBurns   > 0) checkBurn(totalBurns);     }, [totalBurns]);

  // Crafting milestones
  useEffect(() => { if (totalCrafted > 0) checkCrafting(totalCrafted); }, [totalCrafted]);

  // Quest milestones
  useEffect(() => {
    const claimed = quests.filter(q => q.status === 'claimed').length;
    if (claimed > 0) checkQuests(claimed);
  }, [quests]);

  // Perk milestones
  useEffect(() => {
    const count = (player.perks || []).length;
    if (count > 0) checkPerks(count);
  }, [player.perks]);

  // ── Music per screen & modal ────────────────────────────────────────────────
  useEffect(() => {
    if (screen === 'title')    { playMusic('title');    return; }
    if (screen === 'gameover') { playMusic('gameover'); return; }
    if (screen === 'victory')  { playMusic('victory');  return; }
    if (screen === 'explore')  { playMusic('explore');  return; }
    if (screen === 'battle') {
      playMusic(battleState?.enemy?.isBoss ? 'boss' : 'battle');
      return;
    }
  }, [screen, battleState?.enemy?.isBoss]);

  useEffect(() => {
    if (showShop) { playMusic('shop'); return; }
    if (screen === 'title')   playMusic('title');
    if (screen === 'explore') playMusic('explore');
  }, [showShop]);

  // ── Sound effects ──────────────────────────────────────────────────────────
  const handleAttack = () => { playSfx('attack'); playerAttack(); };
  const handleDefend = () => { playSfx('menuClick'); playerDefend(); };

  const handleFlee = () => {
    const success = player.alwaysFlee || Math.random() > 0.4;
    if (success) {
      playSfx('flee');
      addLog('💨 You fled from battle!', 'travel');
      battleFlagsRef.current.usedFlee = true;
      setBattleState(null);
      setScreen('explore');
    } else {
      playSfx('hit');
      addLog('❌ Failed to flee!', 'danger');
      enemyAttack();
    }
  };

  const handleUseItem = (item, inBattle) => {
    if (item.effect === 'heal') playSfx('heal');
    else playSfx('menuClick');
    useItem(item, inBattle);
  };

  const handleTravel = (loc) => { playSfx('travel'); travel(loc); };
  const handleBuy    = (item) => { playSfx('purchase'); buyItem(item); };
  const handleRest   = ()     => { playSfx('heal'); rest(); };

  // Death
  useEffect(() => {
    if (player.hp <= 0 && screen === 'battle') {
      playSfx('death');
      setTimeout(() => {
        setBattleState(null);
        setScreen('gameover');
      }, 600);
    }
  }, [player.hp, screen]);

  // Victory — fire achievement checks
  const handleResolveVictory = () => {
    playSfx('victory');
    if (battleState?.enemy) {
      checkCombat(player, battleState.enemy, battleFlagsRef.current);
      if (battleState.enemy.id === 'shadow_king') {
        checkVictory(player, difficulty);
      }
    }
    resolveVictory();
  };

  const handleEnemyTurn = () => { playSfx('hit'); enemyAttack(); };

  // ── Screens ────────────────────────────────────────────────────────────────
  if (screen === 'title') return (
    <>
      <TitleScreen
        hasAnySave={filledSlots || null}
        onContinue={() => { playSfx('menuClick'); setSlotPicker('load'); }}
        onNewGame={() =>   { playSfx('menuClick'); setSlotPicker('new'); }}
      />
      {slotPicker && (
        <SaveSlotPicker
          mode={slotPicker}
          onSelect={(slot) => {
            setSlotPicker(null);
            if (slotPicker === 'new') {
              setNewGameSlot(slot);
            } else {
              loadSlot(slot);
            }
          }}
          onErase={(slot) => { eraseSlot(slot); setSlotPicker(null); setTimeout(() => setSlotPicker(slotPicker), 50); }}
          onClose={() => setSlotPicker(null)}
        />
      )}
      {newGameSlot && (
        <NewGameSetup
          existingNames={getAllSlots()
            .filter(s => !s.empty && s.slot !== newGameSlot)
            .map(s => s.player.name)}
          onStart={({ name, difficulty }) => {
            setNewGameSlot(null);
            loadSlot(newGameSlot, { name, difficulty });
          }}
          onClose={() => setNewGameSlot(null)}
        />
      )}
    </>
  );

  if (screen === 'gameover') return (
    <GameOverScreen
      player={player}
      activeSlot={activeSlot}
      onLoadSlot={(slot) => { loadSlot(slot); }}
      onEraseSlot={eraseSlot}
      onGoTitle={goToTitle}
    />
  );

  if (screen === 'victory') return (
    <>
      <VictoryScreen
        player={player}
        activeSlot={activeSlot}
        onNewGame={() => { clearVictoryAndGoTitle(); setTimeout(() => setSlotPicker('new'), 50); }}
        onLoadSlot={(slot) => {
          if (readSlot(slot)) {
            loadSlot(slot);
          } else {
            setNewGameSlot(slot);
          }
        }}
        onEraseSlot={eraseSlot}
        onClearVictory={clearVictoryAndGoTitle}
      />
      {newGameSlot && (
        <NewGameSetup
          onStart={({ name, difficulty }) => {
            setNewGameSlot(null);
            loadSlot(newGameSlot, { name, difficulty });
          }}
          onClose={() => setNewGameSlot(null)}
        />
      )}
    </>
  );

  return (
    <div className="app">
      {notification && (
        <div className={`toast toast--${notification.type}`}>{notification.msg}</div>
      )}

      <HUD
        player={player}
        quests={quests}
        difficulty={difficulty}
        musicVol={musicVol}
        sfxVol={sfxVol}
        unlockedCount={Object.keys(unlocked).length}
        onInventory={() => setShowInventory(true)}
        onQuestBoard={() => setShowQuests(true)}
        onAchievements={() => setShowAchievements(true)}
        onAudio={() => setShowAudio(true)}
      />

      <main className="main-content">
        {screen === 'explore' && (
          <ExploreScreen
            player={player}
            quests={quests}
            onTravel={handleTravel}
            onStartBattle={startBattle}
            onShop={() => setShowShop(true)}
            onCraft={() => setShowCraft(true)}
            onQuestBoard={() => setShowQuests(true)}
            onMap={() => setShowMap(true)}
            onRest={handleRest}
            log={log}
          />
        )}
        {screen === 'battle' && battleState && (
          <BattleScreen
            player={player}
            battleState={battleState}
            onAttack={handleAttack}
            onDefend={handleDefend}
            onFlee={handleFlee}
            onEnemyTurn={handleEnemyTurn}
            onResolveVictory={handleResolveVictory}
            onUseItem={handleUseItem}
            log={log}
          />
        )}
      </main>

      {showShop         && <ShopScreen        player={player} onBuy={handleBuy}                          onClose={() => setShowShop(false)}         />}
      {showCraft        && <CraftingModal     player={player} onCraft={(r) => { craftItem(r); }}         onClose={() => setShowCraft(false)}        />}
      {showInventory    && <InventoryModal    player={player} difficulty={difficulty} battleState={battleState} onUse={i => handleUseItem(i, !!battleState)} onClose={() => setShowInventory(false)} />}
      {showQuests       && <QuestBoard        quests={quests} onClaim={claimQuest}                       onClose={() => setShowQuests(false)}       />}
      {showAchievements && <AchievementPanel  unlocked={unlocked}                                        onClose={() => setShowAchievements(false)} />}
      {showMap          && <WorldMap          player={player} visitedLocations={visitedLocations}        onTravel={handleTravel} onClose={() => setShowMap(false)} />}
      {showAudio        && (
        <AudioSettings
          musicVol={musicVol}
          sfxVol={sfxVol}
          onMusicVol={setMusicVol}
          onSfxVol={setSfxVol}
          onClose={() => setShowAudio(false)}
        />
      )}
      {pendingLevelUp && (
        <SkillTreeModal
          player={player}
          onPick={(perkId, pathId) => { playSfx('levelUp'); pickPerk(perkId, pathId); }}
        />
      )}
    </div>
  );
}
