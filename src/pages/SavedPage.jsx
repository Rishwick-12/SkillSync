import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bookmark,
  Building2,
  Target,
  Map,
  Trash2,
  ArrowRight,
  Sparkles,
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { companies } from '../data/companies';
import { roles } from '../data/roles';
import { calculateMatch, categorizeSkills } from '../utils/matching';
import MatchBadge from '../components/ui/MatchBadge';
import EmptyState from '../components/ui/EmptyState';

export default function SavedPage() {
  const {
    savedCompanies,
    toggleSaveCompany,
    savedRoles,
    toggleSaveRole,
    savedRoadmaps,
    deleteRoadmap,
    userSkills,
  } = useApp();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('roles'); // 'roles' | 'companies' | 'roadmaps' | 'compare'
  const [selectedRoleIdsToCompare, setSelectedRoleIdsToCompare] = useState(() => {
    return savedRoles.slice(0, 3);
  });

  // Resolve saved companies
  const savedCompanyList = useMemo(() => {
    return companies.filter((c) => savedCompanies.includes(c.id));
  }, [savedCompanies]);

  // Resolve saved roles with matches
  const savedRoleList = useMemo(() => {
    return roles
      .filter((r) => savedRoles.includes(r.id))
      .map((role) => ({
        role,
        match: calculateMatch(userSkills, role),
      }));
  }, [savedRoles, userSkills]);

  const savedRoadmapList = Object.values(savedRoadmaps || {});

  // Toggle role in compare set (up to 3)
  const toggleRoleComparison = (roleId) => {
    setSelectedRoleIdsToCompare((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 roles at a time.');
        return prev;
      }
      return [...prev, roleId];
    });
  };

  const comparedRolesData = useMemo(() => {
    return selectedRoleIdsToCompare
      .map((roleId) => {
        const role = roles.find((r) => r.id === roleId);
        if (!role) return null;
        const match = calculateMatch(userSkills, role);
        const { have, improve, missing } = categorizeSkills(userSkills, role);
        return {
          role,
          match,
          have,
          improve,
          missing,
        };
      })
      .filter(Boolean);
  }, [selectedRoleIdsToCompare, userSkills]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Saved Items
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access bookmarked opportunities, track saved employers, review roadmaps, and compare role requirements side by side.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 dark:bg-canvas-subtle p-0.5 rounded-lg self-start sm:self-auto border border-slate-200 dark:border-white/[0.08]">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'roles'
                ? 'bg-white dark:bg-canvas-elevated text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Roles <span className="font-mono text-slate-400 ml-1">({savedRoles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'companies'
                ? 'bg-white dark:bg-canvas-elevated text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Companies <span className="font-mono text-slate-400 ml-1">({savedCompanies.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'roadmaps'
                ? 'bg-white dark:bg-canvas-elevated text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Roadmaps <span className="font-mono text-slate-400 ml-1">({savedRoadmapList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'compare'
                ? 'bg-white dark:bg-canvas-elevated text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GitCompare size={12} />
            Compare <span className="font-mono text-slate-400 ml-0.5">({selectedRoleIdsToCompare.length})</span>
          </button>
        </div>
      </div>

      {/* Tab: Saved Roles */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          {savedRoleList.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No Saved Job Roles"
              description="Explore matching roles and click the bookmark icon to save roles for quick reference or comparison."
              action={
                <Link to="/matches" className="btn-primary text-xs">
                  <Sparkles size={14} /> Explore Matching Roles
                </Link>
              }
            />
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Select up to 3 roles to compare side-by-side</span>
                <button
                  onClick={() => setActiveTab('compare')}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5"
                >
                  <GitCompare size={13} /> Open Comparison Matrix
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedRoleList.map(({ role, match }) => {
                  const isCheckedForCompare = selectedRoleIdsToCompare.includes(role.id);

                  return (
                    <div
                      key={role.id}
                      className="card card-hover flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="badge badge-purple text-[10px] mb-1.5">
                              {role.category}
                            </span>
                            <h3 className="font-semibold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                              {role.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {role.level} · {role.salaryRange}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <MatchBadge percentage={match.percentage} size="sm" />
                            <button
                              onClick={() => toggleSaveRole(role.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Remove from saved"
                              aria-label="Remove from saved"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {role.description}
                        </p>

                        <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100 dark:border-white/[0.06]">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isCheckedForCompare}
                              onChange={() => toggleRoleComparison(role.id)}
                              className="rounded text-indigo-600 accent-indigo-600 w-3.5 h-3.5 cursor-pointer"
                            />
                            <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                              Compare
                            </span>
                          </label>

                          <button
                            onClick={() => navigate(`/roles/${role.id}`)}
                            className="btn-ghost text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-1"
                          >
                            Details <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved Companies */}
      {activeTab === 'companies' && (
        <div>
          {savedCompanyList.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No Saved Companies"
              description="Bookmark companies from the directory to monitor open vacancies and hiring tracks."
              action={
                <Link to="/companies" className="btn-primary text-xs">
                  <Building2 size={14} /> Browse Companies
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCompanyList.map((company) => (
                <div
                  key={company.id}
                  className="card card-hover flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-canvas-subtle border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-lg font-bold flex-shrink-0">
                          {company.logo || company.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {company.name}
                          </h4>
                          <span className="text-xs text-slate-400 dark:text-slate-500 truncate block">
                            {company.industry}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSaveCompany(company.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                        title="Remove bookmark"
                        aria-label="Remove bookmark"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {company.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                      {company.roles?.length || 0} tracked roles
                    </span>
                    <button
                      onClick={() => navigate(`/companies/${company.id}`)}
                      className="btn-secondary text-xs py-1"
                    >
                      View Company <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved Roadmaps */}
      {activeTab === 'roadmaps' && (
        <div>
          {savedRoadmapList.length === 0 ? (
            <EmptyState
              icon={Map}
              title="No Saved Roadmaps"
              description="Generate personalized roadmaps from any role analysis to track learning milestones."
              action={
                <Link to="/matches" className="btn-primary text-xs">
                  <Sparkles size={14} /> Explore Roles & Roadmaps
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedRoadmapList.map((rm) => (
                <div
                  key={rm.id}
                  className="card card-hover flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {rm.roleTitle}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          5 Phases · Target: {rm.targetDate || 'Flexible'}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteRoadmap(rm.id)}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete roadmap"
                        aria-label="Delete roadmap"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/[0.06] flex justify-end">
                    <button
                      onClick={() => navigate(`/roadmaps/${rm.id}`)}
                      className="btn-secondary text-xs group-hover:border-indigo-200 dark:group-hover:border-indigo-800"
                    >
                      Open Roadmap <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Compare Up to 3 Roles */}
      {activeTab === 'compare' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Side-by-Side Role Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluating <span className="font-mono">{comparedRolesData.length}</span> of 3 maximum roles against your profile.
              </p>
            </div>

            {/* Quick selector dropdown to add roles to comparison */}
            {comparedRolesData.length < 3 && (
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      toggleRoleComparison(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="input-field py-1 px-2.5 text-xs max-w-xs"
                  defaultValue=""
                >
                  <option value="" disabled>
                    + Add Role to Comparison...
                  </option>
                  {roles
                    .filter((r) => !selectedRoleIdsToCompare.includes(r.id))
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.category})
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {comparedRolesData.length === 0 ? (
            <EmptyState
              icon={GitCompare}
              title="No Roles Selected for Comparison"
              description="Choose up to 3 roles from your saved list or the dropdown above to contrast skill requirements."
            />
          ) : (
            <div className="card overflow-x-auto p-0 border border-slate-200 dark:border-white/[0.08]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-canvas-subtle border-b border-slate-200 dark:border-white/[0.08]">
                    <th className="p-3.5 w-44 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider text-[11px]">
                      Metric
                    </th>
                    {comparedRolesData.map(({ role }) => (
                      <th
                        key={role.id}
                        className="p-3.5 min-w-[220px] text-slate-900 dark:text-white font-semibold text-sm border-l border-slate-200 dark:border-white/[0.08]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="block truncate font-semibold">{role.title}</span>
                            <span className="text-xs font-normal text-slate-400 dark:text-slate-500 font-mono">
                              {role.category} · {role.level}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleRoleComparison(role.id)}
                            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                            title="Remove from comparison"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                  {/* Row: Match Percentage */}
                  <tr>
                    <td className="p-3.5 font-medium text-slate-600 dark:text-slate-300 bg-slate-50/40 dark:bg-canvas-subtle/30">
                      Match Compatibility
                    </td>
                    {comparedRolesData.map(({ role, match }) => (
                      <td key={role.id} className="p-3.5 border-l border-slate-200 dark:border-white/[0.08]">
                        <MatchBadge percentage={match.percentage} size="md" />
                      </td>
                    ))}
                  </tr>

                  {/* Row: Salary Range */}
                  <tr>
                    <td className="p-3.5 font-medium text-slate-600 dark:text-slate-300 bg-slate-50/40 dark:bg-canvas-subtle/30">
                      Comp / Salary Range
                    </td>
                    {comparedRolesData.map(({ role }) => (
                      <td key={role.id} className="p-3.5 font-mono font-medium text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-white/[0.08]">
                        {role.salaryRange}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Total Core Skills Required */}
                  <tr>
                    <td className="p-3.5 font-medium text-slate-600 dark:text-slate-300 bg-slate-50/40 dark:bg-canvas-subtle/30">
                      Total Required Skills
                    </td>
                    {comparedRolesData.map(({ role }) => (
                      <td key={role.id} className="p-3.5 font-mono text-slate-700 dark:text-slate-300 border-l border-slate-200 dark:border-white/[0.08]">
                        {role.requiredSkills.length} Core Skills
                      </td>
                    ))}
                  </tr>

                  {/* Row: Matching Skills You Have */}
                  <tr>
                    <td className="p-3.5 font-medium text-emerald-700 dark:text-emerald-400 bg-slate-50/40 dark:bg-canvas-subtle/30">
                      Matching Skills ({userSkills.length})
                    </td>
                    {comparedRolesData.map(({ role, have }) => (
                      <td key={role.id} className="p-3.5 border-l border-slate-200 dark:border-white/[0.08] align-top">
                        <div className="flex flex-wrap gap-1">
                          {have.length === 0 ? (
                            <span className="text-slate-400 dark:text-slate-500 italic">None currently met</span>
                          ) : (
                            have.map((s) => (
                              <span
                                key={s.skillId}
                                className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 text-[11px] font-medium"
                              >
                                {s.name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Skills to Improve */}
                  <tr>
                    <td className="p-3.5 font-medium text-amber-700 dark:text-amber-400 bg-slate-50/40 dark:bg-canvas-subtle/30">
                      Needs Practice
                    </td>
                    {comparedRolesData.map(({ role, improve }) => (
                      <td key={role.id} className="p-3.5 border-l border-slate-200 dark:border-white/[0.08] align-top">
                        <div className="flex flex-wrap gap-1">
                          {improve.length === 0 ? (
                            <span className="text-slate-400 dark:text-slate-500 italic">None</span>
                          ) : (
                            improve.map((s) => (
                              <span
                                key={s.skillId}
                                className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40 text-[11px] font-medium"
                              >
                                {s.name} <span className="font-mono text-[10px]">({s.userProficiency} → {s.proficiency})</span>
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Missing Skills */}
                  <tr>
                    <td className="p-3.5 font-medium text-rose-700 dark:text-rose-400 bg-slate-50/40 dark:bg-canvas-subtle/30">
                      Missing Gaps
                    </td>
                    {comparedRolesData.map(({ role, missing }) => (
                      <td key={role.id} className="p-3.5 border-l border-slate-200 dark:border-white/[0.08] align-top">
                        <div className="flex flex-wrap gap-1">
                          {missing.length === 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                              <CheckCircle2 size={12} /> None missing
                            </span>
                          ) : (
                            missing.map((s) => (
                              <span
                                key={s.skillId}
                                className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/40 text-[11px] font-medium"
                              >
                                {s.name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Actions */}
                  <tr>
                    <td className="p-3.5 font-medium text-slate-600 dark:text-slate-300 bg-slate-50/40 dark:bg-canvas-subtle/30">
                      Action
                    </td>
                    {comparedRolesData.map(({ role }) => (
                      <td key={role.id} className="p-3.5 border-l border-slate-200 dark:border-white/[0.08]">
                        <button
                          onClick={() => navigate(`/roles/${role.id}`)}
                          className="btn-primary text-xs w-full justify-center"
                        >
                          View Gap Analysis
                          <ArrowRight size={12} />
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
