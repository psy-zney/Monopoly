import React from 'react';
import { PlayerState, PropertyOwnershipState } from '../../core/types/game';
import { CurrencyType, formatCurrency } from '../../core/types/currency';
import { PlayerAvatar } from './PlayerAvatar';
import { Building2, ChevronRight } from 'lucide-react';

interface Props {
  players: PlayerState[];
  activePlayerId?: number;
  properties: Record<number, PropertyOwnershipState>;
  currency: CurrencyType;
  onSelect: (player: PlayerState) => void;
}

export function PlayerRoster({ players, activePlayerId, properties, currency, onSelect }: Props) {
  return <aside className="player-roster" aria-label="Người chơi và lượt hiện tại" style={{ '--player-count': players.length || 1 } as React.CSSProperties}>
    <div className="roster-heading"><span>Người chơi</span><b>{players.length}</b></div>
    <div className="roster-seats">
      {players.map(player => {
        const active = player.id === activePlayerId;
        const count = Object.values(properties).filter(property => property.ownerId === player.id).length;
        return <button type="button" key={player.id} className={`roster-seat ${active ? 'is-active' : ''} ${player.isBankrupt ? 'is-bankrupt' : ''}`} onClick={() => onSelect(player)} aria-label={`${player.name}${active ? ', đang lượt' : ''}, ${formatCurrency(player.cash, currency)}, xem tài sản`}>
          <PlayerAvatar playerId={player.id} size={active ? 70 : 50} showGlow={active}/>
          <div className="roster-copy"><strong data-player-name data-player-id={player.id}>{player.name}</strong><span>{formatCurrency(player.cash, currency)}</span><small><Building2 size={12} />{count} tài sản{player.inJail ? ' · Đang ở tù' : player.isBankrupt ? ' · Phá sản' : ''}</small></div>
          {active ? <span className="roster-turn">Đang lượt</span> : <ChevronRight className="roster-arrow" size={15} />}
        </button>;
      })}
    </div>
    <p className="roster-hint">Chọn người chơi để xem tài sản.</p>
  </aside>;
}
