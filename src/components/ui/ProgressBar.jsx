import React from 'react';
import clsx from 'clsx';

export default function ProgressBar({ value, max = 100, size = 'md', color = 'blue', showLabel = false, className }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    blue: 'bg-blue-600',
    indigo: 'bg-blue-600',
    green: 'bg-emerald-500',
    yellow: 'bg-amber-500',
    red: 'bg-rose-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-2.5', xl: 'h-3.5' };
  return (
    <div className={clsx('w-full', className)}>
      <div className={clsx('progress-bar', heights[size])}>
        <div
          className={clsx('progress-fill', colors[color] || 'bg-blue-600', heights[size])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-slate-500 mt-1">{Math.round(pct)}%</span>}
    </div>
  );
}
