import React from 'react';
import clsx from 'clsx';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.01]',
        className
      )}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-lg border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#181C24] flex items-center justify-center mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
