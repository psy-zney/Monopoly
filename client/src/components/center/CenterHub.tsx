import React, { useState } from 'react';
import { Coins, Gift, HelpCircle } from 'lucide-react';
import { GameState } from '../../core/types/game';
import { CardDeckKind } from '../../core/constants/cardDeckData';
import { DiceShaker } from './DiceShaker';
import { CardStack } from './CardStack';
import { CardDeckModal } from './CardDeckModal';

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
      className="flex h-full w-full flex-col overflow-hidden"
      style={{
        background: '#fffdf5',
        border: '3px solid #c8a951',
        borderRadius: 6,
        containerType: 'inline-size',
      }}
    >
      <div className="shrink-0 px-4 pt-3 text-center">
        <div className="mb-0.5 inline-block rounded-md bg-[#dc2626] px-5 py-1">
          <h1 className="text-lg font-black uppercase tracking-widest text-white md:text-xl">CỜ TỶ PHÚ</h1>
        </div>
        <div className="text-[9px] font-black uppercase tracking-widest text-[#a88735]">Doraemon · Bản Miền Nam</div>
        <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[9px] font-black uppercase text-amber-800">
          <Coins size={12} /> Quỹ thuế ${gameState.taxPot ?? 0}
        </div>
      </div>

      <div className="center-play-area relative flex min-h-0 w-full flex-1 items-center justify-center">
        <div className="community-deck-position absolute z-10 flex flex-col items-center gap-1">
          <CardStack
            color="#118b72"
            borderColor="#08705b"
            label={'Khí\nVận'}
            icon={<Gift size={26} strokeWidth={2.4} />}
            rotate={-42}
            stackCount={6}
            ariaLabel="Mở bộ 16 thẻ Khí Vận"
            onClick={() => setOpenDeck('COMMUNITY_CHEST')}
          />
          <span className="deck-caption font-black uppercase text-[#08705b]">Khí Vận</span>
        </div>

        <div className="z-20 flex flex-col items-center justify-center gap-1.5">
          <div className="text-center">
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Lượt chơi</div>
            <div className="max-w-[150px] truncate text-sm font-black text-slate-800">{activePlayer?.name || 'Người chơi'}</div>
            {(activePlayer?.taxDebt ?? 0) > 0 && (
              <button
                type="button"
                onClick={() => onPayTaxDebt(activePlayer.id)}
                className="mt-0.5 rounded-md border border-red-300 bg-red-50 px-2 py-0.5 text-[8px] font-black uppercase text-red-700"
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
              onClick={onEndTurn}
              className="rounded-md bg-green-600 px-5 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow active:scale-95"
            >
              Kết thúc lượt
            </button>
          )}
        </div>

        <div className="chance-deck-position absolute z-10 flex flex-col items-center gap-1">
          <CardStack
            color="#d62f35"
            borderColor="#9f1f24"
            label={'Cơ\nHội'}
            icon={<HelpCircle size={28} strokeWidth={2.6} />}
            rotate={-42}
            stackCount={6}
            ariaLabel="Mở bộ 16 thẻ Cơ Hội"
            onClick={() => setOpenDeck('CHANCE')}
          />
          <span className="deck-caption font-black uppercase text-[#b42328]">Cơ Hội</span>
        </div>
      </div>

      <div className="w-full shrink-0 px-3 pb-3">
        <div className="max-h-[64px] w-full overflow-y-auto rounded-md border border-[#e8d5a3] bg-[#faf5e4] px-2.5 py-2">
          <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">Nhật ký</div>
          {gameState.logs.slice(0, 3).map((log) => (
            <div key={log.id} className="text-[9px] leading-snug text-slate-600">• {log.message}</div>
          ))}
        </div>
      </div>

      {openDeck && <CardDeckModal deck={openDeck} onClose={() => setOpenDeck(null)} />}
    </div>
  );
};
