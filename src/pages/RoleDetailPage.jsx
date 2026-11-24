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
import {
  calculateMatch,
  categorizeSkills,
  meetsRequirement,
} from '../utils/matching';
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

  const [activeTab, setActiveTab] = useState('gap');
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
      <div className="card text-center py-16 space-y-4 max-w-lg mx-auto">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Role Not Found
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested job role specification could not be located.
        </p>
        <Link to="/matches" className="btn-primary inline-flex text-xs px-3.5 py-1.5 gap-1.5">
          <ArrowLeft size={13} /> <span>Back to Recommended Roles</span>
        </Link>
      </div>
    );
  }

  const isSaved = savedRoles.includes(role.id);

  // Generate Roadmap handler
  const handleGenerateRoadmap = async () => {
    try {
      const rm = generateRoadmap(
        role,
        skillGroups.missing,
        skillGroups.improve,
        targetCompany
      );

      await saveRoadmap(rm);
      navigate(`/roadmaps/${rm.id}`);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert(`Could not generate roadmap: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={13} /> <span>Back to Roles</span>
        </button>
      </div>

      {/* Role Header Card */}
      <div className="card p-5 sm:p-7 space-y-5 border border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-blue text-[10px]">
                {role.category}
              </span>
              <span className="badge badge-gray text-[10px]">
                {role.level}
              </span>
              <span className="badge badge-gray text-[10px] font-mono">
                {role.salaryRange}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              {role.title}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              {role.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-slate-500 font-medium">Hiring teams:</span>
              {hiringCompanies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompanyId(c.id)}
                  className={`px-2 py-0.5 rounded-md border text-xs font-medium transition-all ${
                    targetCompany?.id === c.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                      : 'bg-white dark:bg-[#181C24] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions & Compatibility Score */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3.5 flex-shrink-0">
            <div className="text-left sm:text-right">
              <MatchBadge percentage={matchResult?.percentage || 0} size="lg" />
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                {matchResult?.matchingCount} of {matchResult?.totalRequired} skills met
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSaveRole(role.id)}
                className={`btn-secondary text-xs p-2 ${
                  isSaved ? 'text-brand-600 dark:text-brand-300 border-brand-300 dark:border-brand-800' : ''
                }`}
                title="Save Role"
                aria-label="Save role"
              >
                {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              </button>

              <button
                onClick={handleGenerateRoadmap}
                className="btn-primary text-xs px-3.5 py-2 gap-1.5"
              >
                <Map size={14} />
                <span>Generate Roadmap</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Breakdown Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-medium gap-2">
            <span className="text-slate-600 dark:text-slate-400">
              Skill Overlap Breakdown:
            </span>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Possessed ({skillGroups.have.length})
              </span>
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Improve ({skillGroups.improve.length})
              </span>
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                Missing ({skillGroups.missing.length})
              </span>
            </div>
          </div>

          <ProgressBar
            value={matchResult?.percentage || 0}
            size="sm"
            color={
              matchResult?.percentage >= 70
                ? 'green'
                : matchResult?.percentage >= 40
                ? 'yellow'
                : 'red'
            }
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-200/80 dark:border-white/[0.08] gap-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('gap')}
            className={`pb-2.5 transition-all relative ${
              activeTab === 'gap'
                ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Skill Gap Breakdown
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 transition-all relative ${
              activeTab === 'all'
                ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Requirements ({role.requiredSkills.length + (role.preferredSkills?.length || 0)})
          </button>
          <button
            onClick={() => setActiveTab('responsibilities')}
            className={`pb-2.5 transition-all relative ${
              activeTab === 'responsibilities'
                ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Responsibilities
          </button>
        </div>

        {/* Tab 1: 3-Column Gap Breakdown */}
        {activeTab === 'gap' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Skills You Have */}
            <div className="card p-4 space-y-3 border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-900/30">
                <h3 className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Skills You Have
                </h3>
                <span className="badge badge-green text-[10px] font-mono">
                  {skillGroups.have.length}
                </span>
              </div>

              {skillGroups.have.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  None of the skills required are on your profile yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {skillGroups.have.map((s) => (
                    <div
                      key={s.skillId}
                      className="p-2.5 rounded-lg bg-white dark:bg-[#12151B] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {s.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {s.isEssential ? 'Essential' : 'Preferred'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block font-mono">
                          {s.userProficiency}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Req: {s.proficiency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Skills to Improve */}
            <div className="card p-4 space-y-3 border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-amber-900/30">
                <h3 className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-500" />
                  Needs Practice
                </h3>
                <span className="badge badge-yellow text-[10px] font-mono">
                  {skillGroups.improve.length}
                </span>
              </div>

              {skillGroups.improve.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No under-leveled skills for this role.
                </p>
              ) : (
                <div className="space-y-2">
                  {skillGroups.improve.map((s) => (
                    <div
                      key={s.skillId}
                      className="p-2.5 rounded-lg bg-white dark:bg-[#12151B] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {s.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {s.isEssential ? 'Essential' : 'Preferred'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block font-mono">
                          {s.userProficiency}
                        </span>
                        <span className="text-[10px] text-rose-500 font-mono">
                          Target: {s.proficiency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: Missing Skills */}
            <div className="card p-4 space-y-3 border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200/60 dark:border-rose-900/30">
                <h3 className="text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <XCircle size={14} className="text-rose-500" />
                  Missing Requirements
                </h3>
                <span className="badge badge-red text-[10px] font-mono">
                  {skillGroups.missing.length}
                </span>
              </div>

              {skillGroups.missing.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  All requirements covered!
                </p>
              ) : (
                <div className="space-y-2">
                  {skillGroups.missing.map((s) => (
                    <div
                      key={s.skillId}
                      className="p-2.5 rounded-lg bg-white dark:bg-[#12151B] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {s.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {s.isEssential ? 'Essential' : 'Preferred'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block font-mono">
                          Needs: {s.proficiency}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
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
          <div className="card overflow-x-auto p-0 border border-slate-200/80 dark:border-white/[0.08]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/[0.03] border-b border-slate-200/80 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 font-semibold font-mono">
                  <th className="py-2.5 px-4">Skill / Competency</th>
                  <th className="py-2.5 px-4">Requirement</th>
                  <th className="py-2.5 px-4">Target Level</th>
                  <th className="py-2.5 px-4">Your Level</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {[...role.requiredSkills, ...(role.preferredSkills || [])].map((req, i) => {
                  const userSkill = userSkills.find(
                    (us) =>
                      (us.skillId && us.skillId.toLowerCase() === req.skillId.toLowerCase()) ||
                      us.name.toLowerCase() === req.name.toLowerCase()
                  );

                  const isMet = userSkill && meetsRequirement(userSkill.proficiency, req.proficiency);
                  const isImprove = userSkill && !isMet;

                  return (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                      <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">
                        {req.name}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`badge text-[10px] ${
                          req.isEssential ? 'badge-blue' : 'badge-gray'
                        }`}>
                          {req.isEssential ? 'Essential' : 'Preferred'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {req.proficiency}
                      </td>
                      <td className="py-2.5 px-4 font-mono">
                        {userSkill ? (
                          <span className="font-semibold text-slate-800 dark:text-white">
                            {userSkill.proficiency}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not Added</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {isMet ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Check size={13} /> Met
                          </span>
                        ) : isImprove ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                            <AlertTriangle size={13} /> Needs practice
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500 font-semibold">
                            <XCircle size={13} /> Missing
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
          <div className="card space-y-3.5 p-5 border border-slate-200/80 dark:border-white/[0.08]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Core Responsibilities
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {role.responsibilities?.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 flex items-center justify-center font-mono font-semibold text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="card p-6 border border-brand-200/80 dark:border-brand-900/40 bg-brand-50/20 dark:bg-brand-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles size={14} className="text-brand-500" />
            <span>Bridge your skill gaps for {role.title}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Generate a personalized 5-phase learning curriculum targeting your exact missing skills.
          </p>
        </div>

        <button
          onClick={handleGenerateRoadmap}
          className="btn-primary text-xs px-4 py-2 gap-1.5 whitespace-nowrap self-start sm:self-auto"
        >
          <Map size={14} />
          <span>Generate Roadmap</span>
        </button>
      </div>
    </div>
  );
}
