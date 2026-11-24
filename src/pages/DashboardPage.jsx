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
  ChevronRight,
  TrendingUp,
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
          (c) => (c.roles || []).includes(role.id) || role.companyIds?.includes(c.id)
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
      {/* 1. Welcome Card with Minimalist Header */}
      <div className="card p-6 sm:p-7 border border-slate-200/80 dark:border-white/[0.08] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-medium border border-brand-200/60 dark:border-brand-800/40">
              <Sparkles size={12} className="text-brand-500" />
              <span>Career Matching Overview</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || 'Candidate'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              SkillSync matches your <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{userSkills.length}</span> verified skills against real requirements from leading engineering teams.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => navigate('/skills')}
              className="btn-primary text-xs px-3.5 py-2 gap-1.5"
            >
              <Code2 size={14} />
              <span>Manage Skills</span>
            </button>
            <button
              onClick={() => navigate('/matches')}
              className="btn-secondary text-xs px-3.5 py-2 gap-1.5"
            >
              <Target size={14} className="text-brand-600 dark:text-brand-400" />
              <span>Explore Roles</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Compact 4-Column Stat Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card p-4 space-y-1">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Total Skills
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold font-mono tracking-tight text-slate-900 dark:text-white">
              {userSkills.length}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
          </div>
        </div>

        <div className="card p-4 space-y-1">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Best Match
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold font-mono tracking-tight text-brand-600 dark:text-brand-400">
              {Math.round(topMatch?.match.percentage || 0)}%
            </span>
            <span className="text-xs text-slate-500 truncate max-w-[90px]">{topMatch?.role.title}</span>
          </div>
        </div>

        <div className="card p-4 space-y-1">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Roadmap Progress
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold font-mono tracking-tight text-slate-900 dark:text-white">
              {roadmapStats.percentage}%
            </span>
            <span className="text-xs text-slate-500 font-mono">{roadmapStats.completed}/{roadmapStats.total}</span>
          </div>
        </div>

        <div className="card p-4 space-y-1">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            To Improve
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {skillsToImprove.length}
            </span>
            <span className="text-xs text-slate-500">Beginner</span>
          </div>
        </div>
      </div>

      {/* 3. Key Insights: Skill-Match Percentage & Roadmap Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top Skill Match Card */}
        <div className="card flex flex-col justify-between p-5 sm:p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                Top Compatible Role
              </span>
              <MatchBadge percentage={topMatch?.match.percentage || 0} size="sm" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                {topMatch?.role.title || 'Software Developer'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {topMatch?.company ? `Top match at ${topMatch.company.name}` : 'Top industry match'} · {topMatch?.role.level}
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You match <span className="font-semibold text-slate-900 dark:text-white font-mono">{topMatch?.match.matchingCount}</span> of{' '}
              <span className="font-semibold text-slate-900 dark:text-white font-mono">{topMatch?.match.totalRequired}</span> core requirements for this position.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06]">
            <button
              onClick={() => navigate(`/roles/${topMatch?.role.id || 'frontend-dev'}`)}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>View Gap Analysis</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Roadmap Progress Card */}
        <div className="card flex flex-col justify-between p-5 sm:p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                Learning Progress
              </span>
              <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                {roadmapStats.percentage}% Complete
              </span>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                {roadmapStats.completed} of {roadmapStats.total} Milestones Done
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {Object.keys(savedRoadmaps || {}).length > 0
                  ? 'Across active target learning curricula'
                  : 'Start a roadmap from any role to track your learning milestones.'}
              </p>
            </div>

            <ProgressBar value={roadmapStats.percentage} size="sm" color="blue" />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06]">
            <Link
              to="/roadmaps"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>Continue Learning Curriculum</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recommended Jobs Section */}
      <div className="card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
              Recommended Jobs for Your Stack
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked by compatibility with your current skills.
            </p>
          </div>
          <Link
            to="/matches"
            className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({roles.length})</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-2.5">
          {recommendedJobs.map(({ role, match, company }) => (
            <div
              key={role.id}
              className="p-3.5 rounded-lg border border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.12] bg-white dark:bg-[#12151B] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {role.title}
                  </h4>
                  <span className="badge badge-gray text-[10px]">{role.level}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{company ? company.name : 'Tech Enterprise'}</span>
                  <span className="text-slate-300 dark:text-white/20">·</span>
                  <span>{role.category}</span>
                  <span className="text-slate-300 dark:text-white/20">·</span>
                  <span className="font-mono">{role.salaryRange}</span>
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/[0.06]">
                <MatchBadge percentage={match.percentage} size="sm" />
                <button
                  onClick={() => navigate(`/roles/${role.id}`)}
                  className="btn-secondary text-xs px-3 py-1.5 gap-1"
                >
                  <span>Inspect</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Skills to Improve Section */}
      <div className="card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
              Skills to Improve
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Level up beginner skills to increase your role compatibility.
            </p>
          </div>
          <Link
            to="/skills"
            className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Manage Skills</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {skillsToImprove.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs space-y-1">
            <CheckCircle2 size={22} className="mx-auto text-emerald-500 mb-1" />
            <p className="font-semibold text-slate-800 dark:text-white">
              All skills verified at Intermediate or Advanced!
            </p>
            <p className="text-slate-400">
              Add more skills or explore advanced milestones in your roadmaps.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {skillsToImprove.map((skill) => (
              <div
                key={skill.id}
                className="p-3 rounded-lg border border-slate-200/80 dark:border-white/[0.06] bg-white dark:bg-[#12151B] flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {skill.name}
                  </h4>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    Current: Beginner
                  </span>
                </div>
                <button
                  onClick={() => navigate('/roadmaps')}
                  className="btn-ghost text-xs p-1 text-brand-600 dark:text-brand-400"
                  aria-label={`Practice ${skill.name}`}
                >
                  <BookOpen size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
