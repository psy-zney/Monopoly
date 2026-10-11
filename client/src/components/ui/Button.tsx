import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-extrabold rounded-xl transition-colors duration-150 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-xs px-3.5 py-2 gap-2 min-h-[40px]',
    lg: 'text-sm px-5 py-3 gap-2.5 min-h-[48px]',
  }[size];

  // 60-30-10 Rule: Primary & Accent uses the 10% Gold/Amber for the single main CTA
  const variantStyles = {
    primary:
      'bg-[#ef987e] text-[#4b302a] border border-[#d9846b] hover:bg-[#f5a98f] focus-visible:outline-[#80b6c8]',
    accent:
      'bg-[#adc8b7] text-[#304e40] border border-[#8fae98] hover:bg-[#bed4c5] focus-visible:outline-[#80b6c8]',
    secondary:
      'bg-slate-800/80 backdrop-blur-md text-white border border-slate-700/80 hover:bg-slate-700/80 hover:border-slate-600 shadow-md focus-visible:outline-slate-400',
    ghost:
      'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white focus-visible:outline-white',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg shadow-rose-600/25 border border-rose-400/40 hover:brightness-105 active:brightness-95 focus-visible:outline-rose-400',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
