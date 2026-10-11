export interface PlayerTokenPreset {
  id: number;           // 1 to 6
  name: string;         // e.g. "Cáo Lửa", "Sư Tử Vàng"
  icon: string;         // Matching animal character: 🦊, 🦁, 🐯, 🐉, 🦅, 🐼
  colorHex: string;     // Primary hex code
  bgGradient: string;   // CSS gradient for avatar background
  borderColor: string;  // Border color
  glowClass: string;    // Glow effect
  shortLabel: string;   // "CL", "ST"...
}

export const SIX_PLAYER_PRESETS: PlayerTokenPreset[] = [
  {
    id: 1,
    name: 'Mèo Chuối',
    icon: '🐱',
    colorHex: '#e7bc53',
    bgGradient: 'linear-gradient(135deg, #f1d47b, #cfa246)',
    borderColor: '#FCA5A5',
    glowClass: 'shadow-red-500/60',
    shortLabel: 'CL',
  },
  {
    id: 2,
    name: 'Vịt Ngơ',
    icon: '🦆',
    colorHex: '#65b8c0',
    bgGradient: 'linear-gradient(135deg, #9dd4d1, #479ba9)',
    borderColor: '#FDE68A',
    glowClass: 'shadow-amber-500/60',
    shortLabel: 'ST',
  },
  {
    id: 3,
    name: 'Vịt Cà Khịa',
    icon: '🦆',
    colorHex: '#e9946b',
    bgGradient: 'linear-gradient(135deg, #f1b796, #d77d61)',
    borderColor: '#FED7AA',
    glowClass: 'shadow-orange-500/60',
    shortLabel: 'HV',
  },
  {
    id: 4,
    name: 'Thỏ Cầu Vồng',
    icon: '🐰',
    colorHex: '#ba9dd8',
    bgGradient: 'linear-gradient(135deg, #d0b6e6, #aa87c5)',
    borderColor: '#A7F3D0',
    glowClass: 'shadow-emerald-500/60',
    shortLabel: 'RT',
  },
  {
    id: 5,
    name: 'Mèo Phi Hành Gia',
    icon: '🐱',
    colorHex: '#729fd5',
    bgGradient: 'linear-gradient(135deg, #60A5FA, #2563EB)',
    borderColor: '#BFDBFE',
    glowClass: 'shadow-blue-500/60',
    shortLabel: 'DB',
  },
  {
    id: 6,
    name: 'Gấu Trúc',
    icon: '🐼',
    colorHex: '#ce8ea6',
    bgGradient: 'linear-gradient(135deg, #e2b4c2, #ba7794)',
    borderColor: '#DDD6FE',
    glowClass: 'shadow-purple-500/60',
    shortLabel: 'GT',
  },
];

export function getPlayerPreset(avatarId: number): PlayerTokenPreset {
  return SIX_PLAYER_PRESETS.find((p) => p.id === avatarId) || SIX_PLAYER_PRESETS[0];
}
