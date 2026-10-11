import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { MonopolyBoard } from './components/board/MonopolyBoard';
import { GameHeader } from './components/navigation/GameHeader';
import { PlayerRoster } from './components/hud/PlayerRoster';
import { GameControls } from './components/dock/GameControls';
import { GameLogModal } from './components/modals/GameLogModal';
import { ActionModalOverlay } from './components/modals/ActionModalOverlay';
import { GameEventLayer } from './components/effects/GameEventLayer';
import { TitleDeedModal } from './components/modals/TitleDeedModal';
import { AuctionModal } from './components/modals/AuctionModal';
import { LobbyModal } from './components/modals/LobbyModal';
import { PlayerPortfolioModal } from './components/modals/PlayerPortfolioModal';
import { CardDeckModal } from './components/center/CardDeckModal';
import { CardDeckKind } from './core/constants/cardDeckData';
import { VIETNAMESE_BOARD_SPACES, BoardSpaceData } from './core/constants/vietnameseBoardData';
import { gameAudio } from './audio/audioManager';
import { PlayerState } from './core/types/game';
import { RoomSocialLayer } from './components/room/RoomTools';
import { X } from 'lucide-react';
import { clampZoom } from './components/board/island/useBoardCamera';
const CharacterLibrary = lazy(() => import('./components/modals/CharacterLibrary'));

export default function App() {
  const { gameState, online, dispatch, resetGame, leaveOnlineRoom } = useGameStore();
  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const canAct = !online.roomCode || online.status === 'PLAYING' && online.playerId === activePlayer?.id;
  const visiblePlayers = online.roomCode ? gameState.players.filter(player => online.players.some(roomPlayer => roomPlayer.playerId === player.id && roomPlayer.connected)) : gameState.players;
  const [showLobby, setShowLobby] = useState(true);
  useEffect(() => { if (online.roomCode) setShowLobby(online.status === 'LOBBY'); }, [online.roomCode, online.status]);
  const [showLogs, setShowLogs] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);
  const [deck, setDeck] = useState<CardDeckKind | null>(null);
  const [portfolioId, setPortfolioId] = useState<number | null>(null);
  const portfolioPlayer = gameState.players.find(player => player.id === portfolioId);
  const [landedProperty, setLandedProperty] = useState<BoardSpaceData | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [cameraResetKey,setCameraResetKey]=useState(0);
  const [following, setFollowing] = useState(true);
  useEffect(()=>{ gameAudio.setScene(showLobby?'lobby':'playing'); },[showLobby]);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('monopoly_player_name') || 'Phi Công');

  const updateName = (name: string) => { setPlayerName(name); localStorage.setItem('monopoly_player_name', name); };
  useEffect(() => {
    document.querySelectorAll('.game-header, .play-layout').forEach(element => element.toggleAttribute('inert', showLobby));
  }, [showLobby]);
  useEffect(() => {
    const init = () => gameAudio.initFromGesture();
    window.addEventListener('pointerdown', init, { capture: true });
    window.addEventListener('keydown', init, { capture: true });
    return () => { window.removeEventListener('pointerdown', init, { capture: true }); window.removeEventListener('keydown', init, { capture: true }); };
  }, []);
  useEffect(() => { setLandedProperty(null); }, [gameState.activePlayerIndex, gameState.roomCode]);

  const playerLanded = useCallback((spaceIndex: number) => {
    const space = VIETNAMESE_BOARD_SPACES[spaceIndex];
    const property = gameState.properties[spaceIndex];
    const purchasable = space && ['PROPERTY', 'RAILROAD', 'UTILITY'].includes(space.type) && space.price != null;
    setLandedProperty(purchasable && property?.ownerId == null && activePlayer && !activePlayer.isBankrupt && canAct ? space : null);
  }, [gameState.properties, activePlayer?.id, activePlayer?.isBankrupt, canAct]);

  const endTurn = () => { setLandedProperty(null); gameAudio.playSfx('turnEnd'); dispatch({ type: 'END_TURN' }); };
  const leave = () => { if (online.roomCode) leaveOnlineRoom(); setLandedProperty(null); setPortfolioId(null); setShowLobby(true); };
  const inspect = (spaceIndex: number | null) => dispatch({ type: 'SELECT_SPACE', spaceIndex });
  const selectedSpace = gameState.selectedSpaceIndex !== null ? VIETNAMESE_BOARD_SPACES[gameState.selectedSpaceIndex] : null;
  const auctionSpace = gameState.auctionState?.isOpen && gameState.auctionState.spaceIndex !== null ? VIETNAMESE_BOARD_SPACES[gameState.auctionState.spaceIndex] : null;

  return <div className="game-app" onClickCapture={event => {
    if ((event.target as HTMLElement).closest('button:not(:disabled)')) gameAudio.playSfx('uiClick');
  }}>
    <GameHeader roomCode={gameState.roomCode} online={Boolean(online.roomCode)} connected={online.connected} zoom={zoom} following={following}
      onZoomIn={() => setZoom(value => clampZoom(value+.2))} onZoomOut={() => setZoom(value => clampZoom(value-.2))} onResetZoom={() => {setZoom(1);setCameraResetKey(value=>value+1);}} onToggleFollow={() => setFollowing(value => !value)} onLobby={() => setShowLobby(true)} onPlayers={() => setShowPlayers(true)} onLeave={leave} onDeck={setDeck} onCharacters={()=>setShowCharacters(true)} />
    <main className="play-layout">
      <PlayerRoster players={visiblePlayers} activePlayerId={activePlayer?.id} properties={gameState.properties} currency={gameState.currency} onSelect={(player: PlayerState) => setPortfolioId(player.id)} />
      <div className="board-stage">
        {!showLobby && <MonopolyBoard gameState={gameState} canAct={canAct} isDecisionPending={Boolean(landedProperty)} visiblePlayerIds={visiblePlayers.map(player => player.id)} zoom={zoom} onZoomChange={setZoom} cameraResetKey={cameraResetKey} onToggleFollow={()=>setFollowing(value=>!value)} isAutoFollow={following} onSpaceClick={inspect} onRollDice={forcedRoll => dispatch({ type: 'ROLL_DICE', ...(forcedRoll ? { forcedRoll } : {}) })} onEndTurn={endTurn} onPayTaxDebt={playerId => dispatch({ type: 'PAY_TAX_DEBT', playerId })} onPlayerLanded={playerLanded} onMovementChange={setIsMoving} />}
      </div>
      <GameControls gameState={gameState} canAct={canAct} isMoving={isMoving} isDecisionPending={Boolean(landedProperty)} onRoll={forcedRoll => dispatch({ type: 'ROLL_DICE', forcedRoll })} onEndTurn={endTurn} onPayTaxDebt={playerId => dispatch({ type: 'PAY_TAX_DEBT', playerId })} onPortfolio={() => setPortfolioId(online.playerId ?? activePlayer.id)} onLogs={() => setShowLogs(true)} onDecision={() => { if (landedProperty) inspect(landedProperty.index); }} />
    </main>
    <RoomSocialLayer/>
    {showCharacters && <Suspense fallback={null}><CharacterLibrary initialId={activePlayer?.id} onClose={()=>setShowCharacters(false)}/></Suspense>}
    {!showLobby && <GameEventLayer gameState={gameState} />}
    {showLogs && <GameLogModal logs={gameState.logs} onClose={() => setShowLogs(false)} />}
    {showPlayers && <div className="detail-backdrop" onClick={() => setShowPlayers(false)}><section className="players-modal" role="dialog" aria-modal="true" aria-label="Người chơi trên bàn" onClick={event => event.stopPropagation()}><header><h2>Người chơi</h2><button type="button" className="icon-button" aria-label="Đóng danh sách người chơi" onClick={() => setShowPlayers(false)}><X size={20} /></button></header><PlayerRoster players={visiblePlayers} activePlayerId={activePlayer.id} properties={gameState.properties} currency={gameState.currency} onSelect={player => { setShowPlayers(false); setPortfolioId(player.id); }} /></section></div>}
    {deck && <CardDeckModal deck={deck} onClose={() => setDeck(null)} />}
    {landedProperty && activePlayer && canAct && !showLobby && <ActionModalOverlay space={landedProperty} activePlayer={activePlayer} currency={gameState.currency} isOpen onBuy={() => { dispatch({ type: 'BUY_PROPERTY', playerId: activePlayer.id, spaceIndex: landedProperty.index }); setLandedProperty(null); }} onAuction={() => { dispatch({ type: 'DECLINE_PROPERTY', playerId: activePlayer.id, spaceIndex: landedProperty.index }); setLandedProperty(null); }} />}
    {portfolioPlayer && <PlayerPortfolioModal player={portfolioPlayer} allProperties={gameState.properties} currency={gameState.currency} isOpen onClose={() => setPortfolioId(null)} onSelectSpace={spaceIndex => { setPortfolioId(null); inspect(spaceIndex); }} />}
    {selectedSpace && activePlayer && <TitleDeedModal space={selectedSpace} ownership={gameState.properties[selectedSpace.index]} allProperties={gameState.properties} activePlayer={activePlayer} currency={gameState.currency} onClose={() => inspect(null)} canManage={canAct} onBuildHouse={spaceIndex => dispatch({ type: 'BUILD_HOUSE', playerId: activePlayer.id, spaceIndex })} onSellProperty={spaceIndex => dispatch({ type: 'SELL_PROPERTY', playerId: activePlayer.id, spaceIndex })} />}
    {auctionSpace && gameState.auctionState?.isOpen && !showLobby && <AuctionModal space={auctionSpace} players={gameState.players} auctionState={gameState.auctionState} currency={gameState.currency} onBid={(playerId, bidAmount) => dispatch({ type: 'PLACE_AUCTION_BID', playerId, bidAmount })} onPass={playerId => dispatch({ type: 'PASS_AUCTION', playerId })} onFinalize={() => dispatch({ type: 'FINALIZE_AUCTION' })} />}
    <LobbyModal isOpen={showLobby} onClose={() => setShowLobby(false)} players={gameState.players} roomCode={gameState.roomCode} onStartNewGame={(count, name, avatar, cash, currency, code) => { setLandedProperty(null); setPortfolioId(null); inspect(null); setZoom(1); resetGame(count, name, avatar, cash, currency, code); }} onUpdatePlayerName={updateName} currentPlayerName={playerName} />
  </div>;
}
