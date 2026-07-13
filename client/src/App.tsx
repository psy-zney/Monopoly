import React from 'react';
import { useGameStore } from './store/useGameStore';
import { MonopolyBoard } from './components/board/MonopolyBoard';
import { PlayerHUD, PlayerSeatCard } from './components/hud/PlayerHUD';
import { TitleDeedModal } from './components/modals/TitleDeedModal';
import { AuctionModal } from './components/modals/AuctionModal';
import { VIETNAMESE_BOARD_SPACES } from './core/constants/vietnameseBoardData';

export default function App() {
  const { gameState, dispatch, resetGame } = useGameStore();
  const activePlayer = gameState.players[gameState.activePlayerIndex];

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

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: '#f5f0dc' }}
    >
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
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-black shrink-0"
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
              Bản Miền Nam · Phòng:{' '}
              <span className="font-mono text-slate-700">{gameState.roomCode}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => resetGame(6)}
          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:brightness-95 active:scale-95"
          style={{
            background: '#fff',
            border: '2px solid #e2d9b0',
            color: '#555',
          }}
        >
          🔄 Ván Mới
        </button>
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

        {/* Board with Seated Players on Desktop */}
        <div className="relative flex h-full w-full max-w-[1000px] justify-center px-1 py-2 md:max-h-[calc(100vh-80px)] md:px-20">
          {/* Seated players around the board (hidden on mobile, floating on desktop) */}
          {gameState.players.map((player, idx) => {
            const isActive = idx === gameState.activePlayerIndex;
            // Seating positions coordinate mapping classes
            const seatPositions = [
              /* Player 1 */ 'absolute bottom-8 left-2',
              /* Player 2 */ 'absolute top-1/2 -translate-y-1/2 left-2',
              /* Player 3 */ 'absolute top-8 left-2',
              /* Player 4 */ 'absolute top-8 right-2',
              /* Player 5 */ 'absolute top-1/2 -translate-y-1/2 right-2',
              /* Player 6 */ 'absolute bottom-8 right-2',
            ];

            return (
              <div
                key={player.id}
                className={`hidden md:block ${seatPositions[player.id - 1]}`}
              >
                <PlayerSeatCard player={player} isActive={isActive} />
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
