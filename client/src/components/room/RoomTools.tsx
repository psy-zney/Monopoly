
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, MessageSquare, X, Play, Egg, Bomb, Mountain } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { CardDeckModal } from '../center/CardDeckModal';
import type { CardDeckKind } from '../../core/constants/cardDeckData';
import { gameAudio } from '../../audio/audioManager';
import { ChatMessage, StickerPicker } from '../../MemeStickers';
import { stickerMessage, type Sticker } from '../../stickers';

export function RoomChatPanel({ onClose }: { onClose: () => void }) {
 const { online, sendChat } = useGameStore();
 const [draft, setDraft] = useState('');
 const [cooling, setCooling] = useState(false);
 const cooldown = useRef(0);
 const timer = useRef<ReturnType<typeof setTimeout>>();
 const log = useRef<HTMLDivElement>(null);
 useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [online.messages.length]);
 useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
 function submit(text: string, clearDraft = false) {
  if (!text.trim() || !online.connected || Date.now() < cooldown.current) return;
  cooldown.current = Date.now() + 800; setCooling(true);
  timer.current = setTimeout(() => setCooling(false), 800);
  sendChat(text);
  if (clearDraft) setDraft('');
 }
 function sendSticker(sticker: Sticker) { submit(stickerMessage(sticker)); }
 return <section className="room-chat-panel" aria-label="Trò chuyện">
  <header><strong>Trò chuyện</strong><button className="icon-button" aria-label="Đóng chat" onClick={onClose}><X size={17}/></button></header>
  <div className="room-chat-feed" ref={log} role="log" aria-live="polite">{online.messages.length ? online.messages.map(m => <div key={m.id} className={m.playerId === online.playerId ? 'is-own' : ''}><small>{m.name}</small><ChatMessage text={m.text}/></div>) : <p className="chat-empty">Chưa ai nói gì.<br/><small>Chào một câu, ván chơi vui hơn.</small></p>}</div>
  <form onSubmit={e => {e.preventDefault(); submit(draft.trim(), true);}}>
   <StickerPicker disabled={!online.connected || cooling} onSend={sendSticker}/>
   <label htmlFor="monopoly-chat">Tin nhắn của bạn</label><input id="monopoly-chat" maxLength={240} value={draft} onChange={e => setDraft(e.target.value)} placeholder="Nhắn cho cả phòng…"/>
   <button className="primary-button" disabled={!draft.trim() || !online.connected || cooling}>Gửi ↗</button>{online.error && <small role="status">{online.error}</small>}
  </form>
 </section>;
}
export function RoomTools({ chatOpen: controlled, onChatChange }: { chatOpen?: boolean; onChatChange?: (open: boolean) => void }) {
 const { online } = useGameStore();
 const [internalOpen, setOpen] = useState(false);
 const open = controlled ?? internalOpen;
 const [help, setHelp] = useState(false);
 const [video, setVideo] = useState(false);
 const [deck, setDeck] = useState<CardDeckKind | null>(null);
 const popup = useRef<HTMLElement>(null);
 useEffect(() => {
  if (!help && !video) return;
  const previous = document.activeElement as HTMLElement | null;
  const panel = popup.current;
  panel?.querySelector<HTMLButtonElement>('button')?.focus();
  const trap = (event: KeyboardEvent) => {
   if (event.key !== 'Tab' || !panel) return;
   const items = [...panel.querySelectorAll<HTMLElement>('button, a[href], input, video[controls], [tabindex="0"]')];
   if (!items.length) return;
   const first = items[0], last = items[items.length - 1];
   if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
   else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  document.addEventListener('keydown', trap);
  return () => { document.removeEventListener('keydown', trap); if (previous?.isConnected) previous.focus(); };
 }, [help, video]);
 const seen = useRef(0);
 if (open) seen.current = online.messages.at(-1)?.id ?? 0;
 const unread = online.messages.filter(m => m.id > seen.current && m.playerId !== online.playerId).length;
 const toggle = (value: boolean) => { if (onChatChange) onChatChange(value); else setOpen(value); };
 useEffect(() => { const escape = (e: KeyboardEvent) => { if(e.key === 'Escape') { setHelp(false); setVideo(false); toggle(false); } }; window.addEventListener('keydown',escape); return () => window.removeEventListener('keydown',escape); }, []);
 return <><div className="room-tools"><button className="icon-button" aria-label="Trợ giúp" onClick={() => setHelp(true)}><HelpCircle size={21}/></button>{online.roomCode && <button className="icon-button" aria-label="Trò chuyện" aria-expanded={open} onClick={() => toggle(!open)}><MessageSquare size={21}/>{!open && unread > 0 && <b>{unread}</b>}</button>}</div>
 {help && createPortal(<div className="detail-backdrop room-utility-backdrop" onClick={() => setHelp(false)}><section ref={popup} className="room-help" role="dialog" aria-modal="true" aria-label="Trợ giúp" onClick={e => e.stopPropagation()}><header><h2>Chơi thế nào?</h2><button className="icon-button" aria-label="Đóng trợ giúp" onClick={() => setHelp(false)}><X size={20}/></button></header><button onClick={() => {setHelp(false);setDeck('CHANCE');}}>Bộ thẻ Cơ hội →</button><button onClick={() => {setHelp(false);setDeck('COMMUNITY_CHEST');}}>Bộ thẻ Khí vận →</button><button onClick={() => {setHelp(false);setVideo(true);}}><Play size={18}/> Video hướng dẫn →</button><p>Gieo xúc xắc → di chuyển → mua đất hoặc đấu giá → kết thúc lượt. Bấm vào ô đất hoặc người chơi để xem tài sản.</p></section></div>,document.body)}
 {video && createPortal(<div className="detail-backdrop room-utility-backdrop" onClick={() => setVideo(false)}><section ref={popup} className="room-video" role="dialog" aria-modal="true" aria-label="Video hướng dẫn" onClick={e => e.stopPropagation()}><header><h2>Hướng dẫn Cờ Tỷ Phú</h2><button className="icon-button" aria-label="Đóng video" onClick={() => setVideo(false)}><X size={20}/></button></header><video controls playsInline preload="metadata" src={import.meta.env.BASE_URL+'tutorial/monopoly-guide.mp4'}><track kind="captions" src={import.meta.env.BASE_URL+'tutorial/monopoly-guide.vtt'} srcLang="vi" label="Tiếng Việt" default/></video></section></div>,document.body)}
 {deck && <CardDeckModal deck={deck} onClose={() => setDeck(null)}/>}
 {open && controlled === undefined && createPortal(<div className="game-chat-drawer"><RoomChatPanel onClose={() => toggle(false)}/></div>,document.body)}
 </>;
}
const propIcons = { EGG: Egg, BOMB: Bomb, ROCK: Mountain };
type Prop = keyof typeof propIcons;
type Effect = { id: number; sourceId: number; targetId: number; prop: string };
export function RoomSocialLayer() {
 const { online, gameState, throwProp } = useGameStore();
 const [menu, setMenu] = useState<{ targetId: number; x: number; y: number } | null>(null);
 const [effect, setEffect] = useState<Effect | null>(null);
 const [positions, setPositions] = useState<React.CSSProperties>();
 const menuRef = useRef<HTMLDivElement>(null);
 const cooldown = useRef(0);
 const sourceId = online.playerId ?? gameState.players[gameState.activePlayerIndex]?.id;
 useEffect(() => { if (online.thrown) setEffect(online.thrown); },[online.thrown]);
 useEffect(() => {
  const context = (e: MouseEvent) => { const name=(e.target as Element).closest('[data-player-name]'); const targetId=Number(name?.getAttribute('data-player-id')); if (!targetId || targetId === sourceId) return; e.preventDefault(); const box=name!.getBoundingClientRect(); setMenu({ targetId, x: Math.max(8,Math.min(window.innerWidth-220,e.clientX||box.left)), y: Math.max(8,Math.min(window.innerHeight-160,e.clientY||box.bottom)) }); requestAnimationFrame(()=>menuRef.current?.querySelector('button')?.focus()); };
  const close=(e: Event)=>{if(e instanceof KeyboardEvent ? e.key==='Escape' : !menuRef.current?.contains(e.target as Node))setMenu(null);};
  document.addEventListener('contextmenu',context);document.addEventListener('pointerdown',close);document.addEventListener('keydown',close);
  return()=>{document.removeEventListener('contextmenu',context);document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',close);};
 },[sourceId]);
 useEffect(()=>{
  if(!effect)return;
  const center=(id:number)=>{const anchor=[...document.querySelectorAll('[data-avatar-anchor]')].find(el=>Number(el.getAttribute('data-player-id'))===id && !el.closest('[inert]') && el.getBoundingClientRect().width>0);const b=anchor?.getBoundingClientRect();return{x:b?b.left+b.width/2:window.innerWidth/2,y:b?b.top+b.height/2:window.innerHeight/2};};
  const from=center(effect.sourceId),to=center(effect.targetId);
  setPositions({'--from-x':from.x+'px','--from-y':from.y+'px','--to-x':to.x+'px','--to-y':to.y+'px','--mid-x':(from.x+to.x)/2+'px','--mid-y':Math.max(25,Math.min(from.y,to.y)-120)+'px'} as React.CSSProperties);
  gameAudio.playSfx('uiClick');const timer=setTimeout(()=>setEffect(null),800);return()=>clearTimeout(timer);
 },[effect]);
 const send=(prop:Prop)=>{if(!menu||Date.now()<cooldown.current||!sourceId)return;cooldown.current=Date.now()+1500;if(online.roomCode)throwProp(menu.targetId,prop);else setEffect({id:Date.now(),sourceId,targetId:menu.targetId,prop});setMenu(null);};
 const Icon=effect?propIcons[effect.prop as Prop]:null;
 return createPortal(<>{menu&&<div ref={menuRef} className="throw-menu" role="menu" style={{left:menu.x,top:menu.y}}><strong>→ {gameState.players.find(p=>p.id===menu.targetId)?.name}</strong><div>{(Object.keys(propIcons) as Prop[]).map(prop=>{const ObjectIcon=propIcons[prop];return<button role="menuitem" key={prop} onClick={()=>send(prop)} disabled={!!online.roomCode&&!online.connected}><ObjectIcon size={27}/><small>{prop==='EGG'?'Trứng':prop==='BOMB'?'Bom':'Đá'}</small></button>;})}</div></div>}{effect&&Icon&&positions&&<div className="prop-flight" style={positions} key={effect.id} aria-hidden="true"><Icon size={36}/></div>}</>,document.body);
}
