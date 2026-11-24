import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Star,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Briefcase,
  AlertCircle,
  ExternalLink,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { companies } from '../data/companies';
import { roles } from '../data/roles';
import { calculateMatch } from '../utils/matching';
import MatchBadge from '../components/ui/MatchBadge';

export default function CompanyDetailPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const {
    userSkills,
    savedCompanies,
    toggleSaveCompany,
    addToRecentlyViewed,
  } = useApp();

  const [activeTab, setActiveTab] = useState('roles');

  const company = useMemo(() => {
    return companies.find((c) => c.id === companyId);
  }, [companyId]);

  useEffect(() => {
    if (company) {
      addToRecentlyViewed({
        type: 'company',
        id: company.id,
        name: company.name,
        subtitle: `${company.industry} · ${company.location}`,
      });
    }
  }, [company]);

  // Roles available for this company
  const companyRoles = useMemo(() => {
    if (!company) return [];
    return roles
      .filter((r) => company.roles.includes(r.id) || r.companyIds?.includes(company.id))
      .map((role) => ({
        role,
        match: calculateMatch(userSkills, role),
      }))
      .sort((a, b) => b.match.percentage - a.match.percentage);
  }, [company, userSkills]);

  if (!company) {
    return (
      <div className="card text-center py-16 space-y-4 max-w-lg mx-auto">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Company Not Found
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested company profile does not exist or has been removed.
        </p>
        <Link to="/companies" className="btn-primary inline-flex text-xs px-3.5 py-1.5 gap-1.5">
          <ArrowLeft size={13} /> <span>Back to Companies Directory</span>
        </Link>
      </div>
    );
  }

  const isSaved = savedCompanies.includes(company.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/companies')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={13} /> <span>Back to Companies Directory</span>
        </button>
      </div>

      {/* Illustrative Notice */}
      <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
        <AlertCircle size={14} className="flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          Illustrative mock company and role data for educational career exploration.
        </span>
      </div>

      {/* Company Hero Card */}
      <div className="card p-5 sm:p-7 space-y-4 border border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm">
              {company.logo || company.name.charAt(0)}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {company.name}
                </h1>
                <span className="badge badge-gray text-[10px]">
                  {company.industry}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {company.location}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Users size={12} /> {company.size}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono font-medium">
                  <Star size={11} className="fill-current" /> {company.rating}
                </span>
                {company.website && (
                  <>
                    <span>·</span>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      <Globe size={11} /> <span>Careers</span> <ExternalLink size={9} />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => toggleSaveCompany(company.id)}
              className={`btn-secondary text-xs px-3.5 py-2 gap-1.5 ${
                isSaved ? 'text-brand-600 dark:text-brand-300 border-brand-300 dark:border-brand-800' : ''
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck size={14} className="text-brand-600 dark:text-brand-400" />
                  <span>Saved to Favorites</span>
                </>
              ) : (
                <>
                  <Bookmark size={14} />
                  <span>Save Company</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notion-style Underlined Tabs */}
      <div className="border-b border-slate-200/80 dark:border-white/[0.08] flex gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-2.5 transition-all relative ${
            activeTab === 'roles'
              ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Open Roles ({companyRoles.length})
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`pb-2.5 transition-all relative ${
            activeTab === 'about'
              ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Company Overview & Culture
        </button>
      </div>

      {/* Tab Content: Roles */}
      {activeTab === 'roles' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              Role Compatibility Breakdown
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Ranked by profile overlap
            </span>
          </div>

          <div className="space-y-3">
            {companyRoles.map(({ role, match }) => (
              <div
                key={role.id}
                className="card card-hover p-4 sm:p-5 border border-slate-200/80 dark:border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                      {role.title}
                    </h3>
                    <span className="badge badge-gray text-[10px]">{role.level}</span>
                    <span className="badge badge-blue text-[10px]">{role.salaryRange}</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] font-mono text-slate-400 mr-1">
                      Required:
                    </span>
                    {role.requiredSkills.slice(0, 6).map((req) => {
                      const userHasIt = userSkills.some(
                        (us) =>
                          (us.skillId && us.skillId.toLowerCase() === req.skillId.toLowerCase()) ||
                          us.name.toLowerCase() === req.name.toLowerCase()
                      );
                      return (
                        <span
                          key={req.skillId}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                            userHasIt
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/40'
                              : 'bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-white/[0.06]'
                          }`}
                        >
                          {userHasIt ? '✓ ' : ''}
                          {req.name}
                        </span>
                      );
                    })}
                    {role.requiredSkills.length > 6 && (
                      <span className="text-[10px] font-mono text-slate-400">
                        +{role.requiredSkills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/[0.06]">
                  <MatchBadge percentage={match.percentage} size="sm" />

                  <button
                    onClick={() => navigate(`/roles/${role.id}`)}
                    className="btn-primary text-xs px-3 py-1.5 gap-1"
                  >
                    <span>Gap Analysis</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: About */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 card p-5 space-y-4 border border-slate-200/80 dark:border-white/[0.06]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              About {company.name}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              {company.description}
            </p>

            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono pt-2">
              Focus Areas & Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {company.tags?.map((t) => (
                <span key={t} className="badge badge-purple text-[10px]">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-5 space-y-3 border border-slate-200/80 dark:border-white/[0.06]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Quick Facts
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/[0.06]">
                <span className="text-slate-400">Location</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{company.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/[0.06]">
                <span className="text-slate-400">Founded</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{company.founded || 2000}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/[0.06]">
                <span className="text-slate-400">Company Size</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{company.size}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Tracked Roles</span>
                <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">{companyRoles.length} open</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
