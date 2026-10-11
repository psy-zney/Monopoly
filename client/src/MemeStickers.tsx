import { useEffect, useRef, useState } from 'react';
import { parseSticker, stickers, type Sticker } from './stickers';
import './memeStickers.css';

function StickerImage({ sticker, lang, preview = false }: { sticker: Sticker; lang: 'vi' | 'en'; preview?: boolean }) {
  const [poster, setPoster] = useState('');
  const [playing, setPlaying] = useState(() => !preview && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [failed, setFailed] = useState(false);
  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const label = sticker[lang];
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { reduced.current = query.matches; if (query.matches) setPlaying(false); };
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (!playing || !poster) return;
    const timer = window.setTimeout(() => setPlaying(false), 6000);
    return () => window.clearTimeout(timer);
  }, [playing, poster]);
  const picture = <img src={!playing && poster ? poster : `${import.meta.env.BASE_URL}stickers/${sticker.file}`} alt={label} width={112} height={96} loading="lazy" onError={() => setFailed(true)} onLoad={event => {
    if (poster) return;
    const image = event.currentTarget;
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (context) { context.drawImage(image, 0, 0); setPoster(canvas.toDataURL('image/png')); }
  }}/>;
  if (preview) return <span className="meme-sticker-preview">{failed ? label : picture}</span>;
  return <div className="meme-sticker-message">{failed ? <span>{label}</span> : picture}{!failed && <button type="button" onClick={() => setPlaying(current => !current)} aria-label={`${playing ? (lang === 'vi' ? 'Dừng' : 'Pause') : (lang === 'vi' ? 'Phát lại' : 'Replay')} GIF: ${label}`}>{playing ? 'Ⅱ' : '▶'}</button>}</div>;
}

export function ChatMessage({ text, lang = 'vi' }: { text: string; lang?: 'vi' | 'en' }) {
  const sticker = parseSticker(text);
  return sticker ? <StickerImage sticker={sticker} lang={lang}/> : <p dir="auto">{text}</p>;
}

export function StickerPicker({ lang = 'vi', disabled, onSend }: { lang?: 'vi' | 'en'; disabled: boolean; onSend: (sticker: Sticker) => void }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return <div className="meme-sticker-picker" onKeyDown={event => { if (event.key === 'Escape' && open) { event.stopPropagation(); setOpen(false); trigger.current?.focus(); } }}>
    <button ref={trigger} type="button" className="meme-sticker-toggle" aria-expanded={open} onClick={() => setOpen(current => !current)}>☺ {lang === 'vi' ? 'Nhãn dán' : 'Stickers'}</button>
    {open && <div className="meme-sticker-tray" role="group" aria-label={lang === 'vi' ? 'Nhãn dán meme' : 'Meme stickers'}>
      <div className="meme-sticker-grid">{stickers.map(sticker => <button key={sticker.id} type="button" disabled={disabled} aria-label={`${lang === 'vi' ? 'Gửi nhãn dán' : 'Send sticker'} ${sticker[lang]}`} onClick={() => { onSend(sticker); setOpen(false); trigger.current?.focus(); }}><StickerImage sticker={sticker} lang={lang} preview/><span>{sticker[lang]}</span></button>)}</div>
      <small>GIF từ <a href="https://tenor.com" target="_blank" rel="noreferrer">Tenor</a> · <a href={stickers[4].source} target="_blank" rel="noreferrer">bunny_is_moving</a></small>
    </div>}
  </div>;
}
