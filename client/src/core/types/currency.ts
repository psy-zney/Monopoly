export type CurrencyType = 'GOLD' | 'USD' | 'VND' | 'GEM';

export interface CurrencyConfig {
  id: CurrencyType;
  name: string;
  symbol: string;
  prefix: string;
  suffix: string;
  icon: string;
  sample: string;
}

export const CURRENCY_OPTIONS: CurrencyConfig[] = [
  {
    id: 'GOLD',
    name: 'Vàng',
    symbol: '🪙',
    prefix: '',
    suffix: ' 🪙',
    icon: '🪙',
    sample: '1.500 🪙',
  },
  {
    id: 'USD',
    name: 'Đô la Mỹ',
    symbol: '$',
    prefix: '$',
    suffix: '',
    icon: '💵',
    sample: '$1,500',
  },
  {
    id: 'VND',
    name: 'Triệu VNĐ',
    symbol: 'Tr',
    prefix: '',
    suffix: ' Tr',
    icon: '💴',
    sample: '1.500 Tr',
  },
  {
    id: 'GEM',
    name: 'Kim Cương',
    symbol: '💎',
    prefix: '',
    suffix: ' 💎',
    icon: '💎',
    sample: '1.500 💎',
  },
];

export const STARTING_CASH_OPTIONS = [
  { value: 1500, label: '1.500 (Chuẩn)', desc: 'Mức cược tiêu chuẩn' },
  { value: 3000, label: '3.000 (Đại Gia)', desc: 'Nhanh chóng mua đất' },
  { value: 5000, label: '5.000 (Triệu Phú)', desc: 'Vốn dày, xây nhà sớm' },
  { value: 10000, label: '10.000 (Tỷ Phú)', desc: 'Xây khách sạn cấp tốc' },
];

export function formatCurrency(amount: number | undefined | null, currency: CurrencyType = 'GOLD'): string {
  const value = amount ?? 0;
  const formatted = Math.abs(value).toLocaleString('vi-VN');
  const sign = value < 0 ? '-' : '';

  switch (currency) {
    case 'USD':
      return `${sign}$${formatted}`;
    case 'VND':
      return `${sign}${formatted} Tr`;
    case 'GEM':
      return `${sign}${formatted} 💎`;
    case 'GOLD':
    default:
      return `${sign}${formatted} 🪙`;
  }
}

export function getCurrencySymbol(currency: CurrencyType = 'GOLD'): string {
  switch (currency) {
    case 'USD':
      return '$';
    case 'VND':
      return 'Tr';
    case 'GEM':
      return '💎';
    case 'GOLD':
    default:
      return '🪙';
  }
}
