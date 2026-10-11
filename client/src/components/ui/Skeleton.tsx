import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  width,
  height,
  style,
  ...props
}) => {
  const variantClass =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'text'
        ? 'rounded-md h-4 my-1'
        : 'rounded-xl';

  return (
    <div
      className={`skeleton-shimmer bg-slate-800/80 relative overflow-hidden ${variantClass} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};
