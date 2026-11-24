import React from 'react';
import clsx from 'clsx';

export default function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  color = 'blue',
  showLabel = false,
  className,
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    blue: 'bg-indigo-600 dark:bg-indigo-500',
    indigo: 'bg-indigo-600 dark:bg-indigo-500',
    green: 'bg-emerald-500 dark:bg-emerald-400',
    yellow: 'bg-amber-500 dark:bg-amber-400',
    red: 'bg-rose-500 dark:bg-rose-400',
    orange: 'bg-orange-500 dark:bg-orange-400',
    purple: 'bg-purple-500 dark:bg-purple-400',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
    xl: 'h-3',
  };

  return (
    <div className={clsx('w-full', className)}>
      <div
        className={clsx('w-full bg-slate-100 dark:bg-white/[0.08] rounded-full overflow-hidden', heights[size])}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={clsx('h-full rounded-full transition-all duration-300 ease-out', colors[color] || colors.blue)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
          <span>{Math.round(value)} of {max}</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{Math.round(pct)}%</span>
        </div>
      )}
    </div>
  );
}
