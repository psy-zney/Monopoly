import React, { useState } from 'react';
import { ArrowRight, Building2, Coins, ScrollText, X } from 'lucide-react';
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
}

export const MobileGamePanel: React.FC<Props> = ({ gameState, canAct, isMoving, isDecisionPending, onRoll, onEndTurn, onPayTaxDebt, onPortfolio }) => {
  const [showLogs, setShowLogs] = useState(false);
  const player = gameState.players[gameState.activePlayerIndex];
  const flow = getTurnFlow(gameState, canAct, isMoving, isDecisionPending);
  const propertyCount = Object.values(gameState.properties).filter((property) => property.ownerId === player?.id).length;
  if (!player) return null;
  return (
    <section className="mobile-game-panel" aria-label="Điều khiển lượt chơi">
      <div className="mobile-active-player">
        <PlayerAvatar playerId={player.id} size={42} showGlow />
        <div className="mobile-active-copy"><small>ĐANG LƯỢT</small><strong>{player.name}</strong></div>
        <div className="mobile-cash"><small>Tiền mặt</small><strong>{formatCurrency(player.cash, gameState.currency)}</strong></div>
      </div>
      <p className="mobile-turn-instruction" role="status">{flow.label}</p>
      <div className="mobile-turn-actions">
        <DiceShaker variant="compact" onRollResult={(one, two) => onRoll([one, two])} lastDice={gameState.dice} hasRolled={gameState.hasRolled} disabled={!flow.canRoll} canRollAgain={flow.canRollAgain} />
        {flow.canEndTurn && <button type="button" className="mobile-primary-action" onClick={onEndTurn}>Kết thúc lượt<ArrowRight size={21} /></button>}
        {(player.taxDebt ?? 0) > 0 && canAct && <button type="button" className="mobile-tax-action" onClick={() => onPayTaxDebt(player.id)}><Coins size={16} />Nộp nợ thuế {formatCurrency(player.taxDebt, gameState.currency)}</button>}
      </div>
      <div className="mobile-latest-event"><span>VỪA XẢY RA</span><p>{gameState.logs[0]?.message ?? 'Chào mừng vào bàn chơi.'}</p></div>
      <div className="mobile-panel-tools">
        <button type="button" onClick={onPortfolio}><Building2 size={18} />Tài sản <b>{propertyCount}</b></button>
        <span>Quỹ thuế <strong>{formatCurrency(gameState.taxPot ?? 0, gameState.currency)}</strong></span>
        <button type="button" onClick={() => setShowLogs(true)}><ScrollText size={18} />Nhật ký</button>
      </div>
      {showLogs && (
        <div className="mobile-sheet-backdrop" onClick={() => setShowLogs(false)}>
          <section className="mobile-log-sheet" role="dialog" aria-modal="true" aria-label="Nhật ký ván đấu" onClick={(event) => event.stopPropagation()}>
            <header><strong>Nhật ký ván đấu</strong><button type="button" onClick={() => setShowLogs(false)} aria-label="Đóng nhật ký"><X size={21} /></button></header>
            <div>{gameState.logs.map((log) => <p key={log.id}>{log.message}</p>)}</div>
          </section>
        </div>
      )}
    </section>
  );
};
