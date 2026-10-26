import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Briefcase,
  Building2,
  Map,
  Bookmark,
  BookmarkCheck,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { roles } from '../data/roles';
import { companies } from '../data/companies';
import { calculateMatch, categorizeSkills, meetsRequirement } from '../utils/matching';
import { generateRoadmap } from '../utils/roadmap';
import MatchBadge from '../components/ui/MatchBadge';
import ProgressBar from '../components/ui/ProgressBar';

export default function RoleDetailPage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const {
    userSkills,
    savedRoles,
    toggleSaveRole,
    saveRoadmap,
    addToRecentlyViewed,
  } = useApp();

  const [activeTab, setActiveTab] = useState('gap'); // 'gap' | 'all' | 'responsibilities'
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const role = useMemo(() => {
    return roles.find((r) => r.id === roleId);
  }, [roleId]);

  useEffect(() => {
    if (role) {
      addToRecentlyViewed({
        type: 'role',
        id: role.id,
        name: role.title,
        subtitle: `${role.category} · ${role.level}`,
      });
      if (role.companyIds && role.companyIds.length > 0 && !selectedCompanyId) {
        setSelectedCompanyId(role.companyIds[0]);
      }
    }
  }, [role]);

  // Dynamic matching and category computation
  const matchResult = useMemo(() => {
    if (!role) return null;
    return calculateMatch(userSkills, role);
  }, [role, userSkills]);

  const skillGroups = useMemo(() => {
    if (!role) return { have: [], improve: [], missing: [] };
    return categorizeSkills(userSkills, role);
  }, [role, userSkills]);

  const hiringCompanies = useMemo(() => {
    if (!role) return [];
    return companies.filter(
      (c) => c.roles.includes(role.id) || role.companyIds?.includes(c.id)
    );
  }, [role]);

  const targetCompany = useMemo(() => {
    return companies.find((c) => c.id === selectedCompanyId) || hiringCompanies[0];
  }, [selectedCompanyId, hiringCompanies]);

  if (!role) {
    return (
      <div className="card text-center py-16 space-y-4 max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Role Not Found
        </h2>
        <p className="text-slate-500 text-sm">
          The requested job role specification could not be found.
        </p>
        <Link to="/matches" className="btn-primary inline-flex">
          <ArrowLeft size={16} /> Back to Recommended Jobs
        </Link>
      </div>
    );
  }

  const isSaved = savedRoles.includes(role.id);

  // Generate Roadmap handler
  const handleGenerateRoadmap = () => {
    const rm = generateRoadmap(
      role,
      skillGroups.missing,
      skillGroups.improve,
      targetCompany
    );
    saveRoadmap(rm);
    navigate(`/roadmaps/${rm.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={14} /> Back to roles
        </button>
      </div>

      {/* Role Header Card */}
      <div className="card border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-blue text-xs font-semibold">
                {role.category}
              </span>
              <span className="badge badge-gray text-xs">{role.level}</span>
              <span className="badge badge-gray text-xs">{role.salaryRange}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {role.title}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl leading-relaxed">
              {role.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Companies offering this role:
              </span>
              {hiringCompanies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompanyId(c.id)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                    targetCompany?.id === c.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-blue-300'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions & Compatibility Score */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 flex-shrink-0">
            <div className="text-left sm:text-right">
              <MatchBadge percentage={matchResult?.percentage || 0} size="lg" />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {matchResult?.matchingCount} of {matchResult?.totalRequired} skills matched
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleSaveRole(role.id)}
                className={`btn-secondary ${isSaved ? 'text-blue-600 border-blue-300' : ''}`}
                title="Save Role"
              >
                {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </button>
              <button
                onClick={handleGenerateRoadmap}
                className="btn-primary"
              >
                <Map size={16} />
                Generate Learning Roadmap
              </button>
            </div>
          </div>
        </div>

        {/* Progress Breakdown Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold gap-2">
            <span className="text-slate-700 dark:text-slate-300">
              Skill Overlap Breakdown:
            </span>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Skills You Have ({skillGroups.have.length})
              </span>
              <span className="text-amber-600 flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                Needs Practice ({skillGroups.improve.length})
              </span>
              <span className="text-rose-600 flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                Missing Skills ({skillGroups.missing.length})
              </span>
            </div>
          </div>

          <ProgressBar
            value={matchResult?.percentage || 0}
            size="md"
            color={matchResult?.percentage >= 70 ? 'green' : matchResult?.percentage >= 40 ? 'yellow' : 'red'}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-200 dark:border-slate-700 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('gap')}
            className={`pb-3 transition-all ${
              activeTab === 'gap'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Skill Gap Breakdown
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 transition-all ${
              activeTab === 'all'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Requirements ({role.requiredSkills.length + (role.preferredSkills?.length || 0)})
          </button>
          <button
            onClick={() => setActiveTab('responsibilities')}
            className={`pb-3 transition-all ${
              activeTab === 'responsibilities'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Responsibilities
          </button>
        </div>

        {/* Tab 1: 3-column Gap Breakdown */}
        {activeTab === 'gap' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1: Skills You Have */}
            <div className="card bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/60 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-800/60">
                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Skills You Have
                </h3>
                <span className="badge badge-green text-xs">
                  {skillGroups.have.length}
                </span>
              </div>

              {skillGroups.have.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  None of the skills required for this role are on your profile yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {skillGroups.have.map((s) => (
                    <div
                      key={s.skillId}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                          {s.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {s.isEssential ? 'Essential' : 'Preferred'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                          {s.userProficiency}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Req: {s.proficiency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Skills to Improve */}
            <div className="card bg-amber-50/20 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800/60 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-amber-800/60">
                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle size={16} className="text-amber-500" />
                  Skills to Improve
                </h3>
                <span className="badge badge-yellow text-xs">
                  {skillGroups.improve.length}
                </span>
              </div>

              {skillGroups.improve.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  You do not have any under-leveled skills for this role.
                </p>
              ) : (
                <div className="space-y-2">
                  {skillGroups.improve.map((s) => (
                    <div
                      key={s.skillId}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-900/40 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                          {s.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {s.isEssential ? 'Essential' : 'Preferred'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">
                          Current: {s.userProficiency}
                        </span>
                        <span className="text-[10px] text-rose-500 font-medium">
                          Target: {s.proficiency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: Missing Skills */}
            <div className="card bg-rose-50/20 dark:bg-rose-950/10 border-rose-200 dark:border-rose-800/60 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200/60 dark:border-rose-800/60">
                <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <XCircle size={16} className="text-rose-500" />
                  Missing Skills
                </h3>
                <span className="badge badge-red text-xs">
                  {skillGroups.missing.length}
                </span>
              </div>

              {skillGroups.missing.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  Great job! You have covered all required and preferred skills.
                </p>
              ) : (
                <div className="space-y-2">
                  {skillGroups.missing.map((s) => (
                    <div
                      key={s.skillId}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                          {s.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {s.isEssential ? 'Must-have' : 'Preferred'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block">
                          Needs: {s.proficiency}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Not on profile
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Full Table of Requirements */}
        {activeTab === 'all' && (
          <div className="card overflow-x-auto p-0 border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="py-3 px-4">Skill / Competency</th>
                  <th className="py-3 px-4">Requirement Type</th>
                  <th className="py-3 px-4">Target Proficiency</th>
                  <th className="py-3 px-4">Your Proficiency</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {[...role.requiredSkills, ...(role.preferredSkills || [])].map((req, i) => {
                  const userSkill = userSkills.find(
                    (us) =>
                      (us.skillId && us.skillId.toLowerCase() === req.skillId.toLowerCase()) ||
                      us.name.toLowerCase() === req.name.toLowerCase()
                  );
                  const isMet = userSkill && meetsRequirement(userSkill.proficiency, req.proficiency);
                  const isImprove = userSkill && !isMet;

                  return (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {req.name}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge text-[10px] ${
                            req.isEssential ? 'badge-blue' : 'badge-gray'
                          }`}
                        >
                          {req.isEssential ? 'Essential' : 'Preferred'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-300">
                        {req.proficiency}
                      </td>
                      <td className="py-3 px-4">
                        {userSkill ? (
                          <span className="font-semibold text-slate-800 dark:text-white">
                            {userSkill.proficiency}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not Added</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isMet ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <Check size={14} /> Met
                          </span>
                        ) : isImprove ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                            <AlertTriangle size={14} /> Needs practice
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500 font-bold">
                            <XCircle size={14} /> Missing
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Responsibilities */}
        {activeTab === 'responsibilities' && (
          <div className="card space-y-4 p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="section-title">Core Responsibilities</h3>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              {role.responsibilities?.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CTA Box */}
      <div className="card bg-blue-600 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl shadow-sm">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles size={18} />
            Bridge your skill gaps for {role.title}
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Generate a personalized 5-phase learning roadmap covering Fundamentals, Core Technical Skills, Frameworks, Projects, and Interview Prep.
          </p>
        </div>

        <button
          onClick={handleGenerateRoadmap}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs shadow transition-all whitespace-nowrap flex items-center justify-center gap-2"
        >
          <Map size={16} />
          Generate Learning Roadmap
        </button>
      </div>
    </div>
  );
}
