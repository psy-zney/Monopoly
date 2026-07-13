export interface BoardSpaceData {
  index: number;
  name: string;
  type: 'CORNER' | 'PROPERTY' | 'RAILROAD' | 'UTILITY' | 'CHANCE' | 'COMMUNITY_CHEST' | 'TAX';
  colorGroup?: 'BROWN' | 'LIGHT_BLUE' | 'PINK' | 'ORANGE' | 'RED' | 'YELLOW' | 'GREEN' | 'DARK_BLUE';
  price?: number;
  baseRent?: number;
}

export const VIETNAMESE_BOARD_SPACES: BoardSpaceData[] = [
  { index: 0, name: 'BẮT ĐẦU', type: 'CORNER' },
  { index: 1, name: 'TÂN KỲ TÂN QUÝ', type: 'PROPERTY', colorGroup: 'BROWN', price: 60, baseRent: 2 },
  { index: 2, name: 'KHÍ VẬN', type: 'COMMUNITY_CHEST' },
  { index: 3, name: 'LŨY BÁN BÍCH', type: 'PROPERTY', colorGroup: 'BROWN', price: 60, baseRent: 4 },
  { index: 4, name: 'THUẾ THU NHẬP', type: 'TAX', price: 200 },
  { index: 5, name: 'BẾN XE CẦN GIUỘC', type: 'RAILROAD', price: 200, baseRent: 25 },
  { index: 6, name: 'QUANG TRUNG', type: 'PROPERTY', colorGroup: 'LIGHT_BLUE', price: 100, baseRent: 6 },
  { index: 7, name: 'CƠ HỘI', type: 'CHANCE' },
  { index: 8, name: 'NGUYỄN KIỆM', type: 'PROPERTY', colorGroup: 'LIGHT_BLUE', price: 100, baseRent: 6 },
  { index: 9, name: 'CỘNG HÒA', type: 'PROPERTY', colorGroup: 'LIGHT_BLUE', price: 120, baseRent: 8 },
  { index: 10, name: 'THĂM TÙ / Ở TÙ', type: 'CORNER' },
  { index: 11, name: 'HOÀNG VĂN THỤ', type: 'PROPERTY', colorGroup: 'PINK', price: 140, baseRent: 10 },
  { index: 12, name: 'CÔNG TY ĐIỆN LỰC', type: 'UTILITY', price: 200 },
  { index: 13, name: 'TRƯỜNG CHINH', type: 'PROPERTY', colorGroup: 'PINK', price: 140, baseRent: 10 },
  { index: 14, name: 'LÊ ĐẠI HÀNH', type: 'PROPERTY', colorGroup: 'PINK', price: 160, baseRent: 12 },
  { index: 15, name: 'BẾN XE MIỀN ĐÔNG', type: 'RAILROAD', price: 200, baseRent: 25 },
  { index: 16, name: 'NGUYỄN TRI PHƯƠNG', type: 'PROPERTY', colorGroup: 'ORANGE', price: 180, baseRent: 14 },
  { index: 17, name: 'KHÍ VẬN', type: 'COMMUNITY_CHEST' },
  { index: 18, name: 'KHA VẠN CÂN', type: 'PROPERTY', colorGroup: 'ORANGE', price: 180, baseRent: 14 },
  { index: 19, name: 'PHẠM THẾ HIỂN', type: 'PROPERTY', colorGroup: 'ORANGE', price: 200, baseRent: 16 },
  { index: 20, name: 'BÃI ĐẬU XE MIỄN PHÍ', type: 'CORNER' },
  { index: 21, name: 'HUỲNH TẤN PHÁT', type: 'PROPERTY', colorGroup: 'RED', price: 220, baseRent: 18 },
  { index: 22, name: 'CƠ HỘI', type: 'CHANCE' },
  { index: 23, name: 'HÙNG VƯƠNG', type: 'PROPERTY', colorGroup: 'RED', price: 220, baseRent: 18 },
  { index: 24, name: 'HẬU GIANG', type: 'PROPERTY', colorGroup: 'RED', price: 240, baseRent: 20 },
  { index: 25, name: 'BẾN XE CHỢ LỚN', type: 'RAILROAD', price: 200, baseRent: 25 },
  { index: 26, name: 'AN DƯƠNG VƯƠNG', type: 'PROPERTY', colorGroup: 'YELLOW', price: 260, baseRent: 22 },
  { index: 27, name: 'NGUYỄN TRÃI', type: 'PROPERTY', colorGroup: 'YELLOW', price: 260, baseRent: 22 },
  { index: 28, name: 'CÔNG TY CẤP NƯỚC', type: 'UTILITY', price: 200 },
  { index: 29, name: 'NGUYỄN TẤT THÀNH', type: 'PROPERTY', colorGroup: 'YELLOW', price: 280, baseRent: 24 },
  { index: 30, name: 'VÀO TÙ', type: 'CORNER' },
  { index: 31, name: 'HAI BÀ TRƯNG', type: 'PROPERTY', colorGroup: 'GREEN', price: 300, baseRent: 26 },
  { index: 32, name: 'VÕ THỊ SÁU', type: 'PROPERTY', colorGroup: 'GREEN', price: 300, baseRent: 26 },
  { index: 33, name: 'KHÍ VẬN', type: 'COMMUNITY_CHEST' },
  { index: 34, name: 'LƯƠNG ĐỊNH CỦA', type: 'PROPERTY', colorGroup: 'GREEN', price: 320, baseRent: 28 },
  { index: 35, name: 'BẾN XE MIỀN TẤY', type: 'RAILROAD', price: 200, baseRent: 25 },
  { index: 36, name: 'CƠ HỘI', type: 'CHANCE' },
  { index: 37, name: 'LÊ LỢI', type: 'PROPERTY', colorGroup: 'DARK_BLUE', price: 350, baseRent: 35 },
  { index: 38, name: 'THUẾ ĐẶC BIỆT', type: 'TAX', price: 100 },
  { index: 39, name: 'NGUYỄN HUỆ', type: 'PROPERTY', colorGroup: 'DARK_BLUE', price: 400, baseRent: 50 },
];
