import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

const proficiencyConfig = {
  Beginner: {
    container: 'bg-slate-50 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/[0.08]',
    dot: 'bg-sky-500',
    label: 'Beg',
  },
  Intermediate: {
    container: 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
    dot: 'bg-amber-500',
    label: 'Int',
  },
  Advanced: {
    container: 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
    dot: 'bg-emerald-500',
    label: 'Adv',
  },
};

export default function SkillTag({ skill, onRemove, onClick, selected, size = 'md', className }) {
  const config = proficiencyConfig[skill.proficiency] || {
    container: 'bg-slate-50 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/[0.08]',
    dot: 'bg-slate-400',
    label: null,
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md font-medium border select-none transition-all duration-150',
        sizes[size] || sizes.md,
        config.container,
        selected && 'ring-1 ring-brand-500 border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300',
        onClick && 'cursor-pointer hover:border-slate-300 dark:hover:border-white/20 active:scale-[0.98]',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e); } : undefined}
    >
      {skill.proficiency && (
        <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} aria-hidden="true" />
      )}
      <span className="truncate max-w-[140px] sm:max-w-none">{skill.name}</span>
      {config.label && (
        <span className="text-[10px] uppercase font-mono opacity-60">
          {config.label}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(skill);
          }}
          className="ml-0.5 p-0.5 rounded hover:bg-slate-200/70 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors focus:outline-none"
          aria-label={`Remove ${skill.name}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
