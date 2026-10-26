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
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'name' | 'rating' | 'roles'

  // Map roles and calculate match statistics per company
  const companyCompatibility = useMemo(() => {
    return companies.map((company) => {
      // Find role objects for this company
      const companyRoles = roles.filter((r) =>
        company.roles.includes(r.id) || r.companyIds?.includes(company.id)
      );

      // Compute match for each role
      const matches = companyRoles.map((role) => ({
        role,
        match: calculateMatch(userSkills, role),
      }));

      // Top role match for this company
      const sortedMatches = [...matches].sort((a, b) => b.match.percentage - a.match.percentage);
      const bestMatch = sortedMatches[0] || {
        role: null,
        match: { percentage: 0, matchingCount: 0, missingRequiredSkills: [] },
      };

      // Aggregated skills overlap across company roles
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
    <div className="space-y-6">
      {/* Illustrative Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <span className="font-bold">Illustrative Mock Hiring Data:</span> All company profiles, salary figures, and job requirements displayed on SkillSync represent simulated educational demo benchmarks, not real-time or verified hiring commitments from these organizations.
        </div>
      </div>

      {/* Page Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Company Discovery
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Discover tech employers hiring for roles that align with your current and target skillset.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'skills'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles size={14} />
            Find by Skills
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'directory'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 size={14} />
            Browse Directory
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company or role..."
              className="input-field pl-9 py-2 text-xs"
            />
          </div>

          {/* Industry Filter */}
          <div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="input-field py-2 text-xs"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  Industry: {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Job Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field py-2 text-xs"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-2 text-xs"
            >
              <option value="match">Sort: Highest Match %</option>
              <option value="name">Sort: Company Name (A-Z)</option>
              <option value="rating">Sort: Glassdoor Rating</option>
              <option value="roles">Sort: Most Roles Open</option>
            </select>
          </div>
        </div>

        {/* Min Match Slider (Only active in Skills tab) */}
        {activeTab === 'skills' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-80">
              <span className="text-slate-500 font-medium whitespace-nowrap">
                Min Match %: <strong className="text-blue-600">{minMatchPercentage}%</strong>
              </span>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minMatchPercentage}
                onChange={(e) => setMinMatchPercentage(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
            <span className="text-slate-400">
              Showing {filteredCompanies.length} of {companies.length} companies
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
              className="btn-secondary text-xs"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  className="card card-hover flex flex-col justify-between border border-slate-200/80 dark:border-slate-700 relative group"
                >
                  <div>
                    {/* Card Top: Logo, Name, Bookmark */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold border border-indigo-100 dark:border-slate-600 flex-shrink-0">
                          {company.logo || company.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 transition-colors">
                            {company.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{company.industry}</span>
                            <span>•</span>
                            <span className="flex items-center text-amber-500 font-semibold">
                              <Star size={12} className="fill-amber-400 mr-0.5" />
                              {company.rating || '4.5'}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSaveCompany(company.id)}
                        className={`p-2 rounded-xl border transition-all ${
                          isSaved
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-indigo-200 dark:border-indigo-800'
                            : 'text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                        title={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
                      >
                        {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                      {company.description}
                    </p>

                    {/* Skill-Based Match Indicator Banner */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Top Role Match:
                        </span>
                        <MatchBadge percentage={matchPercentage} size="sm" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {bestMatchRole?.title || 'Open Positions'}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-600/60">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 size={12} /> {matchingSkillsCount} Skills Possessed
                        </span>
                        <span className="text-slate-400">
                          {missingSkillsCount} Gaps
                        </span>
                      </div>
                    </div>

                    {/* Meta info tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="badge badge-gray text-[11px]">
                        <Briefcase size={10} className="mr-1" />
                        {compRoles.length} Available Roles
                      </span>
                      <span className="badge badge-gray text-[11px]">
                        <Users size={10} className="mr-1" />
                        {company.size || '10,000+'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                    <button
                      onClick={() => navigate(`/companies/${company.id}`)}
                      className="btn-primary w-full justify-center text-xs"
                    >
                      View Details & Roles
                      <ArrowRight size={14} />
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
