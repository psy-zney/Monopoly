import React from 'react';

export interface HouseHotelModelProps {
  houses: number; // 0–4 = houses, 5 = hotel
  size?: 'sm' | 'md';
}

export const HouseHotelModel: React.FC<HouseHotelModelProps> = ({ houses, size = 'sm' }) => {
  if (houses <= 0) return null;

  const houseSize = size === 'sm' ? 8 : 12;
  const hotelSize = size === 'sm' ? 12 : 16;

  if (houses >= 5) {
    return (
      <div
        title="Khách Sạn"
        style={{
          width: hotelSize,
          height: hotelSize,
          background: 'linear-gradient(145deg, #ef4444, #b91c1c)',
          borderRadius: 2,
          border: '1px solid rgba(255,100,100,0.5)',
          boxShadow: '0 2px 6px rgba(239,68,68,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: houseSize - 3,
          fontWeight: 900,
          color: '#fef2f2',
        }}
      >
        H
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {Array.from({ length: houses }).map((_, i) => (
        <div
          key={i}
          title={`Nhà ${i + 1}`}
          style={{
            width: houseSize,
            height: houseSize,
            background: 'linear-gradient(145deg, #22c55e, #15803d)',
            borderRadius: 2,
            border: '1px solid rgba(74,222,128,0.4)',
            boxShadow: '0 2px 4px rgba(22,163,74,0.5)',
          }}
        />
      ))}
    </div>
  );
};
