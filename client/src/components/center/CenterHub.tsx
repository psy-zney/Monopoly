import React, { useState } from 'react';
import { ArrowRight, Coins, Gift, HelpCircle, Sparkles } from 'lucide-react';
import { GameState } from '../../core/types/game';
import { CardDeckKind } from '../../core/constants/cardDeckData';
import { DiceShaker } from './DiceShaker';
import { CardStack } from './CardStack';
import { CardDeckModal } from './CardDeckModal';
import { gameAudio } from '../../audio/audioManager';

export interface CenterHubProps {
  gameState: GameState;
  onRollDice: (forcedRoll?: [number, number]) => void;
  onEndTurn: () => void;
  onPayTaxDebt: (playerId: number) => void;
}

export const CenterHub: React.FC<CenterHubProps> = ({ gameState, onRollDice, onEndTurn, onPayTaxDebt }) => {
  const [openDeck, setOpenDeck] = useState<CardDeckKind | null>(null);
  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const canRoll = !gameState.hasRolled && !gameState.auctionState?.isOpen;

  return (
    <div
      className="center-hub flex h-full w-full flex-col overflow-hidden"
      style={{
        containerType: 'inline-size',
      }}
    >
      <div className="shrink-0 px-4 pt-3 text-center">
        <div className="center-brand mb-1 inline-flex items-center gap-2 rounded-xl px-5 py-1.5">
          <Sparkles size={15} className="text-amber-200" />
          <h1 className="text-base font-black uppercase tracking-[0.16em] text-white md:text-lg">Cờ Tỷ Phú</h1>
        </div>
        <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-900/60">Bàn mèo đại gia · Miền Nam</div>
        <div className="tax-pot-pill mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase text-amber-950">
          <Coins size={14} /> Quỹ thuế ${gameState.taxPot ?? 0}
        </div>
      </div>

      <div className="center-play-area relative flex min-h-0 w-full flex-1 items-center justify-center">
        <div className="fortune-deck-zone fortune-deck-community community-deck-position absolute z-10 flex flex-col items-center gap-1">
          <CardStack
            color="#118b72"
            borderColor="#08705b"
            label={'Khí\nVận'}
            icon={<Gift size={26} strokeWidth={2.4} />}
            rotate={-42}
            stackCount={6}
            ariaLabel="Mở bộ 16 thẻ Khí Vận"
            onClick={() => {
              gameAudio.playSfx('fortune');
              setOpenDeck('COMMUNITY_CHEST');
            }}
          />
          <span className="deck-caption font-black uppercase text-[#08705b]">🍀 Khí vận</span>
        </div>

        <div className="z-20 flex flex-col items-center justify-center gap-1">
          <div className="turn-owner-pill text-center">
            <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-900/55">Đang tới lượt</div>
            <div className="max-w-[170px] truncate text-base font-black text-slate-900">{activePlayer?.name || 'Người chơi'}</div>
            {(activePlayer?.taxDebt ?? 0) > 0 && (
              <button
                type="button"
                onClick={() => {
                  gameAudio.playSfx('uiClick');
                  onPayTaxDebt(activePlayer.id);
                }}
                className="mt-1 min-h-11 rounded-xl border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-black uppercase text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
                title="Thanh toán bằng tiền mặt; tự động bán tài sản nếu tiền mặt không đủ"
              >
                Nợ thuế ${activePlayer.taxDebt} · vòng {activePlayer.taxDebtRounds}/3
              </button>
            )}
          </div>
          <DiceShaker
            onRollResult={(die1, die2) => onRollDice([die1, die2])}
            disabled={!canRoll}
            lastDice={gameState.dice}
            hasRolled={gameState.hasRolled}
          />
          {gameState.hasRolled && !gameState.auctionState?.isOpen && (
            <button
              type="button"
              onClick={() => {
                gameAudio.playSfx('turnEnd');
                onEndTurn();
              }}
              className="end-turn-button flex min-h-11 items-center gap-2 rounded-xl px-5 py-2 text-sm font-black uppercase tracking-wider text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 active:scale-95"
            >
              Kết thúc lượt <ArrowRight size={16} />
            </button>
          )}
        </div>

        <div className="fortune-deck-zone fortune-deck-chance chance-deck-position absolute z-10 flex flex-col items-center gap-1">
          <CardStack
            color="#d62f35"
            borderColor="#9f1f24"
            label={'Cơ\nHội'}
            icon={<HelpCircle size={28} strokeWidth={2.6} />}
            rotate={-42}
            stackCount={6}
            ariaLabel="Mở bộ 16 thẻ Cơ Hội"
            onClick={() => {
              gameAudio.playSfx('fortune');
              setOpenDeck('CHANCE');
            }}
          />
          <span className="deck-caption font-black uppercase text-[#b42328]">🎴 Cơ hội</span>
        </div>
      </div>

      <div className="w-full shrink-0 px-3 pb-3">
        <div className="game-log max-h-[72px] w-full overflow-y-auto rounded-xl px-3 py-2">
          <div className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-900/45">Nhật ký bàn chơi</div>
          {gameState.logs.slice(0, 3).map((log) => (
            <div key={log.id} className="text-xs font-semibold leading-snug text-slate-700">• {log.message}</div>
          ))}
        </div>
      </div>

      {openDeck && <CardDeckModal deck={openDeck} onClose={() => setOpenDeck(null)} />}
    </div>
  );
};
