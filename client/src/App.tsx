import React, { useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { MonopolyBoard } from './components/board/MonopolyBoard';
import { PlayerHUD, PlayerSeatCard, EmptySeatCard } from './components/hud/PlayerHUD';
import { TitleDeedModal } from './components/modals/TitleDeedModal';
import { AuctionModal } from './components/modals/AuctionModal';
import { GameLoadingScreen } from './components/modals/GameLoadingScreen';
import { LobbyModal } from './components/modals/LobbyModal';
import { VIETNAMESE_BOARD_SPACES } from './core/constants/vietnameseBoardData';

export default function App() {
  const { gameState, dispatch, resetGame } = useGameStore();
  const activePlayer = gameState.players[gameState.activePlayerIndex];

  const [showLoading, setShowLoading] = useState(true);
  const [showLobby, setShowLobby] = useState(false);
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('doraemon_monopoly_name') || 'Người Chơi 1';
  });

  const handleUpdatePlayerName = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('doraemon_monopoly_name', name);
  };

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

  // 6 fixed desktop seat positions around the board
  const seatPositions = [
    /* Seat 1 (Bottom Left) */ 'absolute bottom-8 left-2',
    /* Seat 2 (Middle Left) */ 'absolute top-1/2 -translate-y-1/2 left-2',
    /* Seat 3 (Top Left)    */ 'absolute top-8 left-2',
    /* Seat 4 (Top Right)   */ 'absolute top-8 right-2',
    /* Seat 5 (Middle Right)*/ 'absolute top-1/2 -translate-y-1/2 right-2',
    /* Seat 6 (Bottom Right)*/ 'absolute bottom-8 right-2',
  ];

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: '#f5f0dc' }}
    >
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

      {/* ── HEADER ── */}
      <header
        className="w-full py-2.5 px-4 md:px-8 flex items-center justify-between shadow-sm z-30"
        style={{
          background: '#fff',
          borderBottom: '2px solid #c8a951',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-black shrink-0 shadow"
            style={{ background: '#dc2626' }}
          >
            🎲
          </div>
          <div>
            <h1
              className="text-base md:text-lg font-black uppercase tracking-widest text-slate-900"
              style={{ fontFamily: 'Baloo 2, cursive' }}
            >
              Doraemon Monopoly
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Tên: <span className="text-amber-700 font-black">{playerName}</span> · Phòng:{' '}
              <span className="font-mono text-slate-700">{gameState.roomCode}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLobby(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:brightness-95 active:scale-95 shadow-sm"
            style={{
              background: '#fef3c7',
              border: '2px solid #f59e0b',
              color: '#92400e',
            }}
          >
            🪑 Hàng Chờ & Tên
          </button>
          <button
            onClick={() => resetGame(6)}
            className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:brightness-95 active:scale-95"
            style={{
              background: '#fff',
              border: '2px solid #e2d9b0',
              color: '#555',
            }}
          >
            🔄 Ván Mới
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 min-h-0 overflow-hidden relative">
        {/* On Mobile: standard top HUD bar */}
        <div className="w-full md:hidden shrink-0">
          <PlayerHUD
            players={gameState.players}
            activePlayerIndex={gameState.activePlayerIndex}
          />
        </div>

        {/* Board with Seated Players & Empty Circular Slots on Desktop */}
        <div className="relative flex h-full w-full max-w-[1000px] justify-center px-1 py-2 md:max-h-[calc(100vh-80px)] md:px-20">
          {/* Render all 6 seat positions around the board */}
          {seatPositions.map((seatClass, idx) => {
            const player = gameState.players[idx];

            if (player) {
              const isActive = idx === gameState.activePlayerIndex;
              return (
                <div key={player.id} className={`hidden md:block ${seatClass}`}>
                  <PlayerSeatCard player={player} isActive={isActive} />
                </div>
              );
            }

            // Render Circular Empty Seat Slot when no user is seated
            return (
              <div key={`empty-seat-${idx}`} className={`hidden md:block ${seatClass}`}>
                <EmptySeatCard
                  seatIndex={idx}
                  onClick={() => setShowLobby(true)}
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
