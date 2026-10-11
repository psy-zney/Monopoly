import React from 'react';
import { ArrowRight, Building2, Coins, ScrollText } from 'lucide-react';
import { GameState } from '../../core/types/game';
import { formatCurrency } from '../../core/types/currency';
import { PlayerAvatar } from '../hud/PlayerAvatar';
import { DiceShaker } from '../center/DiceShaker';
import { getTurnFlow } from '../center/turnFlow';

interface Props {
  gameState: GameState;
  canAct: boolean;
  isMoving: boolean;
  isDecisionPending: boolean;
  onRoll: (dice: [number, number]) => void;
  onEndTurn: () => void;
  onPayTaxDebt: (playerId: number) => void;
  onPortfolio: () => void;
  onLogs: () => void;
  onDecision: () => void;
}

export function GameControls({ gameState, canAct, isMoving, isDecisionPending, onRoll, onEndTurn, onPayTaxDebt, onPortfolio, onLogs, onDecision }: Props) {
  const player = gameState.players[gameState.activePlayerIndex];
  const flow = getTurnFlow(gameState, canAct, isMoving, isDecisionPending);
  if (!player) return null;
  const propertyCount = Object.values(gameState.properties).filter(property => property.ownerId === player.id).length;
  return <section className="game-controls" aria-label="Điều khiển lượt chơi">
    <div className="turn-owner"><PlayerAvatar playerId={player.id} size={48} /><div><small>{canAct ? 'LƯỢT CỦA BẠN' : 'ĐANG LƯỢT'}</small><strong>{player.name}</strong></div><b className="turn-cash">{formatCurrency(player.cash, gameState.currency)}</b></div>
    <div className="turn-guidance"><span className="turn-dot" /><p role="status">{flow.label}</p></div>
    <div className="turn-action-area">
      <DiceShaker variant="compact" lastDice={gameState.dice} hasRolled={gameState.hasRolled} disabled={!flow.canRoll} canRollAgain={flow.canRollAgain} onRollResult={(one, two) => onRoll([one, two])} />
      {flow.canEndTurn && <button type="button" className="mobile-primary-action" onClick={onEndTurn}>Kết thúc lượt<ArrowRight size={20} /></button>}
      {isDecisionPending && canAct && <button type="button" className="mobile-primary-action" onClick={onDecision}>Mua đất hoặc đấu giá<Building2 size={20} /></button>}
      {!canAct && <div className="waiting-action">Chờ {player.name}</div>}
      {(player.taxDebt ?? 0) > 0 && canAct && <button type="button" className="tax-action" onClick={() => onPayTaxDebt(player.id)}><Coins size={16} />Nộp nợ thuế {formatCurrency(player.taxDebt, gameState.currency)}</button>}
    </div>
    <div className="last-event"><span>VỪA XẢY RA</span><p>{gameState.logs[0]?.message ?? 'Bàn chơi đã sẵn sàng. Gieo xúc xắc để bắt đầu.'}</p></div>
    <div className="control-tools"><button type="button" onClick={onPortfolio}><Building2 size={18} />Tài sản <b>{propertyCount}</b></button><button type="button" onClick={onLogs}><ScrollText size={18} />Nhật ký</button></div>
    <div className="tax-pot">Quỹ thuế <b>{formatCurrency(gameState.taxPot ?? 0, gameState.currency)}</b></div>
  </section>;
}
