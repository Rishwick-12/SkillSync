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
      <div className="card text-center py-16 space-y-4 max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Roadmap Not Found
        </h2>
        <p className="text-slate-500 text-sm">
          The requested learning roadmap does not exist or was deleted.
        </p>
        <Link to="/roadmaps" className="btn-primary inline-flex text-xs">
          <ArrowLeft size={16} /> Back to My Roadmaps
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/roadmaps')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={14} /> Back to My Roadmaps
        </button>
      </div>

      {/* Header Card */}
      <div className="card border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Map size={13} className="text-blue-600" />
              Personalized Learning Curriculum
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {roadmap.roleTitle} Roadmap
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Organized into 5 progressive phases. Check off each task as you complete the curated tutorials and practical exercises.
            </p>
          </div>

          {/* Target Date Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex flex-col items-start gap-1 min-w-[200px]">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar size={13} /> Target Completion:
            </span>
            {editingTargetDate ? (
              <div className="flex items-center gap-2 w-full mt-0.5">
                <input
                  type="date"
                  defaultValue={currentProgress.targetDate || roadmap.targetDate}
                  onChange={(e) => {
                    setRoadmapTargetDate(roadmap.id, e.target.value);
                    setEditingTargetDate(false);
                  }}
                  className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 w-full font-medium"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-slate-800 dark:text-white">
                  {currentProgress.targetDate || roadmap.targetDate || 'Set target date'}
                </span>
                <button
                  onClick={() => setEditingTargetDate(true)}
                  className="text-xs text-blue-600 font-semibold hover:underline ml-2"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Metric */}
        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">
              Curriculum Progress:
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
              {percentage}% Complete ({completed} of {total} milestones)
            </span>
          </div>
          <ProgressBar value={percentage} color="blue" size="md" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveView('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'all'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All Tasks ({total})
          </button>
          <button
            onClick={() => setActiveView('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'pending'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pending ({total - completed})
          </button>
          <button
            onClick={() => setActiveView('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'completed'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Completed ({completed})
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Progress auto-saves to your browser
        </span>
      </div>

      {/* 5 Distinct Phases */}
      <div className="space-y-5">
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

          return (
            <div
              key={phase.id}
              className="card border border-slate-200 dark:border-slate-700 p-5 space-y-4"
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60 gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {phase.number || '•'}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {phase.description}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-500">
                  {phaseCompletedCount} / {phase.tasks?.length || 0} completed
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5">
                {tasks.map((task) => {
                  const isCompleted = completedTaskSet.has(task.id);

                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleRoadmapTask(roadmap.id, task.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all flex-shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                          }`}
                        >
                          {isCompleted && <Check size={13} />}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                isCompleted
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {task.title || task.skillName}
                            </h4>
                            <span
                              className={`badge text-[10px] ${
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

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {task.description}
                          </p>

                          {task.resource && (
                            <div className="pt-0.5 flex items-center gap-3 text-xs">
                              <a
                                href={task.resource.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                <BookOpen size={12} />
                                {task.resource.title}
                                <ExternalLink size={10} />
                              </a>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-400 text-[11px]">
                                {task.resource.type} ({task.duration || task.resource.duration})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700/60 flex-shrink-0">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={12} />
                          {task.duration}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            isCompleted
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {isCompleted ? 'Completed' : 'Click to finish'}
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
