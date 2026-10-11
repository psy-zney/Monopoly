import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'emerald' | 'rose' | 'slate' | 'cyan' | 'purple';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  icon,
  className = '',
}) => {
  const variantStyles = {
    amber: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    rose: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
  }[variant];

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-bold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-extrabold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full uppercase tracking-wider border select-none ${variantStyles} ${sizeStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
