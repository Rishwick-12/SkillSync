import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

const proficiencyColors = {
  Beginner: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  Intermediate: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
  Advanced: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
};

export default function SkillTag({ skill, onRemove, onClick, selected, size = 'md' }) {
  const color = proficiencyColors[skill.proficiency] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600';
  return (
    <span
      className={clsx(
        'skill-tag cursor-pointer select-none',
        color,
        selected && 'ring-2 ring-indigo-500',
        size === 'sm' && 'text-xs px-2 py-1',
        size === 'lg' && 'text-sm px-4 py-2',
        onClick && 'hover:opacity-80',
      )}
      onClick={onClick}
    >
      {skill.name}
      {skill.proficiency && <span className="opacity-60">· {skill.proficiency.slice(0, 3)}</span>}
      {onRemove && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(skill); }} className="ml-1 hover:text-red-500 transition-colors">
          <X size={12} />
        </button>
      )}
    </span>
  );
}
