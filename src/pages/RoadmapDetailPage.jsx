import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Map,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  BookOpen,
  Check,
  Edit2,
  Sparkles,
  ListTodo,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRoadmapProgress } from '../utils/roadmap';
import ProgressBar from '../components/ui/ProgressBar';

export default function RoadmapDetailPage() {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const {
    savedRoadmaps,
    roadmapProgress,
    toggleRoadmapTask,
    setRoadmapTargetDate,
  } = useApp();

  const [activeView, setActiveView] = useState('all'); // 'all' | 'pending' | 'completed'
  const [editingTargetDate, setEditingTargetDate] = useState(false);

  const roadmap = useMemo(() => {
    return savedRoadmaps?.[roadmapId];
  }, [savedRoadmaps, roadmapId]);

  const currentProgress = roadmapProgress?.[roadmapId] || {
    completedTasks: [],
    targetDate: roadmap?.targetDate || '2026-12-31',
  };

  const completedTaskSet = useMemo(() => {
    return new Set(currentProgress.completedTasks || []);
  }, [currentProgress.completedTasks]);

  const { total, completed, percentage } = useMemo(() => {
    return getRoadmapProgress(roadmap, currentProgress.completedTasks);
  }, [roadmap, currentProgress.completedTasks]);

  if (!roadmap) {
    return (
      <div className="card text-center py-16 space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
          <Map size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Roadmap Not Found
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The requested learning roadmap does not exist or was deleted from your local storage.
          </p>
        </div>
        <Link to="/roadmaps" className="btn-primary inline-flex text-xs mx-auto">
          <ArrowLeft size={14} /> Back to My Roadmaps
        </Link>
      </div>
    );
  }

  const isCompleted = percentage === 100 && total > 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/roadmaps')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to My Roadmaps
        </button>
      </div>

      {/* Header Card */}
      <div className="card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200/50 dark:border-indigo-800/40">
              <Map size={12} />
              <span>Personalized Learning Curriculum</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              {roadmap.roleTitle} Roadmap
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              Organized into 5 progressive phases. Mark milestones as you complete tutorials, practical exercises, and interview problems.
            </p>
          </div>

          {/* Target Date Box */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-canvas-elevated border border-slate-200/80 dark:border-white/[0.08] flex flex-col items-start gap-1 min-w-[200px]">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar size={12} /> Target Completion:
            </span>
            {editingTargetDate ? (
              <div className="flex items-center gap-2 w-full mt-1">
                <input
                  type="date"
                  defaultValue={currentProgress.targetDate || roadmap.targetDate}
                  onChange={(e) => {
                    setRoadmapTargetDate(roadmap.id, e.target.value);
                    setEditingTargetDate(false);
                  }}
                  className="input-field py-1 px-2 text-xs font-mono font-medium"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mt-0.5">
                <span className="text-xs font-mono font-semibold text-slate-900 dark:text-white">
                  {currentProgress.targetDate || roadmap.targetDate || 'Set target date'}
                </span>
                <button
                  onClick={() => setEditingTargetDate(true)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium ml-2 flex items-center gap-1"
                >
                  <Edit2 size={11} /> Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Metric */}
        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <ListTodo size={13} className="text-slate-400" />
              Curriculum Progress
            </span>
            <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
              {percentage}%{' '}
              <span className="text-slate-400 dark:text-slate-500 font-normal">
                ({completed} of {total} milestones)
              </span>
            </span>
          </div>
          <ProgressBar
            value={percentage}
            color={isCompleted ? 'green' : 'blue'}
            size="md"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex bg-slate-100 dark:bg-canvas-subtle p-0.5 rounded-lg border border-slate-200 dark:border-white/[0.08]">
          <button
            onClick={() => setActiveView('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeView === 'all'
                ? 'bg-white dark:bg-canvas-elevated text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Tasks <span className="font-mono ml-1 text-slate-400">({total})</span>
          </button>
          <button
            onClick={() => setActiveView('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeView === 'pending'
                ? 'bg-white dark:bg-canvas-elevated text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pending <span className="font-mono ml-1 text-slate-400">({total - completed})</span>
          </button>
          <button
            onClick={() => setActiveView('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeView === 'completed'
                ? 'bg-white dark:bg-canvas-elevated text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Completed <span className="font-mono ml-1 text-slate-400">({completed})</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline font-mono">
          Auto-saved locally
        </span>
      </div>

      {/* 5 Distinct Phases */}
      <div className="space-y-4">
        {(roadmap.phases || []).map((phase) => {
          const tasks = (phase.tasks || []).filter((task) => {
            const isDone = completedTaskSet.has(task.id);
            if (activeView === 'pending') return !isDone;
            if (activeView === 'completed') return isDone;
            return true;
          });

          if (tasks.length === 0 && activeView !== 'all') {
            return null;
          }

          const phaseCompletedCount = (phase.tasks || []).filter((t) =>
            completedTaskSet.has(t.id)
          ).length;
          const phaseTotalCount = phase.tasks?.length || 0;
          const isPhaseDone = phaseCompletedCount === phaseTotalCount && phaseTotalCount > 0;

          return (
            <div
              key={phase.id}
              className="card p-4 sm:p-5 space-y-3.5"
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06] gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-md font-mono font-semibold text-xs flex items-center justify-center flex-shrink-0 border ${
                      isPhaseDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isPhaseDone ? <Check size={14} /> : phase.number || '•'}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {phase.description}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 self-start sm:self-auto">
                  {phaseCompletedCount}/{phaseTotalCount} completed
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2">
                {tasks.map((task) => {
                  const isTaskCompleted = completedTaskSet.has(task.id);

                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleRoadmapTask(roadmap.id, task.id)}
                      className={`group p-3 rounded-lg border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        isTaskCompleted
                          ? 'bg-slate-50/60 dark:bg-canvas-subtle/50 border-slate-200/60 dark:border-white/[0.04]'
                          : 'bg-white dark:bg-canvas-elevated border-slate-200 dark:border-white/[0.08] hover:border-indigo-300 dark:hover:border-indigo-700/60'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Custom Linear checkbox */}
                        <div
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                            isTaskCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-500 dark:group-hover:border-indigo-400'
                          }`}
                        >
                          {isTaskCompleted && <Check size={11} strokeWidth={3} />}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4
                              className={`text-xs font-semibold ${
                                isTaskCompleted
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {task.title || task.skillName}
                            </h4>
                            <span
                              className={`badge font-mono text-[10px] ${
                                task.priority === 'High'
                                  ? 'badge-red'
                                  : task.priority === 'Medium'
                                  ? 'badge-yellow'
                                  : 'badge-blue'
                              }`}
                            >
                              {task.priority} Priority
                            </span>
                          </div>

                          <p
                            className={`text-xs leading-relaxed ${
                              isTaskCompleted
                                ? 'text-slate-400 dark:text-slate-500'
                                : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {task.description}
                          </p>

                          {task.resource && (
                            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                              <a
                                href={task.resource.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
                              >
                                <BookOpen size={12} />
                                <span className="truncate max-w-[200px] sm:max-w-xs">{task.resource.title}</span>
                                <ExternalLink size={10} />
                              </a>
                              <span className="text-slate-300 dark:text-slate-600">•</span>
                              <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">
                                {task.resource.type} ({task.duration || task.resource.duration})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/[0.04] flex-shrink-0">
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock size={11} />
                          {task.duration}
                        </span>
                        <span
                          className={`text-[11px] font-medium transition-colors ${
                            isTaskCompleted
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}
                        >
                          {isTaskCompleted ? 'Completed' : 'Click to finish'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
