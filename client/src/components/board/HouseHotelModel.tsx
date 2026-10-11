import React from 'react';

export interface HouseHotelModelProps {
  houses: number; // 0–4 = houses, 5 = hotel
  size?: 'sm' | 'md';
  orientation?: 'horizontal' | 'vertical';
}

export const HouseHotelModel: React.FC<HouseHotelModelProps> = ({
  houses,
  size = 'sm',
  orientation = 'horizontal',
}) => {
  if (houses <= 0) return null;

  const houseSize = size === 'sm' ? 7 : 11;
  const hotelSize = size === 'sm' ? 14 : 20;
  const isVertical = orientation === 'vertical';

  if (houses >= 5) {
    return (
      <div
        title="Khách Sạn Cao Cấp"
        className="board-hotel shrink-0 flex items-center justify-center"
        style={{
          width: hotelSize,
          height: hotelSize,
          fontSize: houseSize - 1,
        }}
      >
        <span aria-hidden="true">H</span>
      </div>
    );
  }

  return (
    <div
      className={`board-house-grid ${isVertical ? 'is-vertical' : ''}`}
      aria-label={`${houses} nhà`}
    >
      {Array.from({ length: Math.min(4, houses) }).map((_, i) => (
        <div
          key={i}
          title={`Nhà cấp ${i + 1}`}
          className="board-house"
          style={{
            width: houseSize,
            height: houseSize,

          }}
        />
      ))}
    </div>
  );
};
