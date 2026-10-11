export interface BoardSpaceData {
  index: number;
  name: string;
  shortName: string;
  type: 'CORNER' | 'PROPERTY' | 'RAILROAD' | 'UTILITY' | 'CHANCE' | 'COMMUNITY_CHEST' | 'TAX';
  colorGroup?: 'BROWN' | 'LIGHT_BLUE' | 'PINK' | 'ORANGE' | 'RED' | 'YELLOW' | 'GREEN' | 'DARK_BLUE';
  price?: number;
  baseRent?: number;
  specialIcon?: string;
  specialBadge?: string;
}

export const VIETNAMESE_BOARD_SPACES: BoardSpaceData[] = [
  // ── ROW 1: 0 to 10 (Bottom Row) ──
  { index: 0, name: 'BẮT ĐẦU', shortName: 'BẮT ĐẦU', type: 'CORNER' },
  { index: 1, name: 'Tân Kỳ Tân Quý', shortName: 'TÂN KỲ\nTÂN QUÝ', type: 'PROPERTY', colorGroup: 'BROWN', price: 60, baseRent: 2 },
  { index: 2, name: 'Khí Vận', shortName: 'KHÍ VẬN', type: 'COMMUNITY_CHEST', specialIcon: '🎁', specialBadge: 'Phúc Lộc' },
  { index: 3, name: 'Lũy Bán Bích', shortName: 'LŨY BÁN\nBÍCH', type: 'PROPERTY', colorGroup: 'BROWN', price: 60, baseRent: 4 },
  { index: 4, name: 'Thuế Thu Nhập', shortName: 'THUẾ\nTHU NHẬP', type: 'TAX', price: 200 },
  { index: 5, name: 'Bến Xe Cần Giuộc', shortName: 'BX CẦN\nGIUỘC', type: 'RAILROAD', price: 200, baseRent: 25 },
  { index: 6, name: 'Quang Trung', shortName: 'QUANG\nTRUNG', type: 'PROPERTY', colorGroup: 'LIGHT_BLUE', price: 100, baseRent: 6 },
  { index: 7, name: 'Cơ Hội', shortName: 'CƠ HỘI', type: 'CHANCE', specialIcon: '❓', specialBadge: 'Vận May' },
  { index: 8, name: 'Nguyễn Kiệm', shortName: 'NGUYỄN\nKIỆM', type: 'PROPERTY', colorGroup: 'LIGHT_BLUE', price: 100, baseRent: 6 },
  { index: 9, name: 'Cộng Hòa', shortName: 'CỘNG\nHÒA', type: 'PROPERTY', colorGroup: 'LIGHT_BLUE', price: 120, baseRent: 8 },

  // ── CORNER 10 & LEFT COLUMN: 10 to 20 ──
  { index: 10, name: 'Thăm Tù / Ở Tù', shortName: 'THĂM TÙ', type: 'CORNER' },
  { index: 11, name: 'Hoàng Văn Thụ', shortName: 'HOÀNG\nVĂN THỤ', type: 'PROPERTY', colorGroup: 'PINK', price: 140, baseRent: 10 },
  { index: 12, name: 'Công Ty Điện Lực', shortName: 'ĐIỆN\nLỰC', type: 'UTILITY', price: 200 },
  { index: 13, name: 'Trường Chinh', shortName: 'TRƯỜNG\nCHINH', type: 'PROPERTY', colorGroup: 'PINK', price: 140, baseRent: 10 },
  { index: 14, name: 'Lê Đại Hành', shortName: 'LÊ ĐẠI\nHÀNH', type: 'PROPERTY', colorGroup: 'PINK', price: 160, baseRent: 12 },
  { index: 15, name: 'Bến Xe Miền Đông', shortName: 'BX MIỀN\nĐÔNG', type: 'RAILROAD', price: 200, baseRent: 25 },
  { index: 16, name: 'Nguyễn Tri Phương', shortName: 'NGUYỄN\nTRI PHƯƠNG', type: 'PROPERTY', colorGroup: 'ORANGE', price: 180, baseRent: 14 },
  { index: 17, name: 'Khí Vận', shortName: 'KHÍ VẬN', type: 'COMMUNITY_CHEST', specialIcon: '🍀', specialBadge: 'Cỏ 4 Lá' },
  { index: 18, name: 'Kha Vạn Cân', shortName: 'KHA VẠN\nCÂN', type: 'PROPERTY', colorGroup: 'ORANGE', price: 180, baseRent: 14 },
  { index: 19, name: 'Phạm Thế Hiển', shortName: 'PHẠM\nTHẾ HIỂN', type: 'PROPERTY', colorGroup: 'ORANGE', price: 200, baseRent: 16 },

  // ── CORNER 20 & TOP ROW: 20 to 30 ──
  { index: 20, name: 'Đậu Xe Miễn Phí', shortName: 'ĐẬU XE', type: 'CORNER' },
  { index: 21, name: 'Huỳnh Tấn Phát', shortName: 'HUỲNH\nTẤN PHÁT', type: 'PROPERTY', colorGroup: 'RED', price: 220, baseRent: 18 },
  { index: 22, name: 'Cơ Hội', shortName: 'CƠ HỘI', type: 'CHANCE', specialIcon: '🎲', specialBadge: 'Thần Tài' },
  { index: 23, name: 'Hùng Vương', shortName: 'HÙNG\nVƯƠNG', type: 'PROPERTY', colorGroup: 'RED', price: 220, baseRent: 18 },
  { index: 24, name: 'Hậu Giang', shortName: 'HẬU\nGIANG', type: 'PROPERTY', colorGroup: 'RED', price: 240, baseRent: 20 },
  { index: 25, name: 'Bến Xe Chợ Lớn', shortName: 'BX CHỢ\nLỚN', type: 'RAILROAD', price: 200, baseRent: 25 },
  { index: 26, name: 'An Dương Vương', shortName: 'AN DƯƠNG\nVƯƠNG', type: 'PROPERTY', colorGroup: 'YELLOW', price: 260, baseRent: 22 },
  { index: 27, name: 'Nguyễn Trãi', shortName: 'NGUYỄN\nTRÃI', type: 'PROPERTY', colorGroup: 'YELLOW', price: 260, baseRent: 22 },
  { index: 28, name: 'Công Ty Cấp Nước', shortName: 'CẤP\nNƯỚC', type: 'UTILITY', price: 200 },
  { index: 29, name: 'Nguyễn Tất Thành', shortName: 'NGUYỄN\nTẤT THÀNH', type: 'PROPERTY', colorGroup: 'YELLOW', price: 280, baseRent: 24 },

  // ── CORNER 30 & RIGHT COLUMN: 30 to 39 ──
  { index: 30, name: 'Vào Tù', shortName: 'VÀO TÙ', type: 'CORNER' },
  { index: 31, name: 'Hai Bà Trưng', shortName: 'HAI BÀ\nTRƯNG', type: 'PROPERTY', colorGroup: 'GREEN', price: 300, baseRent: 26 },
  { index: 32, name: 'Võ Thị Sáu', shortName: 'VÕ THỊ\nSÁU', type: 'PROPERTY', colorGroup: 'GREEN', price: 300, baseRent: 26 },
  { index: 33, name: 'Khí Vận', shortName: 'KHÍ VẬN', type: 'COMMUNITY_CHEST', specialIcon: '💎', specialBadge: 'Quỹ Chung' },
  { index: 34, name: 'Lương Định Của', shortName: 'LƯƠNG\nĐỊNH CỦA', type: 'PROPERTY', colorGroup: 'GREEN', price: 320, baseRent: 28 },
  { index: 35, name: 'Bến Xe Miền Tây', shortName: 'BX MIỀN\nTÂY', type: 'RAILROAD', price: 200, baseRent: 25 },
  { index: 36, name: 'Cơ Hội', shortName: 'CƠ HỘI', type: 'CHANCE', specialIcon: '🌟', specialBadge: 'Cơ Hội Vàng' },
  { index: 37, name: 'Lê Lợi', shortName: 'LÊ LỢI', type: 'PROPERTY', colorGroup: 'DARK_BLUE', price: 350, baseRent: 35 },
  { index: 38, name: 'Thuế Đặc Biệt', shortName: 'THUẾ\nĐẶC BIỆT', type: 'TAX', price: 100 },
  { index: 39, name: 'Nguyễn Huệ', shortName: 'NGUYỄN\nHUỆ', type: 'PROPERTY', colorGroup: 'DARK_BLUE', price: 400, baseRent: 50 },
];
