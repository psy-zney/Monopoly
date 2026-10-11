import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { LogEntry } from '../../core/types/game';

export function GameLogModal({ logs, onClose }: { logs: LogEntry[]; onClose: () => void }) {
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [onClose]);
  return <div className="detail-backdrop" onMouseDown={onClose}><section className="game-log-modal" role="dialog" aria-modal="true" aria-label="Nhật ký ván đấu" onMouseDown={event => event.stopPropagation()}>
    <header><h2>Nhật ký ván đấu</h2><button type="button" className="icon-button" aria-label="Đóng nhật ký" onClick={onClose}><X size={20} /></button></header>
    <div className="log-entries">{logs.map(log => <p key={log.id}><time>{new Date(log.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</time>{log.message}</p>)}</div>
  </section></div>;
}
