import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Code2,
  Building2,
  Target,
  Map,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { roles } from '../data/roles';
import { companies } from '../data/companies';
import { calculateMatch } from '../utils/matching';
import MatchBadge from '../components/ui/MatchBadge';
import ProgressBar from '../components/ui/ProgressBar';

export default function DashboardPage() {
  const {
    user,
    userSkills,
    savedRoadmaps,
    roadmapProgress,
  } = useApp();
  const navigate = useNavigate();

  // Evaluate matches across roles
  const roleMatches = useMemo(() => {
    return roles
      .map((role) => {
        const match = calculateMatch(userSkills, role);
        const comp = companies.find(
          (c) => c.roles.includes(role.id) || role.companyIds?.includes(c.id)
        );
        return {
          role,
          match,
          company: comp,
        };
      })
      .sort((a, b) => b.match.percentage - a.match.percentage);
  }, [userSkills]);

  const topMatch = roleMatches[0];
  const recommendedJobs = roleMatches.slice(0, 3);

  // Beginner / improvable skills
  const skillsToImprove = useMemo(() => {
    return userSkills.filter((s) => s.proficiency === 'Beginner');
  }, [userSkills]);

  // Aggregate roadmap progress
  const roadmapStats = useMemo(() => {
    const list = Object.values(savedRoadmaps || {});
    if (list.length === 0) return { total: 0, completed: 0, percentage: 0 };

    let totalTasks = 0;
    let completedTasks = 0;

    list.forEach((rm) => {
      (rm.phases || []).forEach((p) => {
        totalTasks += p.tasks ? p.tasks.length : 0;
      });
      const progress = roadmapProgress[rm.id];
      completedTasks += progress?.completedTasks?.length || 0;
    });

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { total: totalTasks, completed: completedTasks, percentage };
  }, [savedRoadmaps, roadmapProgress]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Welcome Card with Quick Actions */}
      <div className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Sparkles size={13} className="text-blue-600" />
              Career Matching Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || 'Candidate'} 👋
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              SkillSync matches your {userSkills.length} verified skills with real requirements from top tech employers. Keep your skills updated to see accurate career matches and personalized roadmaps.
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap sm:flex-col lg:flex-row items-center gap-3 flex-shrink-0">
            <button
              onClick={() => navigate('/skills')}
              className="btn-primary w-full sm:w-auto justify-center"
            >
              <Code2 size={16} />
              Add Skills
            </button>
            <button
              onClick={() => navigate('/matches')}
              className="btn-secondary w-full sm:w-auto justify-center border border-slate-200 dark:border-slate-600"
            >
              <Target size={16} className="text-blue-600" />
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Insights: Skill-Match Percentage & Roadmap Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top Skill Match Card */}
        <div className="card border border-slate-200 dark:border-slate-700 flex flex-col justify-between p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Overall Top Skill Match
              </span>
              <MatchBadge percentage={topMatch?.match.percentage || 0} size="md" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {topMatch?.role.title || 'Software Developer'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {topMatch?.company ? `Leading match at ${topMatch.company.name}` : 'Top industry match'} · {topMatch?.role.level}
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              You match <strong className="text-blue-600">{topMatch?.match.matchingCount}</strong> of{' '}
              {topMatch?.match.totalRequired} core requirements for this role.
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700/60">
            <button
              onClick={() => navigate(`/roles/${topMatch?.role.id || 'frontend-dev'}`)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View Detailed Gap Analysis <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Roadmap Progress Card */}
        <div className="card border border-slate-200 dark:border-slate-700 flex flex-col justify-between p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Learning Roadmap Progress
              </span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                {roadmapStats.percentage}% Complete
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {roadmapStats.completed} of {roadmapStats.total} Milestones Done
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {Object.keys(savedRoadmaps).length > 0
                  ? 'Across active target learning paths'
                  : 'Start a roadmap from any role to track your learning milestones.'}
              </p>
            </div>

            <ProgressBar value={roadmapStats.percentage} size="md" color="blue" />
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700/60">
            <Link
              to="/roadmaps"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Continue Learning Roadmap <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Recommended Jobs Section */}
      <div className="card border border-slate-200 dark:border-slate-700 space-y-4 p-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recommended Jobs for Your Stack
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Roles ranked by compatibility with your current skills.
            </p>
          </div>
          <Link
            to="/matches"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            View All ({roles.length}) <ArrowRight size={13} />
          </Link>
        </div>

        <div className="space-y-3">
          {recommendedJobs.map(({ role, match, company }) => (
            <div
              key={role.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {role.title}
                  </h4>
                  <span className="badge badge-gray text-[11px]">{role.level}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{company ? company.name : 'Tech Enterprise'}</span>
                  <span>•</span>
                  <span>{role.category}</span>
                  <span>•</span>
                  <span>{role.salaryRange}</span>
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-600">
                <MatchBadge percentage={match.percentage} size="sm" />
                <button
                  onClick={() => navigate(`/roles/${role.id}`)}
                  className="btn-primary text-xs py-1.5"
                >
                  View Requirements
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Skills to Improve Section */}
      <div className="card border border-slate-200 dark:border-slate-700 space-y-4 p-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Skills to Improve
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Level up these beginner skills to increase your role compatibility.
            </p>
          </div>
          <Link
            to="/skills"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            Manage Skills <ArrowRight size={13} />
          </Link>
        </div>

        {skillsToImprove.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm space-y-1">
            <CheckCircle2 size={28} className="mx-auto text-emerald-500 mb-1" />
            <p className="font-semibold text-slate-800 dark:text-white">
              All your skills are at Intermediate or Advanced level!
            </p>
            <p className="text-xs text-slate-400">
              Add more skills or explore advanced milestones in your roadmaps.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skillsToImprove.map((skill) => (
              <div
                key={skill.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {skill.name}
                  </h4>
                  <span className="text-xs text-amber-600 font-medium">
                    Current: Beginner
                  </span>
                </div>
                <button
                  onClick={() => navigate('/roadmaps')}
                  className="btn-ghost text-xs text-blue-600"
                >
                  <BookOpen size={14} />
                  Practice
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
