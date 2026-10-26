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
  Star,
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
    return selectedRoleIdsToCompare.map((roleId) => {
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
    }).filter(Boolean);
  }, [selectedRoleIdsToCompare, userSkills]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Saved Items
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Access your bookmarked employers, target roles, generated roadmaps, and compare requirements side by side.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roles'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Roles ({savedRoles.length})
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'companies'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Companies ({savedCompanies.length})
          </button>
          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roadmaps'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Roadmaps ({savedRoadmapList.length})
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeTab === 'compare'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <GitCompare size={13} />
            Compare ({selectedRoleIdsToCompare.length})
          </button>
        </div>
      </div>

      {/* Tab: Saved Roles */}
      {activeTab === 'roles' && (
        <div>
          {savedRoleList.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No Saved Job Roles"
              description="Explore matching roles and click the bookmark icon to save roles for quick reference or comparison."
              action={
                <Link to="/matches" className="btn-primary">
                  Explore Matching Roles
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Select up to 3 roles to compare side by side</span>
                <button
                  onClick={() => setActiveTab('compare')}
                  className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <GitCompare size={14} /> Open Side-by-Side Comparison
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedRoleList.map(({ role, match }) => {
                  const isCheckedForCompare = selectedRoleIdsToCompare.includes(role.id);

                  return (
                    <div
                      key={role.id}
                      className="card card-hover border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="badge badge-purple text-[10px] mb-1">
                              {role.category}
                            </span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">
                              {role.title}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {role.level} · {role.salaryRange}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <MatchBadge percentage={match.percentage} size="sm" />
                            <button
                              onClick={() => toggleSaveRole(role.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Remove from saved"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {role.description}
                        </p>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isCheckedForCompare}
                              onChange={() => toggleRoleComparison(role.id)}
                              className="rounded text-indigo-600 accent-indigo-600"
                            />
                            <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                              Select for Comparison
                            </span>
                          </label>

                          <button
                            onClick={() => navigate(`/roles/${role.id}`)}
                            className="btn-ghost text-xs text-indigo-600"
                          >
                            Details <ArrowRight size={13} />
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
                <Link to="/companies" className="btn-primary">
                  Browse Companies
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCompanyList.map((company) => (
                <div
                  key={company.id}
                  className="card card-hover border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-xl font-bold">
                          {company.logo || company.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {company.name}
                          </h4>
                          <span className="text-xs text-slate-400">{company.industry}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSaveCompany(company.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Remove bookmark"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {company.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{company.roles?.length || 0} tracked roles</span>
                    <button
                      onClick={() => navigate(`/companies/${company.id}`)}
                      className="btn-primary text-xs py-1.5"
                    >
                      View Company <ArrowRight size={13} />
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
                <Link to="/matches" className="btn-primary">
                  Explore Roles & Roadmaps
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedRoadmapList.map((rm) => (
                <div
                  key={rm.id}
                  className="card card-hover border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {rm.roleTitle}
                      </h4>
                      <button
                        onClick={() => deleteRoadmap(rm.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      5-Phase Personalized Curriculum · Target: {rm.targetDate || '60 Days'}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                    <button
                      onClick={() => navigate(`/roadmaps/${rm.id}`)}
                      className="btn-primary text-xs"
                    >
                      Open Roadmap <ArrowRight size={13} />
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
              <h3 className="section-title">Side-by-Side Role Comparison</h3>
              <p className="text-xs text-slate-500">
                Evaluating {comparedRolesData.length} of 3 maximum roles against your profile.
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
                  className="input-field py-1.5 text-xs max-w-xs"
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
            <div className="card overflow-x-auto p-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-4 w-48 text-slate-500 font-bold uppercase tracking-wider">
                      Evaluation Metric
                    </th>
                    {comparedRolesData.map(({ role }) => (
                      <th
                        key={role.id}
                        className="p-4 min-w-[240px] text-slate-900 dark:text-white font-extrabold text-sm border-l border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="block">{role.title}</span>
                            <span className="text-xs font-normal text-slate-400">
                              {role.category} · {role.level}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleRoleComparison(role.id)}
                            className="text-slate-400 hover:text-red-500"
                            title="Remove from comparison"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {/* Row: Match Percentage */}
                  <tr>
                    <td className="p-4 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40">
                      Match Compatibility
                    </td>
                    {comparedRolesData.map(({ role, match }) => (
                      <td key={role.id} className="p-4 border-l border-slate-200 dark:border-slate-700">
                        <MatchBadge percentage={match.percentage} size="md" />
                      </td>
                    ))}
                  </tr>

                  {/* Row: Salary Range */}
                  <tr>
                    <td className="p-4 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40">
                      Comp / Salary Range
                    </td>
                    {comparedRolesData.map(({ role }) => (
                      <td key={role.id} className="p-4 font-semibold text-slate-800 dark:text-white border-l border-slate-200 dark:border-slate-700">
                        {role.salaryRange}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Total Core Skills Required */}
                  <tr>
                    <td className="p-4 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40">
                      Total Required Skills
                    </td>
                    {comparedRolesData.map(({ role }) => (
                      <td key={role.id} className="p-4 font-semibold text-slate-800 dark:text-white border-l border-slate-200 dark:border-slate-700">
                        {role.requiredSkills.length} Core Skills
                      </td>
                    ))}
                  </tr>

                  {/* Row: Matching Skills You Have */}
                  <tr>
                    <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400 bg-slate-50/50 dark:bg-slate-800/40">
                      Matching Skills ({userSkills.length} on profile)
                    </td>
                    {comparedRolesData.map(({ role, have }) => (
                      <td key={role.id} className="p-4 border-l border-slate-200 dark:border-slate-700 align-top">
                        <div className="flex flex-wrap gap-1">
                          {have.length === 0 ? (
                            <span className="text-slate-400 italic">None currently met</span>
                          ) : (
                            have.map((s) => (
                              <span
                                key={s.skillId}
                                className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px] font-medium"
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
                    <td className="p-4 font-bold text-amber-700 dark:text-amber-400 bg-slate-50/50 dark:bg-slate-800/40">
                      Skills Needing Practice
                    </td>
                    {comparedRolesData.map(({ role, improve }) => (
                      <td key={role.id} className="p-4 border-l border-slate-200 dark:border-slate-700 align-top">
                        <div className="flex flex-wrap gap-1">
                          {improve.length === 0 ? (
                            <span className="text-slate-400 italic">None</span>
                          ) : (
                            improve.map((s) => (
                              <span
                                key={s.skillId}
                                className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 text-[11px] font-medium"
                              >
                                {s.name} ({s.userProficiency} → {s.proficiency})
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Missing Skills */}
                  <tr>
                    <td className="p-4 font-bold text-rose-700 dark:text-rose-400 bg-slate-50/50 dark:bg-slate-800/40">
                      Missing Gaps
                    </td>
                    {comparedRolesData.map(({ role, missing }) => (
                      <td key={role.id} className="p-4 border-l border-slate-200 dark:border-slate-700 align-top">
                        <div className="flex flex-wrap gap-1">
                          {missing.length === 0 ? (
                            <span className="text-emerald-600 font-semibold">No missing skills!</span>
                          ) : (
                            missing.map((s) => (
                              <span
                                key={s.skillId}
                                className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-[11px] font-medium"
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
                    <td className="p-4 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40">
                      Action
                    </td>
                    {comparedRolesData.map(({ role }) => (
                      <td key={role.id} className="p-4 border-l border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => navigate(`/roles/${role.id}`)}
                          className="btn-primary text-xs w-full justify-center"
                        >
                          View Gap Analysis
                          <ArrowRight size={13} />
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
