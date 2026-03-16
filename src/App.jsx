import { useEffect, useState } from 'react';
import { useGameState, hasSaveData, deleteSave } from './useGameState';
import HUD from './HUD';
import ExploreScreen from './ExploreScreen';
import BattleScreen from './BattleScreen';
import ShopScreen from './ShopScreen';
import InventoryModal from './InventoryModal';
import QuestBoard from './QuestBoard';
import { TitleScreen, GameOverScreen, VictoryScreen } from './SpecialScreens';
import './App.css';

export default function App() {
  const {
    player, screen, setScreen, battleState, log, notification, quests,
    travel, startBattle, playerAttack, playerDefend, enemyAttack,
    resolveVictory, useItem, buyItem, rest, resetGame, startNewGame, claimQuest, addLog,
  } = useGameState();

  const [showShop, setShowShop]           = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showQuests, setShowQuests]       = useState(false);

  // Check player death during battle
  useEffect(() => {
    if (player.hp <= 0 && screen === 'battle') {
      setTimeout(() => setScreen('gameover'), 600);
    }
  }, [player.hp, screen, setScreen]);

  const handleFlee = () => {
    const success = Math.random() > 0.4;
    if (success) {
      addLog('💨 You fled from battle!', 'travel');
      setScreen('explore');
    } else {
      addLog('❌ Failed to flee!', 'danger');
      enemyAttack();
    }
  };

  if (screen === 'title') return (
    <TitleScreen
      hasSave={hasSaveData()}
      onContinue={() => setScreen('explore')}
      onStart={startNewGame}
      onEraseSave={() => { deleteSave(); window.location.reload(); }}
    />
  );
  if (screen === 'gameover') return <GameOverScreen player={player} onRestart={startNewGame} />;
  if (screen === 'victory')  return <VictoryScreen  player={player} onRestart={startNewGame} />;

  const readyQuests = quests.filter(q => q.status === 'completed').length;

  return (
    <div className="app">
      {notification && (
        <div className={`toast toast--${notification.type}`}>{notification.msg}</div>
      )}

      <HUD
        player={player}
        quests={quests}
        onInventory={() => setShowInventory(true)}
        onQuestBoard={() => setShowQuests(true)}
      />

      <main className="main-content">
        {screen === 'explore' && (
          <ExploreScreen
            player={player}
            quests={quests}
            onTravel={travel}
            onStartBattle={startBattle}
            onShop={() => setShowShop(true)}
            onQuestBoard={() => setShowQuests(true)}
            onRest={rest}
            log={log}
          />
        )}

        {screen === 'battle' && battleState && (
          <BattleScreen
            player={player}
            battleState={battleState}
            onAttack={playerAttack}
            onDefend={playerDefend}
            onFlee={handleFlee}
            onEnemyTurn={enemyAttack}
            onResolveVictory={resolveVictory}
            onUseItem={useItem}
            log={log}
          />
        )}
      </main>

      {showShop && (
        <ShopScreen player={player} onBuy={buyItem} onClose={() => setShowShop(false)} />
      )}
      {showInventory && (
        <InventoryModal player={player} onUse={(item) => useItem(item, false)} onClose={() => setShowInventory(false)} />
      )}
      {showQuests && (
        <QuestBoard quests={quests} onClaim={claimQuest} onClose={() => setShowQuests(false)} />
      )}
    </div>
  );
}
