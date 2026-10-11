import { useCallback, useEffect, useRef, useState } from 'react';

export const MIN_ZOOM = .7;
export const MAX_ZOOM = 2.4;
export const clampZoom = (value: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));

/** Screen-space drag projected onto the island's ground plane. */
export function cameraDrag(dx: number, dy: number, pixelsPerUnit: number, angle: number): [number, number] {
  const horizontal = dx / pixelsPerUnit, vertical = dy / (pixelsPerUnit * .65);
  return [-horizontal * Math.cos(angle) - vertical * Math.sin(angle), horizontal * Math.sin(angle) - vertical * Math.cos(angle)];
}

export function useBoardCamera(zoom: number, view: number, onZoomChange?: (zoom: number) => void) {
  const surface = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState<[number, number]>([0, 0]);
  const [dragging, setDragging] = useState(false);
  const values = useRef({zoom, view, onZoomChange});
  values.current = {zoom, view, onZoomChange};
  const blockClickUntil = useRef(0);
  const resetPan=useCallback(()=>setPan(previous=>previous[0]===0&&previous[1]===0?previous:[0,0]),[]);
  useEffect(() => {
    const element = surface.current;
    if (!element) return;
    const pointers = new Map<number, {x:number; y:number}>();
    let origin = {x:0,y:0}, last = {x:0,y:0}, pinchDistance = 0, didDrag = false;
    const distance = () => { const [a,b]=Array.from(pointers.values()); return a&&b ? Math.hypot(a.x-b.x,a.y-b.y) : 0; };
    const down = (event: PointerEvent) => {
      if (event.button!==0 && event.pointerType==='mouse') return;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      origin=last={x:event.clientX,y:event.clientY};
      if (pointers.size===1) didDrag=false;
      if (pointers.size===2) { pinchDistance=distance(); didDrag=true; setDragging(true); pointers.forEach((_,id)=>element.setPointerCapture(id)); }
    };
    const move = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if (pointers.size===2) {
        const next=distance();
        if (pinchDistance>0) { const value=clampZoom(values.current.zoom*next/pinchDistance); values.current.zoom=value; values.current.onZoomChange?.(value); }
        pinchDistance=next; event.preventDefault(); event.stopPropagation(); return;
      }
      if (!didDrag && Math.hypot(event.clientX-origin.x,event.clientY-origin.y)<6) return;
      if (!didDrag) { didDrag=true; setDragging(true); element.setPointerCapture(event.pointerId); }
      const rect=element.getBoundingClientRect();
      const scale=Math.min(rect.width/21,rect.height/16.5)*values.current.zoom;
      const [x,z]=cameraDrag(event.clientX-last.x,event.clientY-last.y,scale,Math.PI/4+values.current.view*Math.PI/2);
      setPan(previous=>[Math.max(-7,Math.min(7,previous[0]+x)),Math.max(-7,Math.min(7,previous[1]+z))]);
      last={x:event.clientX,y:event.clientY}; event.preventDefault(); event.stopPropagation();
    };
    const up = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (didDrag) blockClickUntil.current=performance.now()+350;
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
      const remaining=Array.from(pointers.values())[0]; if (remaining) origin=last=remaining;
      if (!pointers.size) { didDrag=false; setDragging(false); }
    };
    const wheel = (event: WheelEvent) => {
      if (!values.current.onZoomChange) return;
      event.preventDefault();
      const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?element.clientHeight:1);
      const value=clampZoom(values.current.zoom*Math.exp(-pixels*.0018));
      values.current.zoom=value; values.current.onZoomChange(value);
    };
    const click = (event: MouseEvent) => { if(performance.now()<blockClickUntil.current) { event.preventDefault(); event.stopPropagation(); } };
    element.addEventListener('pointerdown',down,true); element.addEventListener('pointermove',move,true);
    window.addEventListener('pointerup',up,true); window.addEventListener('pointercancel',up,true);
    element.addEventListener('wheel',wheel,{passive:false}); element.addEventListener('click',click,true);
    return()=>{ element.removeEventListener('pointerdown',down,true); element.removeEventListener('pointermove',move,true); window.removeEventListener('pointerup',up,true); window.removeEventListener('pointercancel',up,true); element.removeEventListener('wheel',wheel); element.removeEventListener('click',click,true); };
  },[]);
  return {surface, pan, dragging, resetPan, allowSpaceClick:()=>performance.now()>=blockClickUntil.current};
}
