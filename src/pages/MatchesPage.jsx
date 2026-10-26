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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Recommended Roles
            <span className="badge badge-blue">{filteredRoles.length} Matches</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Browse jobs ranked by how well your current skills match their core requirements.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role or skill..."
              className="input-field pl-9 py-2 text-xs"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field py-2 text-xs"
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
              className="input-field py-2 text-xs"
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
              className="input-field py-2 text-xs"
            >
              <option value="match">Sort: Highest Match %</option>
              <option value="title">Sort: Role Title (A-Z)</option>
              <option value="level">Sort: Experience Level</option>
            </select>
          </div>
        </div>

        {/* Min match slider */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <div className="flex items-center gap-3 w-full sm:w-80">
            <span className="text-slate-500 font-medium whitespace-nowrap">
              Minimum Match: <strong className="text-blue-600">{minMatch}%</strong>
            </span>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
          <span className="text-slate-400">
            Showing {filteredRoles.length} of {roles.length} available roles
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
              className="btn-secondary text-xs"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredRoles.map(({ role, match, offeringCompanies }) => {
            const isSaved = savedRoles.includes(role.id);

            return (
              <div
                key={role.id}
                className="card card-hover border border-slate-200 dark:border-slate-700 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {role.title}
                      </h3>
                      <span className="badge badge-gray text-[11px]">{role.level}</span>
                      <span className="badge badge-blue text-[11px]">{role.category}</span>
                    </div>

                    <button
                      onClick={() => toggleSaveRole(role.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isSaved
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 border-blue-200 dark:border-blue-800'
                          : 'text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title={isSaved ? 'Saved to Bookmarks' : 'Save Role'}
                    >
                      {isSaved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {role.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mr-1">
                      <CheckCircle2 size={12} /> Matching ({match.matchingCount}):
                    </span>
                    {match.matchingRequiredSkills.slice(0, 4).map((s) => (
                      <span
                        key={s.skillId}
                        className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800"
                      >
                        {s.name}
                      </span>
                    ))}
                    {match.matchingRequiredSkills.length > 4 && (
                      <span className="text-[11px] text-slate-400">
                        +{match.matchingRequiredSkills.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Companies Offering */}
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                    <Building2 size={13} className="text-slate-400" />
                    <span>Hiring at:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {offeringCompanies.slice(0, 3).map((c) => c.name).join(', ')}
                      {offeringCompanies.length > 3 ? ` +${offeringCompanies.length - 3}` : ''}
                    </span>
                  </div>
                </div>

                {/* Score & Button */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-700">
                  <div className="text-right">
                    <MatchBadge percentage={match.percentage} size="md" />
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {match.matchingCount} of {match.totalRequired} skills met
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/roles/${role.id}`)}
                    className="btn-primary text-xs"
                  >
                    View Gap Analysis
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
