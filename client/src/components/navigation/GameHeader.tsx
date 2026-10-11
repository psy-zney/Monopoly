import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, LogOut, Users, ZoomIn, ZoomOut, Focus, Scan, Gift, Smile } from 'lucide-react';
import { RoomTools } from '../room/RoomTools';
import { GameBrand } from '../ui/GameBrand';
import { SoundControl } from './SoundControl';
import { CardDeckKind } from '../../core/constants/cardDeckData';
import { MIN_ZOOM, MAX_ZOOM } from '../board/island/useBoardCamera';

interface Props {
  roomCode: string;
  online: boolean;
  connected: boolean;
  zoom: number;
  following: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleFollow: () => void;
  onLobby: () => void;
  onPlayers: () => void;
  onLeave: () => void;
  onDeck: (deck: CardDeckKind) => void;
  onCharacters: () => void;
}

export function GameHeader(props: Props) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) setOpen(false); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', key); };
  }, []);
  const action = (fn: () => void) => { setOpen(false); fn(); };
  return <header className="game-header">
    <GameBrand />
    <div className="room-status"><i className={props.online && !props.connected ? 'is-offline' : ''} /><span>{props.online ? props.connected ? 'Phòng online' : 'Đang kết nối lại' : 'Chơi cùng máy'}<b>{props.online ? props.roomCode : 'Bàn của bạn'}</b></span></div>
    <SoundControl /><RoomTools/>
    <button type="button" className="icon-button character-header-button" aria-label="Kho nhân vật" onClick={props.onCharacters}><Smile size={20}/></button>
    <div className="game-menu-wrap" ref={menu}>
      <button type="button" className="icon-button" aria-label="Menu bàn chơi" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      {open && <nav className="game-menu" aria-label="Tùy chọn bàn chơi">
        <strong>Bàn chơi</strong>
        <div className="camera-options">
          <button type="button" onClick={props.onZoomOut} disabled={props.zoom <= MIN_ZOOM} aria-label="Thu nhỏ bàn cờ"><ZoomOut size={18} /></button>
          <button type="button" onClick={props.onResetZoom} aria-label="Vừa màn hình"><Scan size={18} />{Math.round(props.zoom * 100)}%</button>
          <button type="button" onClick={props.onZoomIn} disabled={props.zoom >= MAX_ZOOM} aria-label="Phóng to bàn cờ"><ZoomIn size={18} /></button>
        </div>
        <button type="button" onClick={props.onToggleFollow}><Focus size={18} />Theo quân cờ <span>{props.following ? 'Bật' : 'Tắt'}</span></button>
        <button type="button" onClick={() => action(() => props.onDeck('CHANCE'))}><Gift size={18} />Bộ thẻ Cơ hội</button>
        <button type="button" onClick={() => action(() => props.onDeck('COMMUNITY_CHEST'))}><Gift size={18} />Bộ thẻ Khí vận</button>
        <button type="button" onClick={() => action(props.onPlayers)}><Users size={18} />Người chơi & tài sản</button>
        <button type="button" onClick={() => action(props.onCharacters)}><Smile size={18} />Kho nhân vật</button>
        <button type="button" onClick={() => action(props.onLobby)}><Users size={18} />Sảnh & thông tin phòng</button>
        <button type="button" onClick={() => action(props.onLeave)}><LogOut size={18} />Rời bàn chơi</button>
      </nav>}
    </div>
  </header>;
}
