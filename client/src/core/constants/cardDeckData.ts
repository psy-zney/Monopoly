export type CardDeckKind = 'COMMUNITY_CHEST' | 'CHANCE';

export type CardEffectKind =
  | 'MOVE'
  | 'RECEIVE'
  | 'PAY'
  | 'PLAYERS'
  | 'REPAIRS'
  | 'JAIL'
  | 'KEEP';

export interface BoardCardData {
  id: string;
  title: string;
  description: string;
  effect: string;
  effectKind: CardEffectKind;
}

export const COMMUNITY_CHEST_CARDS: BoardCardData[] = [
  { id: 'kv-01', title: 'Khởi đầu may mắn', description: 'Tiến thẳng đến ô Bắt Đầu. Nhận tiền thưởng qua ô.', effect: '+Thưởng Bắt Đầu', effectKind: 'MOVE' },
  { id: 'kv-02', title: 'Hoàn thuế nhỏ', description: 'Nhận 20% số tiền đang có trong quỹ thuế giữa bàn.', effect: '20% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'kv-03', title: 'Đóng góp công cộng', description: 'Nộp thêm 10% số tiền mặt đang có vào quỹ thuế.', effect: '10% tiền mặt', effectKind: 'PAY' },
  { id: 'kv-04', title: 'Hoàn thuế tiêu chuẩn', description: 'Nhận 40% số tiền đang có trong quỹ thuế giữa bàn.', effect: '40% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'kv-05', title: 'Thẻ Ra Tù Miễn Phí', description: 'Giữ thẻ này để ra tù miễn phí khi cần hoặc chuyển nhượng.', effect: 'Giữ thẻ ra tù', effectKind: 'KEEP' },
  { id: 'kv-06', title: 'Vi phạm quy định', description: 'Đi thẳng vào Tù. Không đi qua Bắt Đầu, không nhận thưởng.', effect: 'Vào tù', effectKind: 'JAIL' },
  { id: 'kv-07', title: 'Hoàn thuế lớn', description: 'Nhận 60% số tiền đang có trong quỹ thuế giữa bàn.', effect: '60% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'kv-08', title: 'Trúng thưởng độc đắc', description: 'Nhận toàn bộ 100% số tiền đang tích lũy trong quỹ thuế.', effect: '100% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'kv-09', title: 'Sinh nhật vui vẻ', description: 'Hôm nay là sinh nhật bạn. Thu 50 từ mỗi người chơi.', effect: '+50/người', effectKind: 'PLAYERS' },
  { id: 'kv-10', title: 'Nộp phạt hành chính', description: 'Nộp 200 vào quỹ thuế giữa bàn.', effect: '-200', effectKind: 'PAY' },
  { id: 'kv-11', title: 'Bổ sung công quỹ', description: 'Nộp số tiền bằng 50% quỹ thuế hiện có vào quỹ.', effect: '50% quỹ hiện có', effectKind: 'PAY' },
  { id: 'kv-12', title: 'Chi phí bảo hiểm', description: 'Thanh toán phí bảo hiểm định kỳ cho bất động sản.', effect: '-100', effectKind: 'PAY' },
  { id: 'kv-13', title: 'Tư vấn đầu tư', description: 'Bạn tư vấn tài chính thành công và nhận thù lao hấp dẫn.', effect: '+150', effectKind: 'RECEIVE' },
  { id: 'kv-14', title: 'Kiểm kê tài sản', description: 'Nộp 10% tổng tài sản gồm tiền mặt, giá đất và công trình.', effect: '10% tài sản', effectKind: 'PAY' },
  { id: 'kv-15', title: 'Nhận cổ tức doanh nghiệp', description: 'Bạn nhận được cổ tức từ các khoản đầu tư. Nhận 200.', effect: '+200', effectKind: 'RECEIVE' },
  { id: 'kv-16', title: 'Giải thưởng doanh nhân', description: 'Bạn được vinh danh là nhà đầu tư xuất sắc của năm.', effect: '+100', effectKind: 'RECEIVE' },
];

export const CHANCE_CARDS: BoardCardData[] = [
  { id: 'ch-01', title: 'Tiến đến Bắt Đầu', description: 'Tiến thẳng đến ô Bắt Đầu và nhận thưởng qua ô.', effect: '+Thưởng Bắt Đầu', effectKind: 'MOVE' },
  { id: 'ch-02', title: 'Đến Nguyễn Huệ', description: 'Tiến đến Nguyễn Huệ. Nếu đi qua Bắt Đầu, nhận thưởng.', effect: 'Đến Nguyễn Huệ', effectKind: 'MOVE' },
  { id: 'ch-03', title: 'Đến bến xe gần nhất', description: 'Tiến đến bến xe gần nhất. Nếu đã có chủ, trả gấp đôi tiền thuê.', effect: 'Bến xe', effectKind: 'MOVE' },
  { id: 'ch-04', title: 'Đến công ty tiện ích', description: 'Tiến đến công ty tiện ích gần nhất. Nếu đã có chủ, tung xúc xắc trả gấp 10 lần.', effect: 'Tiện ích', effectKind: 'MOVE' },
  { id: 'ch-05', title: 'Lùi ba bước', description: 'Lùi lại 3 ô và xử lý sự kiện ở ô vừa đến.', effect: '-3 ô', effectKind: 'MOVE' },
  { id: 'ch-06', title: 'Lệnh bắt giữ', description: 'Đi thẳng vào Tù. Không đi qua Bắt Đầu, không nhận thưởng.', effect: 'Vào tù', effectKind: 'JAIL' },
  { id: 'ch-07', title: 'Thẻ Ra Tù Miễn Phí', description: 'Giữ thẻ này để ra tù miễn phí hoặc giao dịch với người khác.', effect: 'Giữ thẻ ra tù', effectKind: 'KEEP' },
  { id: 'ch-08', title: 'Chia quỹ thuế', description: 'Nhận 10% quỹ thuế giữa bàn.', effect: '10% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'ch-09', title: 'Truy thu thuế tài sản', description: 'Nộp 10% tổng tài sản vào ngân khố.', effect: '10% tài sản', effectKind: 'PAY' },
  { id: 'ch-10', title: 'Cơ hội hoàn thuế', description: 'Nhận 50% quỹ thuế giữa bàn.', effect: '50% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'ch-11', title: 'Phụ thu hành chính', description: 'Nộp thêm 100 vào quỹ thuế giữa bàn.', effect: '-100', effectKind: 'PAY' },
  { id: 'ch-12', title: 'Thuế thu nhập đột xuất', description: 'Nộp thêm 10% số tiền mặt đang cầm vào quỹ thuế.', effect: '10% tiền mặt', effectKind: 'PAY' },
  { id: 'ch-13', title: 'Đóng góp hạ tầng', description: 'Nộp số tiền bằng 20% quỹ thuế hiện có vào quỹ.', effect: '20% quỹ hiện có', effectKind: 'PAY' },
  { id: 'ch-14', title: 'Đến Lê Lợi', description: 'Tiến đến đại lộ Lê Lợi sầm uất. Nếu đi qua Bắt Đầu, nhận thưởng.', effect: 'Đến Lê Lợi', effectKind: 'MOVE' },
  { id: 'ch-15', title: 'Đến Bến xe Miền Đông', description: 'Tiến đến Bến xe Miền Đông. Nếu đi qua Bắt Đầu, nhận thưởng.', effect: 'Đến BX Miền Đông', effectKind: 'MOVE' },
  { id: 'ch-16', title: 'Kho báu quỹ thuế', description: 'Nhận toàn bộ 100% quỹ thuế đang tích lũy giữa bàn.', effect: '100% quỹ thuế', effectKind: 'RECEIVE' },
];

export const CARD_DECKS: Record<CardDeckKind, BoardCardData[]> = {
  COMMUNITY_CHEST: COMMUNITY_CHEST_CARDS,
  CHANCE: CHANCE_CARDS,
};
