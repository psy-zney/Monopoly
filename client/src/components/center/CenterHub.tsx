import React, { useState } from 'react';
import { ArrowRight, Gift, HelpCircle, Sparkles } from 'lucide-react';
import { GameState } from '../../core/types/game';
import { CardDeckKind } from '../../core/constants/cardDeckData';
import { DiceShaker } from './DiceShaker';
import { CardStack } from './CardStack';
import { CardDeckModal } from './CardDeckModal';
import { gameAudio } from '../../audio/audioManager';
import { formatCurrency } from '../../core/types/currency';
import { Button } from '../ui/Button';
import { PlayerAvatar } from '../hud/PlayerAvatar';
import { getPlayerPreset } from '../../core/types/playerTokens';
import { getTurnFlow } from './turnFlow';

export interface CenterHubProps {
  gameState: GameState;
  canAct: boolean;
  isMoving: boolean;
  isDecisionPending: boolean;
  onRollDice: (forcedRoll?: [number, number]) => void;
  onEndTurn: () => void;
  onPayTaxDebt: (playerId: number) => void;
}

export const CenterHub: React.FC<CenterHubProps> = ({
  gameState,
  canAct,
  isMoving,
  isDecisionPending,
  onRollDice,
  onEndTurn,
  onPayTaxDebt,
}) => {
  const [openDeck, setOpenDeck] = useState<CardDeckKind | null>(null);
  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const { canRollAgain, canRoll, canEndTurn, label: nextStep } = getTurnFlow(gameState, canAct, isMoving, isDecisionPending);
  const currency = gameState.currency ?? 'GOLD';

  return (
    <div className="center-hub relative flex h-full w-full flex-col items-center justify-between p-2 select-none overflow-hidden bg-gradient-to-b from-emerald-950 via-[#0a2920] to-emerald-950 shadow-inner">
      {/* ── TOP: Luxury Board Title ── */}
      <div className="text-center pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/80 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <Sparkles size={11} className="text-amber-400" />
          <span>Bàn Đất Vàng · Miền Nam Sài Gòn</span>
        </div>
        {activePlayer && (
          <div className="turn-focus-card" style={{ '--turn-color': getPlayerPreset(activePlayer.id).colorHex } as React.CSSProperties}>
            <PlayerAvatar playerId={activePlayer.id} size={30} showGlow />
            <div className="min-w-0 text-left">
              <strong className="block truncate">{activePlayer.name} đang lượt</strong>
              <span className="block truncate">{nextStep}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── CENTER AREA: 3D Decks & Dice Tray ── */}
      <div className="relative flex min-h-0 w-full flex-1 items-center justify-center px-2">
        {/* Left: 3D Angled Khí Vận Deck */}
        <div className="deck-slot deck-slot-left absolute flex flex-col items-center gap-1 z-10">
          <CardStack
            color="#0d9488"
            borderColor="#0f766e"
            label={'Khí\nVận'}
            icon={<Gift size={24} strokeWidth={2.4} />}
            rotate={-38}
            stackCount={5}
            ariaLabel="Mở bộ thẻ Khí Vận"
            onClick={() => {
              gameAudio.playSfx('fortune');
              setOpenDeck('COMMUNITY_CHEST');
            }}
          />
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 drop-shadow-sm mt-1">
            🍀 Khí Vận
          </span>
        </div>

        {/* Center: Dice Tray Arena */}
        <div className="dice-tray relative z-20 flex flex-col items-center justify-center p-3 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-amber-400/40 shadow-2xl max-w-[280px] w-full">
          <DiceShaker
            onRollResult={(die1, die2) => onRollDice([die1, die2])}
            disabled={!canRoll}
            lastDice={gameState.dice}
            hasRolled={gameState.hasRolled}
            canRollAgain={canRollAgain && canAct && !isMoving && !isDecisionPending}
          />

          {/* Tax Debt Button if needed */}
          {(activePlayer?.taxDebt ?? 0) > 0 && (
            <button
              type="button"
              onClick={() => {
                gameAudio.playSfx('uiClick');
                onPayTaxDebt(activePlayer.id);
              }}
              className="mt-2 min-h-7 rounded-xl border border-rose-400 bg-rose-950/60 px-3 py-1 text-[10px] font-black uppercase text-rose-300 shadow-sm active:scale-95 transition-all"
            >
              Nợ thuế {formatCurrency(activePlayer.taxDebt, currency)} ({activePlayer.taxDebtRounds}/3)
            </button>
          )}

          {/* Primary Action Button: Kết thúc lượt (When roll has completed) */}
          {canEndTurn && (
            <Button
              variant="primary"
              size="md"
              className="mt-2.5 w-full max-w-[200px] shadow-lg shadow-amber-500/25"
              icon={<ArrowRight size={15} />}
              onClick={() => {
                gameAudio.playSfx('turnEnd');
                onEndTurn();
              }}
            >
              KẾT THÚC LƯỢT
            </Button>
          )}
        </div>

        {/* Right: 3D Angled Cơ Hội Deck */}
        <div className="deck-slot deck-slot-right absolute flex flex-col items-center gap-1 z-10">
          <CardStack
            color="#dc2626"
            borderColor="#991b1b"
            label={'Cơ\nHội'}
            icon={<HelpCircle size={26} strokeWidth={2.6} />}
            rotate={-38}
            stackCount={5}
            ariaLabel="Mở bộ thẻ Cơ Hội"
            onClick={() => {
              gameAudio.playSfx('fortune');
              setOpenDeck('CHANCE');
            }}
          />
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 drop-shadow-sm mt-1">
            🎴 Cơ Hội
          </span>
        </div>
      </div>

      {/* ── BOTTOM: Status Subtitle ── */}
      <div className="pb-1 text-center">
        <span className="text-[10px] font-semibold text-emerald-200/60 tracking-wider">
          {nextStep}
        </span>
      </div>

      {openDeck && <CardDeckModal deck={openDeck} onClose={() => setOpenDeck(null)} />}
    </div>
  );
};
