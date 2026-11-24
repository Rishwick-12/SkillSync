import React from 'react';
import clsx from 'clsx';

export function SkeletonCard({ className }) {
  return (
    <div className={clsx('card animate-pulse space-y-4', className)}>
      <div className="flex items-start gap-3">
        <div className="skeleton w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2 py-0.5">
          <div className="skeleton h-3.5 w-1/2" />
          <div className="skeleton h-2.5 w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-2.5 w-full" />
        <div className="skeleton h-2.5 w-4/5" />
      </div>
      <div className="pt-2 flex justify-between items-center">
        <div className="skeleton h-5 w-16 rounded-md" />
        <div className="skeleton h-7 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3, className }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-white/[0.04] animate-pulse"
        >
          <div className="skeleton w-7 h-7 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="skeleton h-3 w-2/5" />
            <div className="skeleton h-2 w-1/4" />
          </div>
          <div className="skeleton h-5 w-12 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStatsRow({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 animate-pulse space-y-2">
          <div className="flex justify-between items-center">
            <div className="skeleton h-2.5 w-20" />
            <div className="skeleton w-6 h-6 rounded-md" />
          </div>
          <div className="skeleton h-6 w-14" />
          <div className="skeleton h-2 w-24" />
        </div>
      ))}
    </div>
  );
}
