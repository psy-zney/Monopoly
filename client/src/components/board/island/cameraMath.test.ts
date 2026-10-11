import { describe, expect, it } from 'vitest';
import { cameraDrag, clampZoom } from './useBoardCamera';

describe('board camera gestures',()=>{
  it('keeps both wheel and pinch zoom inside the usable range',()=>{
    expect(clampZoom(.1)).toBe(.7);expect(clampZoom(9)).toBe(2.4);expect(clampZoom(1.36)).toBe(1.36);
  });
  it('projects horizontal dragging into the current camera orientation',()=>{
    const [x,z]=cameraDrag(100,0,100,Math.PI/4);
    expect(x).toBeCloseTo(-Math.SQRT1_2);expect(z).toBeCloseTo(Math.SQRT1_2);
    const [turnedX,turnedZ]=cameraDrag(100,0,100,Math.PI*3/4);
    expect(turnedX).toBeCloseTo(-x);expect(turnedZ).toBeCloseTo(z);
  });
  it('compensates for zoom so the same drag moves half as far at 200%',()=>{
    const normal=cameraDrag(40,20,40,Math.PI/4), zoomed=cameraDrag(40,20,80,Math.PI/4);
    expect(zoomed[0]).toBeCloseTo(normal[0]/2);expect(zoomed[1]).toBeCloseTo(normal[1]/2);
  });
  it('keeps horizontal and vertical drag axes perpendicular',()=>{
    const horizontal=cameraDrag(50,0,50,Math.PI*1.25), vertical=cameraDrag(0,50,50,Math.PI*1.25);
    expect(horizontal[0]*vertical[0]+horizontal[1]*vertical[1]).toBeCloseTo(0);
  });
});
