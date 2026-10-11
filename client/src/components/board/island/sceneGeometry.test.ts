import { describe, expect, it } from 'vitest';
import { movementPath, tilePosition } from './sceneGeometry';

describe('island movement', () => {
  it('walks all twelve steps for a double six', () => {
    expect(movementPath(0,12,[6,6],false)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]);
  });
  it('walks through START when a roll crosses the end of the board', () => {
    expect(movementPath(37,4,[3,4],false)).toEqual([38,39,0,1,2,3,4]);
  });
  it('transfers to jail without walking an unrelated dice path', () => {
    expect(movementPath(24,10,[3,3],true)).toEqual([10]);
  });
  it('transfers to a card destination and leaves stationary pawns alone', () => {
    expect(movementPath(18,0,[2,2],false)).toEqual([0]);
    expect(movementPath(10,10,[2,3],true)).toEqual([]);
  });
  it('places the four corner pawns on their corresponding physical tiles', () => {
    for (const [index, x, z] of [[0,5.3,5.3],[10,-5.3,5.3],[20,-5.3,-5.3],[30,5.3,-5.3]]) {
      expect(tilePosition(index)[0]).toBeCloseTo(x,2);
      expect(tilePosition(index)[1]).toBeCloseTo(z,2);
    }
  });
});
