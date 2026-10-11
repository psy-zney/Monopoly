import React from 'react';
import { Building2, Flag, Gift, Landmark, TrainFront } from 'lucide-react';
import { TownIllustration } from '../ui/TownIllustration';
import { GameState } from '../../core/types/game';
import { VIETNAMESE_BOARD_SPACES } from '../../core/constants/vietnameseBoardData';
import { formatCurrency } from '../../core/types/currency';

export const MobileBoardFocus: React.FC<{ gameState: GameState; isMoving: boolean; onInspect: (index: number) => void }> = ({ gameState, isMoving, onInspect }) => {
  const player = gameState.players[gameState.activePlayerIndex];
  const space = VIETNAMESE_BOARD_SPACES[player?.position ?? 0];
  const ownership = gameState.properties[space.index];
  const owner = gameState.players.find((candidate) => candidate.id === ownership?.ownerId);
  const Icon = space.type === 'PROPERTY' ? Building2 : space.type === 'RAILROAD' ? TrainFront
    : space.type === 'CHANCE' || space.type === 'COMMUNITY_CHEST' ? Gift
    : space.type === 'TAX' ? Landmark : Flag;
  return (
    <div className="board-focus">
      <div className="board-focus-brand">CỜ TỶ PHÚ<span>VIỆT NAM</span></div>
      <TownIllustration className="board-town" />
      <button type="button" className="mobile-current-space" onClick={() => onInspect(space.index)} aria-label={`Xem ô hiện tại: ${space.name}`}>
        <span className="mobile-space-eyebrow">{isMoving ? 'ĐANG DI CHUYỂN' : gameState.hasRolled ? 'Ô VỪA DỪNG' : 'VỊ TRÍ HIỆN TẠI'}</span>
        <Icon size={32} strokeWidth={1.6} />
        <strong>{space.name}</strong>
        <span className="mobile-space-detail">{owner ? `Đất của ${owner.name}` : space.price && gameState.properties[space.index]
          ? `Chưa có chủ · ${formatCurrency(space.price, gameState.currency)}`
          : space.index === 0 ? `Qua đây nhận ${formatCurrency(200, gameState.currency)}` : 'Chạm để xem chi tiết'}</span>
      </button>
      <span className="mobile-board-hint">Chọn một ô để xem sổ đỏ</span>
    </div>
  );
};
