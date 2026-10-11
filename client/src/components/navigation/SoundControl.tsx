import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, X, Play } from 'lucide-react';
import { gameAudio } from '../../audio/audioManager';
export const SoundControl: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(gameAudio.settings);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => gameAudio.subscribe(() => setSettings(gameAudio.settings)), []);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <div className="sound-control" ref={container}>
    <button type="button" className={`icon-button ${settings.muted ? 'sound-muted' : ''}`} aria-label={`Âm thanh ${settings.muted ? 'đang tắt' : 'đang bật'}`} aria-expanded={open} onClick={() => setOpen(!open)}>{settings.muted ? <VolumeX size={19}/> : <Volume2 size={19}/>}</button>
    {open && <section className="sound-popover" aria-label="Cài đặt âm thanh"><header><strong>Âm thanh</strong><button className="icon-button" aria-label="Đóng âm thanh" onClick={()=>setOpen(false)}><X size={17}/></button></header>
      <label className="sound-check"><span>Bật âm thanh</span><input type="checkbox" checked={!settings.muted} onChange={e=>gameAudio.setMuted(!e.target.checked)}/></label>
      <label className="sound-slider"><span>Âm lượng hiệu ứng <b>{Math.round(settings.volume*100)}%</b></span><input aria-label="Âm lượng hiệu ứng" type="range" min="0" max="1" step=".05" value={settings.volume} onChange={e=>gameAudio.setVolume(Number(e.target.value))}/></label>
      <label className="sound-check"><span>Nhạc nền nhẹ</span><input type="checkbox" checked={settings.music} onChange={e=>gameAudio.setMusic(e.target.checked)}/></label>
      <label className="sound-check"><span>Gió và tiếng chim</span><input type="checkbox" checked={settings.ambience} onChange={e=>gameAudio.setAmbience(e.target.checked)}/></label>
      <button className="quiet-button" onClick={()=>{gameAudio.setMuted(false); gameAudio.playSfx('purchase');}}><Play size={15}/>Nghe thử hiệu ứng</button>
    </section>}
  </div>;
};
