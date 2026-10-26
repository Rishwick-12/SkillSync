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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            My Learning Roadmaps
            <span className="badge badge-blue">{roadmapList.length} Active</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Personalized milestone-driven curricula designed to close skill gaps for your target job roles.
          </p>
        </div>

        <button
          onClick={() => navigate('/matches')}
          className="btn-primary self-start sm:self-auto text-xs"
        >
          <Plus size={15} />
          Create from Role Match
        </button>
      </div>

      {roadmapList.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No Learning Roadmaps Created Yet"
          description="Browse our recommended job roles, check your skill compatibility, and generate a customized 5-phase learning curriculum."
          action={
            <Link to="/matches" className="btn-primary text-xs">
              <Sparkles size={16} /> Explore Recommended Roles
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {roadmapList.map((roadmap) => {
            const progressInfo = roadmapProgress[roadmap.id] || { completedTasks: [] };
            const { total, completed, percentage } = getRoadmapProgress(
              roadmap,
              progressInfo.completedTasks
            );

            return (
              <div
                key={roadmap.id}
                className="card card-hover border border-slate-200 dark:border-slate-700 p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-1">
                        <Map size={13} />
                        {roadmap.companyName ? `${roadmap.companyName} Track` : 'Standard Tech Track'}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
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
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Delete roadmap"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    5 structured phases: Fundamentals, Core Tech, Frameworks, Projects, and Interview Drills.
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-300">
                        Milestone Progress:
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">
                        {percentage}% ({completed}/{total})
                      </span>
                    </div>
                    <ProgressBar
                      value={percentage}
                      color={percentage === 100 ? 'green' : 'blue'}
                      size="md"
                    />
                  </div>

                  {/* Meta items */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      Target: {progressInfo.targetDate || roadmap.targetDate || 'Flexible'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      Created {new Date(roadmap.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    {total - completed} pending tasks
                  </span>

                  <button
                    onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
                    className="btn-primary text-xs"
                  >
                    Continue Roadmap
                    <ArrowRight size={14} />
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
