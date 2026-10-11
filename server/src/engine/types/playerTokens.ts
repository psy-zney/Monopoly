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
    name: 'Mèo Chuối',
    colorHex: '#e7bc53',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-200',
    glowClass: 'shadow-red-500/60',
    shortLabel: 'P1'
  },
  {
    id: 2,
    name: 'Vịt Ngơ',
    colorHex: '#65b8c0',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-200',
    glowClass: 'shadow-blue-500/60',
    shortLabel: 'P2'
  },
  {
    id: 3,
    name: 'Vịt Cà Khịa',
    colorHex: '#e9946b',
    bgClass: 'bg-yellow-500',
    borderClass: 'border-yellow-100',
    glowClass: 'shadow-yellow-500/60',
    shortLabel: 'P3'
  },
  {
    id: 4,
    name: 'Thỏ Cầu Vồng',
    colorHex: '#ba9dd8',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-200',
    glowClass: 'shadow-emerald-500/60',
    shortLabel: 'P4'
  },
  {
    id: 5,
    name: 'Mèo Phi Hành Gia',
    colorHex: '#729fd5',
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-200',
    glowClass: 'shadow-purple-500/60',
    shortLabel: 'P5'
  },
  {
    id: 6,
    name: 'Gấu Trúc',
    colorHex: '#ce8ea6',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-200',
    glowClass: 'shadow-orange-500/60',
    shortLabel: 'P6'
  }
];
