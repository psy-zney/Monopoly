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
  { id: 'kv-01', title: 'Khởi đầu may mắn', description: 'Tiến đến ô Bắt Đầu. Nhận $200.', effect: '+$200', effectKind: 'MOVE' },
  { id: 'kv-02', title: 'Hoàn thuế nhỏ', description: 'Nhận 20% số tiền đang có trong quỹ thuế giữa bàn.', effect: '20% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'kv-03', title: 'Đóng góp cộng đồng', description: 'Nộp thêm 10% số tiền mặt đang cầm vào quỹ thuế.', effect: '10% tiền mặt', effectKind: 'PAY' },
  { id: 'kv-04', title: 'Hoàn thuế tiêu chuẩn', description: 'Nhận 40% số tiền đang có trong quỹ thuế giữa bàn.', effect: '40% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'kv-05', title: 'Bảo bối vượt ngục', description: 'Giữ thẻ này để ra tù miễn phí hoặc trao đổi với người chơi khác.', effect: 'Giữ thẻ', effectKind: 'KEEP' },
  { id: 'kv-06', title: 'Bị bắt quả tang', description: 'Đi thẳng vào Tù. Không đi qua Bắt Đầu, không nhận $200.', effect: 'Vào tù', effectKind: 'JAIL' },
  { id: 'kv-07', title: 'Hoàn thuế lớn', description: 'Nhận 60% số tiền đang có trong quỹ thuế giữa bàn.', effect: '60% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'kv-08', title: 'Hoàn thuế đặc biệt', description: 'Nhận toàn bộ số tiền đang có trong quỹ thuế giữa bàn.', effect: '100% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'kv-09', title: 'Sinh nhật vui vẻ', description: 'Hôm nay là sinh nhật bạn. Thu $10 từ mỗi người chơi.', effect: '+$10/người', effectKind: 'PLAYERS' },
  { id: 'kv-10', title: 'Truy thu thuế cố định', description: 'Nộp thêm $200 vào quỹ thuế giữa bàn.', effect: '-$200', effectKind: 'PAY' },
  { id: 'kv-11', title: 'Bổ sung công quỹ', description: 'Nộp số tiền bằng 50% quỹ thuế hiện có vào quỹ.', effect: '50% quỹ hiện có', effectKind: 'PAY' },
  { id: 'kv-12', title: 'Học phí', description: 'Thanh toán học phí cho khóa học mới.', effect: '-$50', effectKind: 'PAY' },
  { id: 'kv-13', title: 'Tư vấn công nghệ', description: 'Bạn giúp sửa một món bảo bối và nhận thù lao.', effect: '+$30', effectKind: 'RECEIVE' },
  { id: 'kv-14', title: 'Kiểm kê tài sản', description: 'Nộp 10% tổng tài sản gồm tiền mặt, giá đất và giá trị công trình.', effect: '10% tài sản', effectKind: 'PAY' },
  { id: 'kv-15', title: 'Nhận thừa kế', description: 'Bạn nhận được một khoản thừa kế. Nhận $100.', effect: '+$100', effectKind: 'RECEIVE' },
  { id: 'kv-16', title: 'Giải thưởng thân thiện', description: 'Bạn được bình chọn là người hàng xóm thân thiện nhất.', effect: '+$10', effectKind: 'RECEIVE' },
];

export const CHANCE_CARDS: BoardCardData[] = [
  { id: 'ch-01', title: 'Tiến đến Bắt Đầu', description: 'Tiến đến ô Bắt Đầu và nhận $200.', effect: '+$200', effectKind: 'MOVE' },
  { id: 'ch-02', title: 'Đến Nguyễn Huệ', description: 'Tiến đến Nguyễn Huệ. Nếu đi qua Bắt Đầu, nhận $200.', effect: 'Di chuyển', effectKind: 'MOVE' },
  { id: 'ch-03', title: 'Đến bến xe gần nhất', description: 'Tiến đến bến xe gần nhất. Nếu đã có chủ, trả gấp đôi tiền thuê.', effect: 'Bến xe', effectKind: 'MOVE' },
  { id: 'ch-04', title: 'Đến công ty gần nhất', description: 'Tiến đến công ty tiện ích gần nhất. Nếu đã có chủ, tung xúc xắc và trả 10 lần kết quả.', effect: 'Tiện ích', effectKind: 'MOVE' },
  { id: 'ch-05', title: 'Lùi ba bước', description: 'Lùi lại 3 ô và xử lý ô vừa đến như bình thường.', effect: '-3 ô', effectKind: 'MOVE' },
  { id: 'ch-06', title: 'Đi thẳng vào Tù', description: 'Đi thẳng vào Tù. Không đi qua Bắt Đầu, không nhận $200.', effect: 'Vào tù', effectKind: 'JAIL' },
  { id: 'ch-07', title: 'Cánh cửa thần kỳ', description: 'Giữ thẻ này để ra tù miễn phí hoặc trao đổi với người chơi khác.', effect: 'Giữ thẻ', effectKind: 'KEEP' },
  { id: 'ch-08', title: 'Chia quỹ thuế', description: 'Nhận 10% quỹ thuế giữa bàn, làm tròn xuống theo bội số $10.', effect: '10% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'ch-09', title: 'Truy thu tài sản', description: 'Nộp 10% tổng tài sản gồm tiền mặt, giá đất và giá trị công trình.', effect: '10% tài sản', effectKind: 'PAY' },
  { id: 'ch-10', title: 'Cơ hội hoàn thuế', description: 'Nhận 50% quỹ thuế giữa bàn, làm tròn xuống theo bội số $10.', effect: '50% quỹ thuế', effectKind: 'RECEIVE' },
  { id: 'ch-11', title: 'Phụ thu hành chính', description: 'Nộp thêm $100 vào quỹ thuế giữa bàn.', effect: '-$100', effectKind: 'PAY' },
  { id: 'ch-12', title: 'Thuế tiền mặt đột xuất', description: 'Nộp thêm 10% số tiền mặt đang cầm vào quỹ thuế.', effect: '10% tiền mặt', effectKind: 'PAY' },
  { id: 'ch-13', title: 'Sung công quỹ', description: 'Nộp số tiền bằng 20% quỹ thuế hiện có vào quỹ.', effect: '20% quỹ hiện có', effectKind: 'PAY' },
  { id: 'ch-14', title: 'Đến Lê Lợi', description: 'Tiến đến Lê Lợi. Nếu đi qua Bắt Đầu, nhận $200.', effect: 'Di chuyển', effectKind: 'MOVE' },
  { id: 'ch-15', title: 'Đến Bến xe Miền Đông', description: 'Tiến đến Bến xe Miền Đông. Nếu đi qua Bắt Đầu, nhận $200.', effect: 'Di chuyển', effectKind: 'MOVE' },
  { id: 'ch-16', title: 'Trúng quỹ thuế', description: 'Nhận toàn bộ quỹ thuế đang tích lũy giữa bàn.', effect: '100% quỹ thuế', effectKind: 'RECEIVE' },
];

export const CARD_DECKS: Record<CardDeckKind, BoardCardData[]> = {
  COMMUNITY_CHEST: COMMUNITY_CHEST_CARDS,
  CHANCE: CHANCE_CARDS,
};
