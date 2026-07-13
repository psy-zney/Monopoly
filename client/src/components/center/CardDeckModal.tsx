import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowDownToLine, ArrowRight, Coins, DoorOpen, Hammer, HandCoins, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CARD_DECKS, CardDeckKind, CardEffectKind } from '../../core/constants/cardDeckData';

interface CardDeckModalProps {
  deck: CardDeckKind;
  onClose: () => void;
}

const EFFECT_ICONS: Record<CardEffectKind, LucideIcon> = {
  MOVE: ArrowRight,
  RECEIVE: Coins,
  PAY: ArrowDownToLine,
  PLAYERS: HandCoins,
  REPAIRS: Hammer,
  JAIL: DoorOpen,
  KEEP: DoorOpen,
};

export const CardDeckModal: React.FC<CardDeckModalProps> = ({ deck, onClose }) => {
  const isCommunity = deck === 'COMMUNITY_CHEST';
  const cards = CARD_DECKS[deck];
  const accent = isCommunity ? '#118b72' : '#d62f35';
  const title = isCommunity ? 'Khí Vận' : 'Cơ Hội';

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-3" onMouseDown={onClose}>
      <section
        aria-label={`Bộ thẻ ${title}`}
        aria-modal="true"
        role="dialog"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden bg-[#fffdf7] shadow-2xl"
        style={{ border: `3px solid ${accent}`, borderRadius: 8 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 px-4 py-3 text-white" style={{ background: accent }}>
          <div>
            <h2 className="text-xl font-black uppercase">{title}</h2>
            <p className="text-xs font-bold text-white/80">16 thẻ · thực hiện ngay khi rút</p>
          </div>
          <button type="button" aria-label="Đóng" title="Đóng" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md hover:bg-white/15">
            <X size={20} />
          </button>
        </header>

        <div className="grid grid-cols-1 gap-3 overflow-y-auto p-4 sm:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = EFFECT_ICONS[card.effectKind];
            return (
              <article key={card.id} className="relative min-h-[132px] bg-white p-3 shadow-sm" style={{ border: `1px solid ${accent}55`, borderLeft: `5px solid ${accent}`, borderRadius: 6 }}>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Thẻ {String(index + 1).padStart(2, '0')}</span>
                    <h3 className="text-sm font-black leading-tight text-slate-900">{card.title}</h3>
                  </div>
                  <div className="grid h-8 min-w-8 place-items-center rounded-md text-white" style={{ background: accent }}><Icon size={16} /></div>
                </div>
                <p className="pr-14 text-xs font-semibold leading-relaxed text-slate-600">{card.description}</p>
                <strong className="absolute bottom-3 right-3 text-xs" style={{ color: accent }}>{card.effect}</strong>
              </article>
            );
          })}
        </div>
      </section>
    </div>,
    document.body,
  );
};
