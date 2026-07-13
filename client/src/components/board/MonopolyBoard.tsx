import React from 'react';
import { GameState } from '../../core/types/game';
import { VIETNAMESE_BOARD_SPACES } from '../../core/constants/vietnameseBoardData';
import { CornerSpace } from './CornerSpace';
import { StreetSpace } from './StreetSpace';
import { CenterHub } from '../center/CenterHub';

export interface MonopolyBoardProps {
  gameState: GameState;
  onSpaceClick: (spaceIndex: number) => void;
  onRollDice: (forcedRoll?: [number, number]) => void;
  onEndTurn: () => void;
  onPayTaxDebt: (playerId: number) => void;
}

export const MonopolyBoard: React.FC<MonopolyBoardProps> = ({
  gameState,
  onSpaceClick,
  onRollDice,
  onEndTurn,
  onPayTaxDebt,
}) => {
  const getOccupyingPlayers = (spaceIndex: number) =>
    gameState.players
      .filter((p) => p.position === spaceIndex && !p.isBankrupt)
      .map((p) => p.id);

  const renderSpace = (index: number, side: 'BOTTOM' | 'LEFT' | 'TOP' | 'RIGHT') => {
    const space = VIETNAMESE_BOARD_SPACES[index];
    if (!space) return null;
    const occupyingIds = getOccupyingPlayers(index);

    if (space.type === 'CORNER') {
      return (
        <CornerSpace
          key={index}
          space={space}
          occupyingPlayerIds={occupyingIds}
          onClick={() => onSpaceClick(index)}
        />
      );
    }
    return (
      <StreetSpace
        key={index}
        space={space}
        ownership={gameState.properties[index]}
        occupyingPlayerIds={occupyingIds}
        positionSide={side}
        onClick={() => onSpaceClick(index)}
      />
    );
  };

  return (
    <div
      className="aspect-square max-w-full max-h-full"
      style={{
        /* Classic thick outer border like original board */
        border: '6px solid #c8a951',
        borderRadius: 6,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 0 #a07830',
        background: '#ffffff',
        height: '100%',
      }}
    >
      {/* 11x11 CSS Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr repeat(9, 1fr) 1.6fr',
          gridTemplateRows: '1.6fr repeat(9, 1fr) 1.6fr',
          width: '100%',
          height: '100%',
          gap: '1px',
          background: '#c8a951',
        }}
      >
        {/* ROW 1 (TOP): 10 → 20 */}
        {renderSpace(10, 'TOP')}
        {renderSpace(11, 'TOP')}
        {renderSpace(12, 'TOP')}
        {renderSpace(13, 'TOP')}
        {renderSpace(14, 'TOP')}
        {renderSpace(15, 'TOP')}
        {renderSpace(16, 'TOP')}
        {renderSpace(17, 'TOP')}
        {renderSpace(18, 'TOP')}
        {renderSpace(19, 'TOP')}
        {renderSpace(20, 'TOP')}

        {/* ROWS 2-10 */}
        {renderSpace(9, 'LEFT')}
        <div style={{ gridColumn: 'span 9', gridRow: 'span 9' }}>
          <CenterHub
            gameState={gameState}
            onRollDice={onRollDice}
            onEndTurn={onEndTurn}
            onPayTaxDebt={onPayTaxDebt}
          />
        </div>
        {renderSpace(21, 'RIGHT')}

        {renderSpace(8,  'LEFT')}  {renderSpace(22, 'RIGHT')}
        {renderSpace(7,  'LEFT')}  {renderSpace(23, 'RIGHT')}
        {renderSpace(6,  'LEFT')}  {renderSpace(24, 'RIGHT')}
        {renderSpace(5,  'LEFT')}  {renderSpace(25, 'RIGHT')}
        {renderSpace(4,  'LEFT')}  {renderSpace(26, 'RIGHT')}
        {renderSpace(3,  'LEFT')}  {renderSpace(27, 'RIGHT')}
        {renderSpace(2,  'LEFT')}  {renderSpace(28, 'RIGHT')}
        {renderSpace(1,  'LEFT')}  {renderSpace(29, 'RIGHT')}

        {/* ROW 11 (BOTTOM): 0 → 30 */}
        {renderSpace(0,  'BOTTOM')}
        {renderSpace(39, 'BOTTOM')}
        {renderSpace(38, 'BOTTOM')}
        {renderSpace(37, 'BOTTOM')}
        {renderSpace(36, 'BOTTOM')}
        {renderSpace(35, 'BOTTOM')}
        {renderSpace(34, 'BOTTOM')}
        {renderSpace(33, 'BOTTOM')}
        {renderSpace(32, 'BOTTOM')}
        {renderSpace(31, 'BOTTOM')}
        {renderSpace(30, 'BOTTOM')}
      </div>
    </div>
  );
};
