import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm ${className}`}
    >
      {icon && (
        <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-amber-400/10 text-amber-400/80 border border-amber-400/20 shadow-inner">
          {icon}
        </div>
      )}
      <h3
        className="text-base font-extrabold text-white tracking-wide uppercase mb-1"
        style={{ fontFamily: 'Baloo 2, cursive' }}
      >
        {title}
      </h3>
      <p className="max-w-xs text-xs font-semibold text-slate-400 leading-relaxed mb-4">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
