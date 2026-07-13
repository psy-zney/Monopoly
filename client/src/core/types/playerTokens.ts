export interface PlayerTokenPreset {
  id: number;           // 1 to 6
  name: string;         // e.g. "Người chơi 1 (Đỏ)"
  colorHex: string;     // Primary hex code
  bgClass: string;      // Tailwind background
  borderClass: string;  // Tailwind border
  glowClass: string;    // Tailwind shadow / glow
  shortLabel: string;   // "P1", "P2"...
}

export const SIX_PLAYER_PRESETS: PlayerTokenPreset[] = [
  {
    id: 1,
    name: 'Doraemon',
    colorHex: '#EF4444',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-200',
    glowClass: 'shadow-red-500/60',
    shortLabel: 'D'
  },
  {
    id: 2,
    name: 'Nobita',
    colorHex: '#3B82F6',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-200',
    glowClass: 'shadow-blue-500/60',
    shortLabel: 'N'
  },
  {
    id: 3,
    name: 'Shizuka',
    colorHex: '#EAB308',
    bgClass: 'bg-yellow-500',
    borderClass: 'border-yellow-100',
    glowClass: 'shadow-yellow-500/60',
    shortLabel: 'Sz'
  },
  {
    id: 4,
    name: 'Suneo',
    colorHex: '#10B981',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-200',
    glowClass: 'shadow-emerald-500/60',
    shortLabel: 'Sn'
  },
  {
    id: 5,
    name: 'Giant',
    colorHex: '#A855F7',
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-200',
    glowClass: 'shadow-purple-500/60',
    shortLabel: 'G'
  },
  {
    id: 6,
    name: 'Dorami',
    colorHex: '#F97316',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-200',
    glowClass: 'shadow-orange-500/60',
    shortLabel: 'Dm'
  }
];
