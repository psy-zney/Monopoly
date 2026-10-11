import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../../core/types/game';
import { gameAudio } from '../../audio/audioManager';

export function GameEventLayer({ gameState }: { gameState: GameState }) {
  const previous = useRef(gameState);
  const [notice, setNotice] = useState<{ icon: string; message: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending=useRef<(()=>void)|null>(null);
  useEffect(()=>{
    const landed=()=>{pending.current?.();pending.current=null;};
    window.addEventListener('monopoly:landed',landed);
    return()=>window.removeEventListener('monopoly:landed',landed);
  },[]);
  useEffect(() => {
    const before = previous.current;
    previous.current = gameState;
    const latest = gameState.logs[0];
    // Initial snapshots and new games should not produce purchase/payment effects.
    if(!latest || before.roomCode!==gameState.roomCode || !before.logs.some(log=>gameState.logs.some(next=>next.id===log.id))){
      pending.current=null;setNotice(null);if(timer.current)clearTimeout(timer.current);return;
    }
    if(before.logs[0]?.id===latest.id)return;
    const built = Object.values(gameState.properties).some(property => property.houses > (before.properties[property.spaceIndex]?.houses ?? 0));
    const purchased = Object.values(gameState.properties).some(property => property.ownerId !== null && before.properties[property.spaceIndex]?.ownerId == null);
    const cashChanged = gameState.players.some(player => player.cash !== before.players.find(other => other.id === player.id)?.cash);
    const fortune = /cơ hội|khí vận/i.test(latest.message);
    const show=()=>{
      if (built) gameAudio.playSfx('build');
      else if (purchased) gameAudio.playSfx('purchase');
      else if (fortune) gameAudio.playSfx('fortune');
      else if (cashChanged) gameAudio.playSfx(latest.type === 'PAYMENT' ? 'coinLoss' : 'coinGain');
      if (built || purchased || fortune || cashChanged) {
        setNotice({ icon: built ? '🏡' : purchased ? '🔑' : fortune ? '🎴' : '🪙', message: latest.message });
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setNotice(null), 3200);
      }
    };
    const travelled=gameState.players.some(player=>player.position!==before.players.find(other=>other.id===player.id)?.position);
    if(travelled&&(fortune||cashChanged))pending.current=show;else show();
  }, [gameState]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return notice ? <div className="compact-event" role="status"><span aria-hidden="true">{notice.icon}</span><p>{notice.message}</p></div> : null;
}
