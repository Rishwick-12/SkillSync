import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { roles } from '../data/roles';
import { companies } from '../data/companies';
import { calculateMatch } from '../utils/matching';
import MatchBadge from '../components/ui/MatchBadge';
import EmptyState from '../components/ui/EmptyState';

export default function MatchesPage() {
  const { userSkills, savedRoles, toggleSaveRole } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [minMatch, setMinMatch] = useState(0);
  const [sortBy, setSortBy] = useState('match');

  // Calculate compatibility for all roles
  const evaluatedRoles = useMemo(() => {
    return roles.map((role) => {
      const match = calculateMatch(userSkills, role);
      const offeringCompanies = companies.filter((c) =>
        c.roles.includes(role.id) || role.companyIds?.includes(c.id)
      );

      return {
        role,
        match,
        offeringCompanies,
      };
    });
  }, [userSkills]);

  // Filter & Sort
  const filteredRoles = useMemo(() => {
    return evaluatedRoles
      .filter(({ role, match }) => {
        const matchesQuery =
          role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.requiredSkills.some((s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

        const matchesCategory =
          selectedCategory === 'All' || role.category === selectedCategory;

        const matchesLevel =
          selectedLevel === 'All' || role.level === selectedLevel;

        const matchesScore = match.percentage >= minMatch;

        return matchesQuery && matchesCategory && matchesLevel && matchesScore;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.match.percentage - a.match.percentage;
        if (sortBy === 'title') return a.role.title.localeCompare(b.role.title);
        if (sortBy === 'level') return a.role.level.localeCompare(b.role.level);
        return 0;
      });
  }, [evaluatedRoles, searchQuery, selectedCategory, selectedLevel, minMatch, sortBy]);

  const categories = [
    'All',
    'Web Development',
    'Software Engineering',
    'AI & Machine Learning',
    'Cloud & DevOps',
    'Data Science',
    'Mobile Development',
    'Product & Design',
    'Cybersecurity',
  ];

  const levels = ['All', 'Entry Level', 'Mid Level', 'Senior Level'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Recommended Roles
            </h1>
            <span className="badge badge-gray font-mono text-[11px]">
              {filteredRoles.length} Matches
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Engineering positions ranked by compatibility with your current verified skill profile.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role or skill..."
              className="input-field pl-8 py-1.5 text-xs"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field py-1.5 text-xs bg-white dark:bg-[#12151B]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="input-field py-1.5 text-xs bg-white dark:bg-[#12151B]"
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  Level: {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-1.5 text-xs bg-white dark:bg-[#12151B]"
            >
              <option value="match">Sort: Highest Match %</option>
              <option value="title">Sort: Role Title (A-Z)</option>
              <option value="level">Sort: Experience Level</option>
            </select>
          </div>
        </div>

        {/* Min Match Slider */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.06] text-xs">
          <div className="flex items-center gap-3 w-full sm:w-80">
            <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap text-[11px]">
              Min Match: <span className="font-mono font-semibold text-slate-900 dark:text-white">{minMatch}%</span>
            </span>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="w-full accent-slate-900 dark:accent-white cursor-pointer h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none"
            />
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            {filteredRoles.length} of {roles.length} available roles
          </span>
        </div>
      </div>

      {/* Role Cards List */}
      {filteredRoles.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No role matches found"
          description="Try reducing your minimum match filter or add more skills to your profile."
          action={
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All');
                setMinMatch(0);
              }}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredRoles.map(({ role, match, offeringCompanies }) => {
            const isSaved = savedRoles.includes(role.id);

            return (
              <div
                key={role.id}
                className="card card-hover p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-slate-200/80 dark:border-white/[0.06]"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                        {role.title}
                      </h3>
                      <span className="badge badge-gray text-[10px]">{role.level}</span>
                      <span className="badge badge-blue text-[10px]">{role.category}</span>
                    </div>

                    <button
                      onClick={() => toggleSaveRole(role.id)}
                      className={`p-1.5 rounded-md border transition-all ${
                        isSaved
                          ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 border-brand-200/80 dark:border-brand-800/40'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                      }`}
                      title={isSaved ? 'Saved to Bookmarks' : 'Save Role'}
                      aria-label={isSaved ? 'Remove from saved' : 'Save role'}
                    >
                      {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mr-1 font-mono">
                      <CheckCircle2 size={12} /> Matching ({match.matchingCount}):
                    </span>
                    {match.matchingRequiredSkills.slice(0, 4).map((s) => (
                      <span
                        key={s.skillId}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40 font-medium"
                      >
                        {s.name}
                      </span>
                    ))}
                    {match.matchingRequiredSkills.length > 4 && (
                      <span className="text-[10px] font-mono text-slate-400">
                        +{match.matchingRequiredSkills.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Companies Offering */}
                  <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    <Building2 size={12} className="text-slate-400" />
                    <span>Hiring at:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {offeringCompanies.slice(0, 3).map((c) => c.name).join(', ')}
                      {offeringCompanies.length > 3 ? ` +${offeringCompanies.length - 3}` : ''}
                    </span>
                  </div>
                </div>

                {/* Score & Button */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-white/[0.06]">
                  <div className="text-right">
                    <MatchBadge percentage={match.percentage} size="sm" />
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {match.matchingCount} of {match.totalRequired} skills met
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/roles/${role.id}`)}
                    className="btn-primary text-xs px-3 py-1.5 gap-1"
                  >
                    <span>Gap Analysis</span>
                    <ArrowRight size={12} />
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
