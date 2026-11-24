import React from 'react';
import clsx from 'clsx';
import { getMatchColor, getMatchLabel } from '../../utils/matching';

export default function MatchBadge({ percentage, showLabel = true, size = 'md', className }) {
  const color = getMatchColor(percentage);
  const label = getMatchLabel(percentage);

  const colorStyles = {
    green: {
      container: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/40',
      dot: 'bg-emerald-500',
    },
    yellow: {
      container: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/40',
      dot: 'bg-amber-500',
    },
    orange: {
      container: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200/80 dark:border-orange-800/40',
      dot: 'bg-orange-500',
    },
    red: {
      container: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/40',
      dot: 'bg-rose-500',
    },
  };

  const currentStyle = colorStyles[color] || colorStyles.yellow;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-md font-medium border select-none transition-colors',
        sizeStyles[size] || sizeStyles.md,
        currentStyle.container,
        className
      )}
      role="status"
      aria-label={`Match score: ${Math.round(percentage)}% - ${label}`}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', currentStyle.dot)} aria-hidden="true" />
      <span className="font-mono tabular-nums font-semibold tracking-tight">{Math.round(percentage)}%</span>
      {showLabel && (
        <span className="opacity-80 font-normal border-l border-current/20 pl-1.5 ml-0.5">
          {label}
        </span>
      )}
    </div>
  );
}
