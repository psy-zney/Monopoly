import React, { useEffect, useState } from 'react';
import { RotateCcw, Sparkles, UsersRound, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from './store/useGameStore';
import { MonopolyBoard } from './components/board/MonopolyBoard';
import { PlayerHUD, PlayerSeatCard } from './components/hud/PlayerHUD';
import { GameEventLayer } from './components/effects/GameEventLayer';
import { TitleDeedModal } from './components/modals/TitleDeedModal';
import { AuctionModal } from './components/modals/AuctionModal';
import { GameLoadingScreen } from './components/modals/GameLoadingScreen';
import { LobbyModal } from './components/modals/LobbyModal';
import { VIETNAMESE_BOARD_SPACES } from './core/constants/vietnameseBoardData';
import { gameAudio } from './audio/audioManager';

export default function App() {
  const { gameState, online, dispatch, resetGame } = useGameStore();
  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const visiblePlayers = online.roomCode
    ? gameState.players.filter((player) =>
        online.players.some((roomPlayer) => roomPlayer.playerId === player.id && roomPlayer.connected),
      )
    : gameState.players;

  const [showLoading, setShowLoading] = useState(true);
  const [showLobby, setShowLobby] = useState(false);
  const [muted, setMuted] = useState(() => gameAudio.isMuted);
  const [showDesktopSeats, setShowDesktopSeats] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('doraemon_monopoly_name') || 'Người Chơi 1';
  });

  const handleUpdatePlayerName = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('doraemon_monopoly_name', name);
  };

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setShowDesktopSeats(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const startAudio = () => gameAudio.initFromGesture();
    window.addEventListener('pointerdown', startAudio, { capture: true, once: true });
    return () => window.removeEventListener('pointerdown', startAudio, { capture: true });
  }, []);

  const selectedSpace =
    gameState.selectedSpaceIndex !== null
      ? VIETNAMESE_BOARD_SPACES[gameState.selectedSpaceIndex]
      : null;
  const selectedOwnership =
    gameState.selectedSpaceIndex !== null
      ? gameState.properties[gameState.selectedSpaceIndex]
      : undefined;

  const auctionSpace =
    gameState.auctionState?.isOpen && gameState.auctionState.spaceIndex !== null
      ? VIETNAMESE_BOARD_SPACES[gameState.auctionState.spaceIndex]
      : null;

  // Stable anchors preserve the feeling of people sitting around one shared table.
  const seatPositions = [
    'absolute bottom-1 left-[15%]',
    'absolute left-1 top-1/2 -translate-y-1/2',
    'absolute left-[15%] top-1',
    'absolute right-[15%] top-1',
    'absolute right-1 top-1/2 -translate-y-1/2',
    'absolute bottom-1 right-[15%]',
  ];

  return (
    <div className="game-shell h-screen overflow-hidden">
      {/* Loading Screen */}
      {showLoading && (
        <GameLoadingScreen
          onFinish={() => setShowLoading(false)}
        />
      )}

      {/* Lobby / Enter Name Modal */}
      <LobbyModal
        isOpen={showLobby}
        onClose={() => setShowLobby(false)}
        players={gameState.players}
        roomCode={gameState.roomCode}
        onStartNewGame={(playerCount) => resetGame(playerCount)}
        onUpdatePlayerName={handleUpdatePlayerName}
        currentPlayerName={playerName}
      />

      <GameEventLayer gameState={gameState} />

      {/* ── HEADER ── */}
      <header className="game-header safe-ui flex w-full items-center justify-between px-4 py-2.5 md:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-2xl shadow-lg shadow-amber-950/20">
            🎲
          </div>
          <div>
            <h1 className="flex items-center gap-2 text-base font-black uppercase tracking-[0.16em] text-white md:text-xl">
              Cờ Tỷ Phú Mèo <Sparkles className="text-amber-300" size={17} />
            </h1>
            <p className="mt-0.5 text-xs font-bold text-emerald-100/75">
              <span className="font-black text-amber-300">{playerName}</span> · Phòng{' '}
              <span className="font-mono text-white">{gameState.roomCode}</span> · {visiblePlayers.length} người
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLobby(true)}
            className="game-header-button game-header-button-primary"
            aria-label="Mở danh sách người chơi và đổi tên"
          >
            <UsersRound size={17} /> <span className="hidden sm:inline">Người chơi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              gameAudio.toggleMuted();
              setMuted(gameAudio.isMuted);
            }}
            className="game-header-button game-header-audio-button"
            aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          <button
            type="button"
            onClick={() => resetGame(6)}
            className="game-header-button"
            aria-label="Bắt đầu ván mới với sáu người chơi"
          >
            <RotateCcw size={17} /> <span className="hidden sm:inline">Ván mới</span>
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="game-table-surface relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden p-2 md:p-3">
        {/* On Mobile: standard top HUD bar */}
        <div className="mobile-player-strip w-full shrink-0 md:hidden">
          <PlayerHUD
            players={visiblePlayers}
            activePlayerId={activePlayer?.id}
          />
        </div>

        {/* Empty seats are intentionally absent; only connected/created players occupy the table. */}
        <div className="relative flex h-full w-full max-w-[1180px] justify-center px-1 py-2 md:max-h-[calc(100vh-76px)] md:px-[116px] md:py-[66px]">
          <div className="table-ambient-ring" aria-hidden="true" />
          {showDesktopSeats && visiblePlayers.map((player) => {
            const seatIndex = Math.max(0, Math.min(5, player.id - 1));
            return (
              <div key={player.id} className={`z-20 ${seatPositions[seatIndex]}`}>
                <PlayerSeatCard
                  player={player}
                  isActive={player.id === activePlayer?.id}
                  seatIndex={seatIndex}
                />
              </div>
            );
          })}

          <MonopolyBoard
            gameState={gameState}
            onSpaceClick={(spaceIndex) => dispatch({ type: 'SELECT_SPACE', spaceIndex })}
            onRollDice={(forcedRoll) =>
              dispatch({ type: 'ROLL_DICE', ...(forcedRoll ? { forcedRoll } : {}) })
            }
            onEndTurn={() => dispatch({ type: 'END_TURN' })}
            onPayTaxDebt={(playerId) => dispatch({ type: 'PAY_TAX_DEBT', playerId })}
          />
        </div>
      </main>

      {/* ── MODALS ── */}
      {selectedSpace && activePlayer && (
        <TitleDeedModal
          space={selectedSpace}
          ownership={selectedOwnership}
          activePlayer={activePlayer}
          onClose={() => dispatch({ type: 'SELECT_SPACE', spaceIndex: null })}
          onBuyProperty={(spaceIndex) =>
            dispatch({ type: 'BUY_PROPERTY', playerId: activePlayer.id, spaceIndex })
          }
          onDeclineProperty={(spaceIndex) =>
            dispatch({ type: 'DECLINE_PROPERTY', playerId: activePlayer.id, spaceIndex })
          }
          onBuildHouse={(spaceIndex) =>
            dispatch({ type: 'BUILD_HOUSE', playerId: activePlayer.id, spaceIndex })
          }
        />
      )}

      {auctionSpace && gameState.auctionState?.isOpen && (
        <AuctionModal
          space={auctionSpace}
          players={gameState.players}
          auctionState={gameState.auctionState}
          onBid={(playerId, bidAmount) =>
            dispatch({ type: 'PLACE_AUCTION_BID', playerId, bidAmount })
          }
          onPass={(playerId) => dispatch({ type: 'PASS_AUCTION', playerId })}
          onFinalize={() => dispatch({ type: 'FINALIZE_AUCTION' })}
        />
      )}
    </div>
  );
}
