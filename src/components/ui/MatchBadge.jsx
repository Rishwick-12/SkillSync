import React from 'react';
import clsx from 'clsx';
import { getMatchColor, getMatchLabel } from '../../utils/matching';

export default function MatchBadge({ percentage, showLabel = true, size = 'md' }) {
  const color = getMatchColor(percentage);
  const label = getMatchLabel(percentage);
  const colors = {
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };
  return (
    <div className={clsx('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold', size === 'lg' ? 'text-base' : 'text-sm', colors[color])}>
      <span>{Math.round(percentage)}%</span>
      {showLabel && <span className="font-normal opacity-80">{label}</span>}
    </div>
  );
}
