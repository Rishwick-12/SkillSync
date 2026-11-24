import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Map,
  Plus,
  Trash2,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRoadmapProgress } from '../utils/roadmap';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';

export default function RoadmapsPage() {
  const { savedRoadmaps, roadmapProgress, deleteRoadmap } = useApp();
  const navigate = useNavigate();

  const roadmapList = Object.values(savedRoadmaps || {});

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              My Learning Roadmaps
            </h1>
            <span className="badge badge-blue font-mono text-[11px]">
              {roadmapList.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalized milestone-driven curricula designed to systematically close skill gaps for your target job roles.
          </p>
        </div>

        <button
          onClick={() => navigate('/matches')}
          className="btn-primary self-start sm:self-auto text-xs"
        >
          <Plus size={14} />
          Create from Role Match
        </button>
      </div>

      {roadmapList.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No Learning Roadmaps Created Yet"
          description="Browse your recommended job roles, check your skill compatibility, and generate a customized 5-phase learning curriculum."
          action={
            <Link to="/matches" className="btn-primary text-xs">
              <Sparkles size={14} /> Explore Recommended Roles
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmapList.map((roadmap) => {
            const progressInfo = roadmapProgress[roadmap.id] || { completedTasks: [] };
            const { total, completed, percentage } = getRoadmapProgress(
              roadmap,
              progressInfo.completedTasks
            );
            const isCompleted = percentage === 100 && total > 0;

            return (
              <div
                key={roadmap.id}
                className="card card-hover flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium mb-1.5 border border-indigo-200/50 dark:border-indigo-800/40">
                        <Map size={11} />
                        <span className="truncate">
                          {roadmap.companyName ? `${roadmap.companyName} Track` : 'Standard Tech Track'}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {roadmap.roleTitle}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete the roadmap for "${roadmap.roleTitle}"?`)) {
                          deleteRoadmap(roadmap.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete roadmap"
                      aria-label="Delete roadmap"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    5 structured phases: Fundamentals, Core Tech, Frameworks, Projects, and Interview Drills.
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <ListTodo size={13} className="text-slate-400" />
                        Milestones
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                        {percentage}%{' '}
                        <span className="text-slate-400 dark:text-slate-500 font-normal">
                          ({completed}/{total})
                        </span>
                      </span>
                    </div>
                    <ProgressBar
                      value={percentage}
                      color={isCompleted ? 'green' : 'blue'}
                      size="sm"
                    />
                  </div>

                  {/* Meta items */}
                  <div className="flex flex-wrap items-center gap-3.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400" />
                      Target:{' '}
                      <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                        {progressInfo.targetDate || roadmap.targetDate || 'Flexible'}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-400" />
                      Created {new Date(roadmap.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    {total - completed === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 font-sans font-medium">
                        <CheckCircle2 size={13} /> All complete
                      </span>
                    ) : (
                      `${total - completed} pending tasks`
                    )}
                  </span>

                  <button
                    onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
                    className="btn-secondary text-xs group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-all"
                  >
                    Continue Roadmap
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
