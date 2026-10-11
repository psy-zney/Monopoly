
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Copy, Plus, X, Globe, Laptop, Smile } from 'lucide-react';
import { PlayerState } from '../../core/types/game';
import { SIX_PLAYER_PRESETS } from '../../core/types/playerTokens';
import { PlayerAvatar } from '../hud/PlayerAvatar';
import { useGameStore } from '../../store/useGameStore';
import { CURRENCY_OPTIONS, STARTING_CASH_OPTIONS, CurrencyType } from '../../core/types/currency';
import { GameBrand } from '../ui/GameBrand';
import { SoundControl } from '../navigation/SoundControl';
import { RoomTools, RoomChatPanel } from '../room/RoomTools';
import { gameAudio } from '../../audio/audioManager';
const IslandPreview = lazy(() => import('../board/island/IslandPreview'));
const CharacterLibrary = lazy(() => import('./CharacterLibrary'));
export interface LobbyModalProps { isOpen:boolean; onClose:()=>void; players:PlayerState[]; roomCode:string; onStartNewGame:(count:number,name:string,avatar:number,cash:number,currency:CurrencyType,code:string)=>void; onUpdatePlayerName:(name:string)=>void; currentPlayerName:string; }
type Step='menu'|'create'|'join'|'offline';
export function LobbyModal({isOpen,onClose,players,onStartNewGame,onUpdatePlayerName,currentPlayerName}:LobbyModalProps){
 const {gameState,online,createOnlineRoom,joinOnlineRoom,leaveOnlineRoom,setReady,startOnlineRoom}=useGameStore();
 const invite=new URLSearchParams(window.location.search).get('room')?.replace(/\D/g,'').slice(0,6)||'';
 const [step,setStep]=useState<Step>(invite?'join':'menu');
 const [name,setName]=useState(currentPlayerName||'');
 const [avatar,setAvatar]=useState(1);
 const [count,setCount]=useState(Math.max(2,players.length));
 const [currency,setCurrency]=useState<CurrencyType>(gameState.currency);
 const [cash,setCash]=useState(gameState.startingCash);
 const [code,setCode]=useState(invite);
 const [pending,setPending]=useState(false);
 const [notice,setNotice]=useState('');
 const [chatOpen,setChatOpen]=useState(false);
 const [charactersOpen,setCharactersOpen]=useState(false);
 useEffect(()=>{if(online.roomCode||online.error)setPending(false);},[online.roomCode,online.error]);
 useEffect(()=>{if(!pending)return;const timer=setTimeout(()=>{setPending(false);setNotice('Chưa kết nối được. Hãy thử lại.');},12000);return()=>clearTimeout(timer);},[pending]);
 useEffect(()=>{if(online.roomCode&&online.status==='PLAYING')onClose();},[online.status,online.roomCode]);
 if(!isOpen)return null;
 const self=online.players.find(p=>p.playerId===online.playerId);
 const host=online.hostId===online.playerId;
 const joined=online.players.filter(p=>p.connected);
 const canStart=joined.length>=2&&joined.every(p=>p.ready);
 const move=(next:Step)=>{setNotice('');setStep(next);};
 const copy=async(link:boolean)=>{try{await navigator.clipboard.writeText(link?`${location.origin}${location.pathname}?room=${online.roomCode}`:online.roomCode!);setNotice(link?'Đã copy link phòng':'Đã copy mã phòng');}catch{setNotice('Hãy chọn mã phòng để sao chép.');}};
 const submit=(e:React.FormEvent)=>{e.preventDefault();const clean=name.trim()||SIX_PLAYER_PRESETS.find(p=>p.id===avatar)!.name;onUpdatePlayerName(clean);setNotice('');if(step==='offline'){onStartNewGame(count,clean,avatar,cash,currency,'LOCAL');gameAudio.playSfx('roomReady');onClose();}else{setPending(true);if(step==='create')createOnlineRoom(clean,avatar,count);else joinOnlineRoom(code,clean,avatar);}};
 return <div className="lounge seat-lounge" role="dialog" aria-modal="true" aria-label="Sảnh Cờ Tỷ Phú">
 <header className="lounge-header"><GameBrand/><div>{online.roomCode&&<span className="room-ping">{online.pingMs??'—'} ms</span>}<SoundControl/><RoomTools chatOpen={chatOpen} onChatChange={setChatOpen}/><button type="button" className="icon-button" aria-label="Kho nhân vật" onClick={()=>setCharactersOpen(true)}><Smile size={20}/></button>{(!online.roomCode||online.status==='PLAYING')&&<button className="icon-button" aria-label="Trở về bàn chơi" onClick={onClose}><X size={20}/></button>}</div></header>
 {online.roomCode?<div className={`room-wait-layout ${chatOpen?'has-chat':''}`}><section className="seat-lobby">
 <div className="lounge-heading"><button className="lounge-back" onClick={()=>{leaveOnlineRoom();setChatOpen(false);move('menu');}}><ArrowLeft size={17}/>Phòng chờ</button><span>{joined.length}/{online.maxPlayers} người chơi</span></div>
 <div className="lounge-room-code"><span>Mã phòng</span><strong>{online.roomCode}</strong><button className="copy-number" aria-label="Copy mã phòng" onClick={()=>void copy(false)}><Copy size={17}/></button><button className="copy-room-link" onClick={()=>void copy(true)}>Copy link ↗</button></div>
 <div className="lounge-seats">{Array.from({length:online.maxPlayers},(_,index)=>{const player=joined[index];return<div key={player?.playerId??index} className={`lounge-seat ${player?.ready?'is-ready':''}`}>{player?<><div className="lounge-avatar"><PlayerAvatar playerId={player.playerId} size={80}/>{player.ready&&<span className="ready-check">✓</span>}</div><span className="lounge-name" data-player-name data-player-id={player.playerId} tabIndex={0}>{player.name}{player.playerId===online.playerId&&<small> · bạn</small>}</span><small className="seat-state">{player.playerId===online.hostId?'Chủ phòng':player.ready?'Sẵn sàng':'Chưa sẵn sàng'}</small></>:<><button className="vacant-avatar" aria-label="Mời bạn vào ghế trống" onClick={()=>void copy(true)}>+</button><span className="lounge-name">Mời bạn</span><small className="seat-state">Ghế trống</small></>}</div>;})}{online.maxPlayers<6&&<div className="lounge-launch"><button className={`primary-button ${self?.ready?'is-ready':''}`} disabled={!online.connected} onClick={()=>setReady(!self?.ready)}>{self?.ready?'✓ Đã sẵn sàng':'Sẵn sàng'}</button>{host&&<button className="start-button" disabled={!canStart||!online.connected} onClick={startOnlineRoom}>Bắt đầu →</button>}<small>{host?'Từ 2 người · tất cả sẵn sàng':'Chờ chủ phòng bắt đầu'}</small></div>}</div>
 <div className="lounge-bottom"><span>Online · {online.maxPlayers} ghế</span>{online.maxPlayers===6&&<div className="six-seat-launch"><button className="primary-button" onClick={()=>setReady(!self?.ready)}>{self?.ready?'✓ Sẵn sàng':'Sẵn sàng'}</button>{host&&<button className="start-button" disabled={!canStart||!online.connected} onClick={startOnlineRoom}>Bắt đầu →</button>}</div>}<small>Chuột phải vào tên để ném đồ</small></div><p className="lounge-copy-notice" role="status">{notice||online.error||''}</p>
 </section>{chatOpen&&<RoomChatPanel onClose={()=>setChatOpen(false)}/>}</div>:<main className="simple-entry"><section className="entry-world"><div className="entry-world-heading"><span>SÀI GÒN · GARDEN CITY</span><h2>Thành phố trong mây</h2><p>Mua đất, xây nhà và cùng bạn bè trở thành tỷ phú.</p></div><div className="entry-island-preview"><Suspense fallback={<div className="island-loading">Đang dựng thành phố…</div>}><IslandPreview characterId={avatar}/></Suspense></div><div className="entry-world-footer"><button type="button" className="character-library-link" onClick={()=>setCharactersOpen(true)}>Kho nhân vật <ArrowRight size={15}/></button><span>40 ô đất · 6 người bạn</span></div></section><section className="entry-workflow">
 <div className="entry-top">{step==='menu'?<span>CỜ TỶ PHÚ · 2–6 NGƯỜI</span>:<button onClick={()=>move('menu')} disabled={pending}><ArrowLeft size={16}/>Quay lại</button>}</div>
 <h1>{step==='menu'?'Chơi cùng bạn':step==='create'?'Tạo phòng':step==='join'?'Vào phòng':'Chơi trên máy này'}</h1>
 {step==='menu'?<div className="simple-choices"><button onClick={()=>move('create')}><Plus size={23}/><span>Tạo phòng<small>Mời bạn bè chơi online</small></span><ArrowRight size={18}/></button><button onClick={()=>move('join')}><Globe size={23}/><span>Vào phòng<small>Nhập mã phòng từ bạn bè</small></span><ArrowRight size={18}/></button><button onClick={()=>move('offline')}><Laptop size={23}/><span>Chơi cùng máy<small>Thay phiên trên một màn hình</small></span><ArrowRight size={18}/></button></div>:<form className="room-form" onSubmit={submit}>
 <label>Tên của bạn<input value={name} maxLength={20} onChange={e=>setName(e.target.value)} autoComplete="nickname" placeholder="Nhập tên của bạn" disabled={pending}/></label>
 <fieldset className="avatar-picker"><legend>Chọn nhân vật</legend><div>{SIX_PLAYER_PRESETS.map(p=><button key={p.id} type="button" aria-label={`Chọn ${p.name}`} aria-pressed={avatar===p.id} className={avatar===p.id?'is-selected':''} onClick={()=>setAvatar(p.id)} disabled={pending}><PlayerAvatar playerId={p.id} size={56}/><small>{p.name}</small></button>)}</div></fieldset>
 {step==='join'?<label>Mã phòng<input value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000" inputMode="numeric" maxLength={6} required disabled={pending}/></label>:<fieldset className="count-picker"><legend>{step==='create'?'Số ghế':'Số người chơi'}</legend><div>{[2,3,4,5,6].map(n=><button type="button" key={n} aria-label={`${n} người`} aria-pressed={count===n} className={count===n?'is-selected':''} onClick={()=>setCount(n)}>{n}</button>)}</div></fieldset>}
 {step==='offline'&&<details className="entry-options"><summary>Tiền tệ & vốn khởi đầu</summary><label>Tiền tệ<select value={currency} onChange={e=>setCurrency(e.target.value as CurrencyType)}>{CURRENCY_OPTIONS.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label><label>Vốn khởi đầu<select value={cash} onChange={e=>setCash(Number(e.target.value))}>{STARTING_CASH_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></label></details>}
 {(notice||online.error)&&<p className="form-error" role="alert">{notice||online.error}</p>}
 <button type="submit" className="primary-button entry-submit" disabled={pending||step==='join'&&code.length!==6}>{pending?'Đang kết nối…':step==='create'?'Tạo phòng':step==='join'?'Vào phòng':'Bắt đầu'}<ArrowRight size={18}/></button>
 </form>}</section></main>}
 {charactersOpen&&<Suspense fallback={null}><CharacterLibrary initialId={avatar} onClose={()=>setCharactersOpen(false)} onSelect={setAvatar}/></Suspense>}
 </div>;
}
