import React, { useState } from 'react';
import { Dices, Menu, Minus, Plus, RotateCcw, Settings, LogOut, Volume2, VolumeX, X, Target } from 'lucide-react';
import { gameAudio } from '../../audio/audioManager';

interface Props {
  roomCode: string;
  zoom: number;
  isAutoFollow: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleAutoFollow: () => void;
  onSettings: () => void;
  onLeave: () => void;
}

export const MobileGameHeader: React.FC<Props> = ({ roomCode, zoom, isAutoFollow, onZoomIn, onZoomOut, onResetZoom, onToggleAutoFollow, onSettings, onLeave }) => {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(gameAudio.isMuted);
  const run = (action: () => void) => { action(); setOpen(false); };
  return (
    <header className="mobile-game-header">
      <div className="mobile-header-brand"><Dices size={23} /><strong>Cờ Tỷ Phú</strong></div>
      <span className="mobile-room-code">Phòng <b>{roomCode}</b></span>
      <button type="button" className="mobile-menu-trigger" onClick={() => setOpen(!open)} aria-label={open ? 'Đóng menu' : 'Mở menu bàn chơi'} aria-expanded={open}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      {open && (
        <>
          <button type="button" className="mobile-menu-backdrop" onClick={() => setOpen(false)} aria-label="Đóng menu bàn chơi" />
          <div className="mobile-game-menu" role="dialog" aria-label="Menu bàn chơi">
            <strong>Góc nhìn bàn cờ</strong>
            <div className="mobile-camera-controls">
              <button type="button" onClick={onZoomOut} disabled={zoom <= .85} aria-label="Thu nhỏ bàn cờ"><Minus size={19} /></button>
              <button type="button" onClick={onResetZoom} aria-label="Đặt lại góc nhìn"><RotateCcw size={15} />{Math.round(zoom * 100)}%</button>
              <button type="button" onClick={onZoomIn} disabled={zoom >= 1.85} aria-label="Phóng to bàn cờ"><Plus size={19} /></button>
            </div>
            <button type="button" onClick={onToggleAutoFollow} aria-pressed={isAutoFollow}><Target size={18} />Bám theo quân cờ <span>{isAutoFollow ? 'Bật' : 'Tắt'}</span></button>
            <button type="button" onClick={() => { gameAudio.toggleMuted(); setMuted(gameAudio.isMuted); }}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}{muted ? 'Bật âm thanh' : 'Tắt âm thanh'}</button>
            <button type="button" onClick={() => run(onSettings)}><Settings size={18} />Cài đặt phòng</button>
            <button type="button" onClick={() => run(onLeave)}><LogOut size={18} />Ván mới / rời phòng</button>
          </div>
        </>
      )}
    </header>
  );
};
