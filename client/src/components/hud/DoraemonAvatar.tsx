import React from 'react';

export interface DoraemonAvatarProps {
  playerId: number;
  size?: number;
}

export const DoraemonAvatar: React.FC<DoraemonAvatarProps> = ({ playerId, size = 56 }) => {
  // Return a custom SVG avatar representing Doraemon characters
  switch (playerId) {
    case 1: // Doraemon
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
          {/* Blue head */}
          <circle cx="50" cy="50" r="46" fill="#0284c7" />
          {/* White face */}
          <circle cx="50" cy="58" r="34" fill="#ffffff" />
          {/* Eyes */}
          <ellipse cx="40" cy="32" rx="8" ry="12" fill="#ffffff" stroke="#000" strokeWidth="2" />
          <ellipse cx="60" cy="32" rx="8" ry="12" fill="#ffffff" stroke="#000" strokeWidth="2" />
          {/* Pupils */}
          <circle cx="42" cy="34" r="2.5" fill="#000" />
          <circle cx="58" cy="34" r="2.5" fill="#000" />
          {/* Nose */}
          <circle cx="50" cy="44" r="6" fill="#dc2626" />
          <circle cx="48" cy="42" r="2" fill="#ffffff" />
          {/* Smile line */}
          <path d="M 50 50 L 50 74" stroke="#000" strokeWidth="2" />
          <path d="M 32 64 Q 50 78 68 64" fill="none" stroke="#000" strokeWidth="2" />
          {/* Whiskers */}
          <line x1="22" y1="46" x2="36" y2="49" stroke="#000" strokeWidth="2" />
          <line x1="20" y1="56" x2="36" y2="56" stroke="#000" strokeWidth="2" />
          <line x1="22" y1="66" x2="36" y2="63" stroke="#000" strokeWidth="2" />
          <line x1="78" y1="46" x2="64" y2="49" stroke="#000" strokeWidth="2" />
          <line x1="80" y1="56" x2="64" y2="56" stroke="#000" strokeWidth="2" />
          <line x1="78" y1="66" x2="64" y2="63" stroke="#000" strokeWidth="2" />
        </svg>
      );
    case 2: // Nobita
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
          {/* Skin background */}
          <circle cx="50" cy="50" r="46" fill="#fed7aa" />
          {/* Black hair */}
          <path d="M 12 40 Q 50 10 88 40 Q 50 30 12 40 Z" fill="#1e293b" />
          <path d="M 12 40 L 20 22 L 80 22 L 88 40 Z" fill="#1e293b" />
          {/* Round glasses */}
          <circle cx="36" cy="50" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
          <circle cx="64" cy="50" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
          <line x1="48" y1="50" x2="52" y2="50" stroke="#1e293b" strokeWidth="3" />
          {/* Eyes inside glasses */}
          <circle cx="36" cy="50" r="2.5" fill="#000" />
          <circle cx="64" cy="50" r="2.5" fill="#000" />
          {/* Smile */}
          <path d="M 42 74 Q 50 82 58 74" fill="none" stroke="#1e293b" strokeWidth="2.5" />
        </svg>
      );
    case 3: // Shizuka
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
          {/* Pinkish skin background */}
          <circle cx="50" cy="50" r="46" fill="#ffe4e6" />
          {/* Brown hair & bangs */}
          <path d="M 14 42 C 30 20, 70 20, 86 42 C 70 30, 30 30, 14 42 Z" fill="#78350f" />
          {/* Pigtails */}
          <ellipse cx="14" cy="62" rx="8" ry="16" fill="#78350f" />
          <ellipse cx="86" cy="62" rx="8" ry="16" fill="#78350f" />
          {/* Red hair ribbons */}
          <circle cx="16" cy="48" r="4.5" fill="#e11d48" />
          <circle cx="84" cy="48" r="4.5" fill="#e11d48" />
          {/* Sweet eyes */}
          <ellipse cx="38" cy="50" rx="3.5" ry="5" fill="#000" />
          <ellipse cx="62" cy="50" rx="3.5" ry="5" fill="#000" />
          <path d="M 34 42 Q 38 40 42 43" fill="none" stroke="#000" strokeWidth="1.5" />
          <path d="M 66 42 Q 62 40 58 43" fill="none" stroke="#000" strokeWidth="1.5" />
          {/* Smile */}
          <path d="M 45 68 Q 50 74 55 68" fill="none" stroke="#78350f" strokeWidth="2" />
        </svg>
      );
    case 4: // Suneo
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
          {/* Skin background */}
          <circle cx="50" cy="50" r="46" fill="#ffedd5" />
          {/* Pointy spiky hair pointing right */}
          <path d="M 10 38 Q 60 12 90 26 Q 50 32 10 38" fill="#475569" />
          <path d="M 12 36 L 40 22 L 70 24 L 90 26 L 60 44 Z" fill="#475569" />
          {/* Pointy nose and mouth */}
          <path d="M 42 58 L 28 62 L 40 66 Z" fill="#ffedd5" stroke="#475569" strokeWidth="1" />
          {/* Eyes */}
          <ellipse cx="44" cy="48" rx="4" ry="6" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
          <ellipse cx="68" cy="48" rx="4" ry="6" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
          <circle cx="45" cy="48" r="1.8" fill="#000" />
          <circle cx="67" cy="48" r="1.8" fill="#000" />
          {/* Smug smile */}
          <path d="M 44 68 Q 58 72 68 63" fill="none" stroke="#475569" strokeWidth="2" />
        </svg>
      );
    case 5: // Giant (Chaien)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
          {/* Skin background */}
          <circle cx="50" cy="50" r="46" fill="#ffdec2" />
          {/* Spiky hair */}
          <path d="M 14 36 C 30 18, 70 18, 86 36 C 80 28, 20 28, 14 36 Z" fill="#1e293b" />
          <path d="M 14 36 L 24 24 L 38 22 L 50 25 L 64 22 L 78 24 L 86 36 L 72 42 L 50 38 L 28 42 Z" fill="#1e293b" />
          {/* Angry eyebrows */}
          <path d="M 32 44 L 44 47" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 68 44 L 56 47" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          {/* Small eyes */}
          <circle cx="38" cy="52" r="3" fill="#000" />
          <circle cx="62" cy="52" r="3" fill="#000" />
          {/* Large nose */}
          <ellipse cx="50" cy="60" rx="8" ry="5" fill="#fbcfe8" stroke="#1e293b" strokeWidth="1.5" />
          {/* Open mouth */}
          <path d="M 34 72 Q 50 86 66 72 Z" fill="#dc2626" stroke="#1e293b" strokeWidth="2" />
        </svg>
      );
    case 6: // Dorami
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
          {/* Yellow head */}
          <circle cx="50" cy="50" r="46" fill="#eab308" />
          {/* White face */}
          <circle cx="50" cy="58" r="34" fill="#ffffff" />
          {/* Large round eyes */}
          <ellipse cx="38" cy="32" rx="9" ry="12" fill="#ffffff" stroke="#000" strokeWidth="2" />
          <ellipse cx="62" cy="32" rx="9" ry="12" fill="#ffffff" stroke="#000" strokeWidth="2" />
          {/* Eyelashes */}
          <path d="M 28 26 Q 30 20 36 22" fill="none" stroke="#000" strokeWidth="2" />
          <path d="M 72 26 Q 70 20 64 22" fill="none" stroke="#000" strokeWidth="2" />
          <circle cx="40" cy="34" r="3" fill="#000" />
          <circle cx="60" cy="34" r="3" fill="#000" />
          {/* Red nose */}
          <circle cx="50" cy="44" r="5" fill="#dc2626" />
          {/* Smile and pink cheeks */}
          <path d="M 50 49 L 50 70" stroke="#000" strokeWidth="1.5" />
          <path d="M 36 62 Q 50 74 64 62" fill="none" stroke="#000" strokeWidth="2" />
          <circle cx="28" cy="56" r="4" fill="#f43f5e" opacity="0.6" />
          <circle cx="72" cy="56" r="4" fill="#f43f5e" opacity="0.6" />
          {/* Large red ribbon bow at top */}
          <path d="M 24 16 C 30 6, 44 14, 50 20 C 56 14, 70 6, 76 16 C 72 24, 28 24, 24 16 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
          <circle cx="50" cy="18" r="4.5" fill="#fef08a" />
        </svg>
      );
    default:
      return null;
  }
};
