import { getSpaceCoordinates } from '../boardGeometry';

export const BOARD_SIZE = 12.2;
export const TILE_TOP = 0.56;
export const HOP_SECONDS = 0.24;

export function tilePosition(index: number): [number, number] {
  const point = getSpaceCoordinates(index);
  return [(point.x / 100 - 0.5) * BOARD_SIZE, (point.y / 100 - 0.5) * BOARD_SIZE];
}

export function tileRotation(index: number): number {
  if (index <= 10) return 0;
  if (index <= 20) return Math.PI / 2;
  if (index <= 30) return Math.PI;
  return -Math.PI / 2;
}

export const GROUP_COLORS: Record<string, string> = {
  BROWN: '#c98561', LIGHT_BLUE: '#55c8e4', PINK: '#f080b6', ORANGE: '#ffab45',
  RED: '#f67570', YELLOW: '#f5d450', GREEN: '#4ec396', DARK_BLUE: '#6398e1',
};

// Card moves and jail transfers do not necessarily follow the dice path.
export function movementPath(from: number, to: number, dice: [number, number], inJail: boolean): number[] {
  if (from === to) return [];
  const steps = dice[0] + dice[1];
  if (inJail || (from + steps) % 40 !== to) return [to];
  return Array.from({ length: steps }, (_, index) => (from + index + 1) % 40);
}
