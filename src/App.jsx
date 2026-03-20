import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useGameState, getAllSlots } from './useGameState';
import { useAudio } from './useAudio';
import HUD from './HUD';
import ExploreScreen from './ExploreScreen';
import BattleScreen from './BattleScreen';
import ShopScreen from './ShopScreen';
import InventoryModal from './InventoryModal';
import QuestBoard from './QuestBoard';
import SaveSlotPicker from './SaveSlotPicker';
import AudioSettings from './AudioSettings';
import { TitleScreen, GameOverScreen, VictoryScreen } from './SpecialScreens';
import './App.css';

export default function App() {
  const {
    player, screen, setScreen, battleState, log, notification, quests, activeSlot,
    travel, startBattle, playerAttack, playerDefend, enemyAttack,
    resolveVictory, useItem, buyItem, rest, claimQuest, addLog,
    loadSlot, eraseSlot, goToTitle, clearVictoryAndGoTitle,
  } = useGameState();

  const { musicVol, sfxVol, setMusicVol, setSfxVol, playMusic, playSfx } = useAudio();

  const [showShop,      setShowShop]      = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showQuests,    setShowQuests]    = useState(false);
  const [showAudio,     setShowAudio]     = useState(false);
  const [slotPicker,    setSlotPicker]    = useState(null);

  const filledSlots = getAllSlots().filter(s => !s.empty).length;

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

  // Shop modal overrides to shop music, restores on close
  useEffect(() => {
    if (showShop) { playMusic('shop'); return; }
    if (screen === 'title')   playMusic('title');
    if (screen === 'explore') playMusic('explore');
  }, [showShop]);

  // ── Sound effects ──────────────────────────────────────────────────────────
  // Intercept game actions and inject sounds
  const handleAttack = () => { playSfx('attack'); playerAttack(); };
  const handleDefend = () => { playSfx('menuClick'); playerDefend(); };

  const handleFlee = () => {
    if (Math.random() > 0.4) {
      playSfx('flee');
      addLog('💨 You fled from battle!', 'travel');
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

  // Death sound
  useEffect(() => {
    if (player.hp <= 0 && screen === 'battle') {
      playSfx('death');
      setTimeout(() => setScreen('gameover'), 600);
    }
  }, [player.hp, screen]);

  // Victory sound
  const handleResolveVictory = () => {
    playSfx('victory');
    resolveVictory();
  };

  // Enemy attack sound
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
          onSelect={(slot) => { setSlotPicker(null); loadSlot(slot); }}
          onErase={(slot)  => { eraseSlot(slot); setSlotPicker(null); setTimeout(() => setSlotPicker(slotPicker), 50); }}
          onClose={() => setSlotPicker(null)}
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
    <VictoryScreen
      player={player}
      activeSlot={activeSlot}
      onNewGame={() => { clearVictoryAndGoTitle(); setTimeout(() => setSlotPicker('new'), 50); }}
      onLoadSlot={(slot) => { loadSlot(slot); }}
      onEraseSlot={eraseSlot}
      onClearVictory={clearVictoryAndGoTitle}
    />
  );

  return (
    <div className="app">
      {notification && (
        <div className={`toast toast--${notification.type}`}>{notification.msg}</div>
      )}

      <HUD
        player={player}
        quests={quests}
        musicVol={musicVol}
        sfxVol={sfxVol}
        onInventory={() => setShowInventory(true)}
        onQuestBoard={() => setShowQuests(true)}
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
            onQuestBoard={() => setShowQuests(true)}
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

      {showShop      && <ShopScreen     player={player} onBuy={handleBuy}                 onClose={() => setShowShop(false)}      />}
      {showInventory && <InventoryModal player={player} onUse={i => handleUseItem(i,false)} onClose={() => setShowInventory(false)} />}
      {showQuests    && <QuestBoard     quests={quests}  onClaim={claimQuest}              onClose={() => setShowQuests(false)}    />}
      {showAudio     && (
        <AudioSettings
          musicVol={musicVol}
          sfxVol={sfxVol}
          onMusicVol={setMusicVol}
          onSfxVol={setSfxVol}
          onClose={() => setShowAudio(false)}
        />
      )}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
