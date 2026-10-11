import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Box, ChevronRight, Map, Minus, Plus, RotateCw, Scan, Trees, Crosshair } from 'lucide-react';
import { GameState } from '../../core/types/game';
import { VIETNAMESE_BOARD_SPACES } from '../../core/constants/vietnameseBoardData';
import { formatCurrency } from '../../core/types/currency';
import { CornerSpace } from './CornerSpace';
import { StreetSpace } from './StreetSpace';
import { gameAudio } from '../../audio/audioManager';
import { MobileBoardFocus } from './MobileBoardFocus';
import { HOP_SECONDS, movementPath } from './island/sceneGeometry';
import { SceneBoundary } from './island/SceneBoundary';
import { clampZoom, MIN_ZOOM, MAX_ZOOM, useBoardCamera } from './island/useBoardCamera';
const IslandScene = lazy(() => import('./island/IslandScene'));

export interface MonopolyBoardProps {
  gameState: GameState;
  canAct: boolean;
  isDecisionPending: boolean;
  visiblePlayerIds: number[];
  zoom?: number;
  isAutoFollow?: boolean;
  onSpaceClick: (spaceIndex: number) => void;
  onRollDice: (forcedRoll?: [number, number]) => void;
  onEndTurn: () => void;
  onPayTaxDebt: (playerId: number) => void;
  onPlayerLanded?: (spaceIndex: number) => void;
  onMovementChange?: (isMoving: boolean) => void;
  onZoomChange?: (zoom: number) => void;
  onToggleFollow?: () => void;
  cameraResetKey?: number;
}

export const MonopolyBoard: React.FC<MonopolyBoardProps> = ({ gameState, visiblePlayerIds, zoom = 1, isAutoFollow = true, onSpaceClick, onPlayerLanded, onMovementChange, onZoomChange, onToggleFollow, cameraResetKey=0 }) => {
  const active = gameState.players[gameState.activePlayerIndex];
  const reducedMotion = Boolean(useReducedMotion());
  const [positions, setPositions] = useState<Record<number, number>>(() => Object.fromEntries(gameState.players.map(p => [p.id, p.position])));
  const positionRef = useRef(positions);
  const [animating, setAnimating] = useState(false);
  const [landed, setLanded] = useState<number | null>(null);
  const [view, setView] = useState(0);
  const camera = useBoardCamera(zoom, view, onZoomChange);
  useEffect(()=>{setView(0);camera.resetPan();},[cameraResetKey,camera.resetPan]);
  useEffect(()=>{if(isAutoFollow)camera.resetPan();},[isAutoFollow,camera.resetPan]);
  const [flat, setFlat] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [dicePhase, setDicePhase] = useState('idle');
  const landingRef = useRef(onPlayerLanded);
  landingRef.current = onPlayerLanded;
  const previousRoom = useRef(gameState.roomCode);
  const moving = animating || Boolean(active && (positions[active.id] ?? active.position) !== active.position);
  const positionKey = gameState.players.map(p => `${p.id}:${p.position}:${p.inJail}`).join('|');

  useEffect(() => { onMovementChange?.(moving); }, [moving, onMovementChange]);
  useEffect(() => {
    const listener = (event: Event) => setDicePhase((event as CustomEvent<{ phase: string }>).detail.phase);
    window.addEventListener('monopoly:dice-phase', listener);
    return () => { window.removeEventListener('monopoly:dice-phase', listener); document.body.style.cursor = ''; };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const commit = (next: Record<number, number>) => { positionRef.current = next; setPositions(next); };
    const newRoom = previousRoom.current !== gameState.roomCode;
    previousRoom.current = gameState.roomCode;
    if (newRoom || !gameState.hasRolled || !active) {
      commit(Object.fromEntries(gameState.players.map(p => [p.id, p.position])));
      setAnimating(false); setLanded(null);
      return;
    }
    const from = positionRef.current[active.id] ?? active.position;
    const path = movementPath(from, active.position, gameState.dice, active.inJail);
    if (!path.length) {
      setAnimating(false); setLanded(active.position);
      landingRef.current?.(active.position);
      return;
    }
    setAnimating(true); setLanded(null);
    let step = 0;
    const tick = () => {
      if (step < path.length) {
        const next = path[step++];
        commit({ ...positionRef.current, [active.id]: next });
        if (!reducedMotion) gameAudio.playSfx('stepHop');
        timer = setTimeout(tick, reducedMotion ? 12 : HOP_SECONDS * 1000 + 20);
      } else {
        setAnimating(false); setLanded(active.position);
        window.dispatchEvent(new Event('monopoly:landed'));
        gameAudio.playSfx('land'); landingRef.current?.(active.position);
      }
    };
    timer = setTimeout(tick, reducedMotion ? 0 : 80);
    return () => { if (timer) clearTimeout(timer); };
    // Keep property inspections and purchases from restarting a movement in flight.
  }, [positionKey, gameState.hasRolled, gameState.roomCode, active?.id, reducedMotion]);

  const current = VIETNAMESE_BOARD_SPACES[hovered ?? (active ? positions[active.id] ?? active.position : 0)];
  const owner = gameState.players.find(player => player.id === gameState.properties[current.index]?.ownerId);
  const occupants = (index: number) => gameState.players.filter(p => (positions[p.id] ?? p.position) === index && !p.isBankrupt && visiblePlayerIds.includes(p.id)).map(p => p.id);
  const gridPosition = (index: number) => index <= 10 ? { gridRow: 11, gridColumn: 11-index }
    : index <= 20 ? { gridRow: 21-index, gridColumn: 1 }
    : index <= 30 ? { gridRow: 1, gridColumn: index-19 }
    : { gridRow: index-29, gridColumn: 11 };

  return <section className={`island-stage ${flat ? 'is-map' : ''} ${moving ? 'is-moving' : ''}`} aria-label="Sân chơi Cờ Tỷ Phú">
    <div className="island-heading"><span className="island-map-mark"><Trees size={19}/></span><div><span>SÀI GÒN</span><strong>Thành phố trong mây</strong></div><span className="island-weather">☀ <span>Ngày nắng đẹp</span></span></div>
    <div ref={camera.surface} className={`island-canvas ${camera.dragging?'is-dragging':hovered!==null?'is-hovering':''}`} tabIndex={0} aria-label="Điều khiển camera: kéo để di chuyển, cuộn hoặc chụm hai ngón tay để zoom" onKeyDown={event=>{
      if (['+','=','-'].includes(event.key)) { event.preventDefault(); onZoomChange?.(clampZoom(zoom+(event.key==='-'?-.15:.15))); }
      if (event.key==='Home') { event.preventDefault(); setView(0); camera.resetPan(); onZoomChange?.(1); }
    }}>
      {flat ? <div className="main-board-wrapper relative flex h-full min-w-0 w-full items-center justify-center p-1 select-none">
        <div className="monopoly-board-frame" style={{ width: 'min(100cqw, 100cqh)', aspectRatio: '1', maxHeight: '100%', display: 'grid', gridTemplateColumns: '1.6fr repeat(9,1fr) 1.6fr', gridTemplateRows: '1.6fr repeat(9,1fr) 1.6fr', gap: 2, background: '#c9d1c8', border: '6px solid #66796a', transform: `scale(${zoom})` }}>
          {VIETNAMESE_BOARD_SPACES.map(space => <div key={space.index} className="map-tile" style={gridPosition(space.index)}>{space.type === 'CORNER' ? <CornerSpace space={space} occupyingPlayerIds={occupants(space.index)} activePlayerId={active?.id} currency={gameState.currency} isLandedTarget={landed===space.index} onClick={()=>onSpaceClick(space.index)}/> : <StreetSpace space={space} ownership={gameState.properties[space.index]} occupyingPlayerIds={occupants(space.index)} activePlayerId={active?.id} positionSide={space.index<10?'BOTTOM':space.index<20?'LEFT':space.index<30?'TOP':'RIGHT'} currency={gameState.currency} isLandedTarget={landed===space.index} onClick={()=>onSpaceClick(space.index)}/>}</div>)}
          <div style={{ gridColumn: '2 / 11', gridRow: '2 / 11' }}><MobileBoardFocus gameState={gameState} isMoving={moving} onInspect={onSpaceClick}/></div>
        </div>
      </div> : <SceneBoundary onFallback={()=>setFlat(true)}><Suspense fallback={<div className="island-loading"><Trees size={30}/><span>Đang dựng thành phố…</span></div>}><IslandScene gameState={gameState} positions={positions} visiblePlayerIds={visiblePlayerIds} moving={moving} zoom={zoom} view={view} pan={camera.pan} following={isAutoFollow && camera.pan.every(value=>Math.abs(value)<.01)} reducedMotion={reducedMotion} dicePhase={dicePhase} onSpaceClick={index=>{if(camera.allowSpaceClick())onSpaceClick(index);}} onHover={setHovered}/></Suspense></SceneBoundary>}
    </div>
    <div className="island-camera" aria-label="Góc nhìn bàn cờ"><button type="button" className={!flat?'is-selected':''} onClick={()=>setFlat(false)} aria-pressed={!flat}><Box size={16}/>3D</button><button type="button" className={flat?'is-selected':''} onClick={()=>setFlat(true)} aria-pressed={flat}><Map size={16}/>Bản đồ</button>{!flat && <><i/><button type="button" onClick={()=>setView(value=>(value+1)%4)} aria-label="Xoay góc nhìn"><RotateCw size={17}/></button><button type="button" onClick={()=>{setView(0);camera.resetPan();onZoomChange?.(1);}} aria-label="Góc nhìn mặc định"><Scan size={17}/></button></>}</div>
    <div className="island-zoom" aria-label="Phóng to thu nhỏ bàn cờ">
      <button type="button" aria-label="Thu nhỏ sân chơi" disabled={zoom<=MIN_ZOOM} onClick={()=>{onZoomChange?.(clampZoom(zoom-.2));gameAudio.playSfx('zoomAction');}}><Minus size={17}/></button>
      <button type="button" className="zoom-readout" aria-label="Đặt lại zoom 100 phần trăm" onClick={()=>{camera.resetPan();onZoomChange?.(1);}}>{Math.round(zoom*100)}%</button>
      <button type="button" aria-label="Phóng to sân chơi" disabled={zoom>=MAX_ZOOM} onClick={()=>{onZoomChange?.(clampZoom(zoom+.2));gameAudio.playSfx('zoomAction');}}><Plus size={17}/></button>
      {!flat && <><i/><button type="button" className={isAutoFollow&&camera.pan.every(value=>Math.abs(value)<.01)?'is-selected':''} aria-label="Bám theo nhân vật" aria-pressed={isAutoFollow&&camera.pan.every(value=>Math.abs(value)<.01)} onClick={()=>{camera.resetPan();if(!isAutoFollow)onToggleFollow?.();else if(camera.pan.every(value=>Math.abs(value)<.01))onToggleFollow?.();}}><Crosshair size={17}/></button></>}
    </div>
    <button type="button" className={`island-location ${moving ? 'is-travelling' : ''}`} onClick={()=>onSpaceClick(current.index)} aria-label={`Xem ô hiện tại: ${current.name}`}>
      <span className="location-pin">{moving?'↗':'⌖'}</span><span><small>{hovered!==null?'KHÁM PHÁ Ô ĐẤT':moving?'ĐANG DI CHUYỂN':gameState.hasRolled?'ĐIỂM DỪNG CHÂN':'BẠN ĐANG Ở'}</small><strong>{current.name}</strong><em>{owner?`Đất của ${owner.name}`:current.price?`Giá ${formatCurrency(current.price,gameState.currency)}`:current.index===0?'Qua đây nhận 200 vàng':'Chạm để xem chi tiết'}</em></span><ChevronRight size={18}/>
    </button>
    <span className="island-hint">Kéo để khám phá · Cuộn để zoom · Chạm ô đất để xem</span>
  </section>;
};
