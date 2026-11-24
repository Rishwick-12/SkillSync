import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Star,
  ArrowRight,
  Briefcase,
  AlertCircle,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Sparkles,
  MapPin,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { companies } from '../data/companies';
import { roles } from '../data/roles';
import { calculateMatch, getMatchColor } from '../utils/matching';
import MatchBadge from '../components/ui/MatchBadge';
import EmptyState from '../components/ui/EmptyState';

export default function CompaniesPage() {
  const { userSkills, savedCompanies, toggleSaveCompany } = useApp();
  const navigate = useNavigate();

  // Mode: 'skills' (Find based on skills) or 'directory' (Browse full directory)
  const [activeTab, setActiveTab] = useState('skills');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minMatchPercentage, setMinMatchPercentage] = useState(0);
  const [sortBy, setSortBy] = useState('match');

  // Map roles and calculate match statistics per company
  const companyCompatibility = useMemo(() => {
    return companies.map((company) => {
      const companyRoles = roles.filter((r) =>
        company.roles.includes(r.id) || r.companyIds?.includes(company.id)
      );

      const matches = companyRoles.map((role) => ({
        role,
        match: calculateMatch(userSkills, role),
      }));

      const sortedMatches = [...matches].sort((a, b) => b.match.percentage - a.match.percentage);
      const bestMatch = sortedMatches[0] || {
        role: null,
        match: { percentage: 0, matchingCount: 0, missingRequiredSkills: [] },
      };

      const allMatchingCount = bestMatch.match.matchingCount || 0;
      const allMissingCount = bestMatch.match.missingRequiredSkills?.length || 0;

      return {
        company,
        roles: companyRoles,
        bestMatchRole: bestMatch.role,
        matchPercentage: bestMatch.match.percentage || 0,
        matchingSkillsCount: allMatchingCount,
        missingSkillsCount: allMissingCount,
      };
    });
  }, [userSkills]);

  // Filter & sort
  const filteredCompanies = useMemo(() => {
    return companyCompatibility
      .filter(({ company, matchPercentage, roles: compRoles }) => {
        const matchesQuery =
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
          compRoles.some((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesIndustry =
          selectedIndustry === 'All' || company.industry === selectedIndustry;

        const matchesCategory =
          selectedCategory === 'All' ||
          compRoles.some((r) => r.category === selectedCategory);

        const matchesMinScore = matchPercentage >= minMatchPercentage;

        return matchesQuery && matchesIndustry && matchesCategory && matchesMinScore;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.matchPercentage - a.matchPercentage;
        if (sortBy === 'name') return a.company.name.localeCompare(b.company.name);
        if (sortBy === 'rating') return (b.company.rating || 0) - (a.company.rating || 0);
        if (sortBy === 'roles') return b.roles.length - a.roles.length;
        return 0;
      });
  }, [
    companyCompatibility,
    searchQuery,
    selectedIndustry,
    selectedCategory,
    minMatchPercentage,
    sortBy,
  ]);

  const industries = useMemo(() => {
    const set = new Set(companies.map((c) => c.industry));
    return ['All', ...Array.from(set)];
  }, []);

  const categories = [
    'All',
    'Web Development',
    'Software Engineering',
    'AI & Machine Learning',
    'Cloud & DevOps',
    'Data Science',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Illustrative Disclaimer */}
      <div className="p-3.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <span className="font-semibold">Illustrative Benchmark Data:</span> Profiles, compensations, and role requirements shown represent educational career benchmarks for skill matching simulation.
        </div>
      </div>

      {/* Page Header & Segmented Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Company Discovery
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Discover technology employers with open roles matched to your current technical stack.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 dark:bg-white/[0.05] p-0.5 rounded-lg self-start sm:self-auto border border-slate-200/60 dark:border-white/[0.06]">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'skills'
                ? 'bg-white dark:bg-[#181C24] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={13} className="text-brand-500" />
            <span>Find by Skills</span>
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'directory'
                ? 'bg-white dark:bg-[#181C24] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 size={13} />
            <span>Directory</span>
          </button>
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
              placeholder="Search company or role..."
              className="input-field pl-8 py-1.5 text-xs"
            />
          </div>

          <div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="input-field py-1.5 text-xs bg-white dark:bg-[#12151B]"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  Industry: {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field py-1.5 text-xs bg-white dark:bg-[#12151B]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
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
              <option value="name">Sort: Company Name (A-Z)</option>
              <option value="rating">Sort: Glassdoor Rating</option>
              <option value="roles">Sort: Open Roles Count</option>
            </select>
          </div>
        </div>

        {/* Min Match Slider (Only active in Skills tab) */}
        {activeTab === 'skills' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.06] text-xs">
            <div className="flex items-center gap-3 w-full sm:w-80">
              <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap text-[11px]">
                Min Match %: <span className="font-mono font-semibold text-slate-900 dark:text-white">{minMatchPercentage}%</span>
              </span>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minMatchPercentage}
                onChange={(e) => setMinMatchPercentage(Number(e.target.value))}
                className="w-full accent-slate-900 dark:accent-white cursor-pointer h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none"
              />
            </div>
            <span className="text-slate-400 font-mono text-[11px]">
              Showing {filteredCompanies.length} of {companies.length} employers
            </span>
          </div>
        )}
      </div>

      {/* Company Cards Grid */}
      {filteredCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No matching companies found"
          description="Try broadening your search query or decreasing the minimum match percentage slider."
          action={
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedIndustry('All');
                setSelectedCategory('All');
                setMinMatchPercentage(0);
              }}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map(
            ({
              company,
              roles: compRoles,
              bestMatchRole,
              matchPercentage,
              matchingSkillsCount,
              missingSkillsCount,
            }) => {
              const isSaved = savedCompanies.includes(company.id);

              return (
                <div
                  key={company.id}
                  className="card card-hover flex flex-col justify-between p-4 sm:p-5 border border-slate-200/80 dark:border-white/[0.06] relative group"
                >
                  <div className="space-y-3">
                    {/* Card Top: Logo, Name, Rating, Bookmark */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center text-lg font-bold flex-shrink-0 text-slate-800 dark:text-slate-200">
                          {company.logo || company.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {company.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <span className="truncate">{company.industry}</span>
                            <span>·</span>
                            <span className="flex items-center font-mono font-medium text-amber-600 dark:text-amber-400">
                              <Star size={10} className="fill-current mr-0.5" />
                              {company.rating || '4.5'}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSaveCompany(company.id)}
                        className={`p-1.5 rounded-md border transition-all ${
                          isSaved
                            ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 border-brand-200/80 dark:border-brand-800/40'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                        }`}
                        title={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
                        aria-label={isSaved ? 'Remove from saved' : 'Save company'}
                      >
                        {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {company.description}
                    </p>

                    {/* Skill Match Box */}
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400 uppercase">
                          Top Role Match
                        </span>
                        <MatchBadge percentage={matchPercentage} size="sm" />
                      </div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {bestMatchRole?.title || 'Open Positions'}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/60 dark:border-white/[0.06]">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {matchingSkillsCount} Skills Possessed
                        </span>
                        <span className="text-slate-400">
                          {missingSkillsCount} Gaps
                        </span>
                      </div>
                    </div>

                    {/* Meta Info Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge badge-gray text-[10px]">
                        <Briefcase size={10} className="mr-1" />
                        {compRoles.length} Open Roles
                      </span>
                      <span className="badge badge-gray text-[10px]">
                        <Users size={10} className="mr-1" />
                        {company.size || '10,000+'}
                      </span>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] mt-3">
                    <button
                      onClick={() => navigate(`/companies/${company.id}`)}
                      className="btn-secondary w-full py-1.5 text-xs gap-1.5"
                    >
                      <span>Explore Roles</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
