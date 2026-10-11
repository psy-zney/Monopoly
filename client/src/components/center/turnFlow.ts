import { GameState } from '../../core/types/game';

export function getTurnFlow(gameState: GameState, canAct: boolean, isMoving: boolean, isDecisionPending: boolean) {
  const player = gameState.players[gameState.activePlayerIndex];
  const canRollAgain = gameState.hasRolled && gameState.doublesCount > 0 &&
    gameState.dice[0] === gameState.dice[1] && !player?.inJail;
  const blocked = !canAct || isMoving || isDecisionPending || Boolean(gameState.auctionState?.isOpen);
  const canRoll = !blocked && (!gameState.hasRolled || canRollAgain);
  const canEndTurn = !blocked && gameState.hasRolled && !canRollAgain;
  const label = gameState.auctionState?.isOpen ? 'Đấu giá đang diễn ra'
    : isMoving ? 'Đang di chuyển đến ô mới'
    : isDecisionPending ? 'Chọn mua đất hoặc mở đấu giá'
    : !canAct ? 'Chờ người chơi này hành động'
    : canRollAgain ? 'Đổ đôi! Bạn được gieo tiếp'
    : canRoll ? 'Gieo xúc xắc để bắt đầu lượt'
    : 'Hoàn tất hành động · chuyển lượt';
  return { canRollAgain, canRoll, canEndTurn, label };
}
