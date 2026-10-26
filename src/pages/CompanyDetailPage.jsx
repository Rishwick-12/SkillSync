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

  const [activeTab, setActiveTab] = useState('roles'); // 'roles' | 'about' | 'culture'

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
      <div className="card text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Company Not Found
        </h2>
        <p className="text-slate-500 text-sm">
          We could not locate the company profile you requested.
        </p>
        <Link to="/companies" className="btn-primary inline-flex">
          <ArrowLeft size={16} /> Back to Companies Directory
        </Link>
      </div>
    );
  }

  const isSaved = savedCompanies.includes(company.id);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/companies')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} /> Back to All Companies
        </button>
      </div>

      {/* Illustrative Notice */}
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
        <AlertCircle size={15} className="flex-shrink-0 text-amber-600" />
        <span>
          Illustrative mock company and role data for educational career exploration.
        </span>
      </div>

      {/* Company Hero Card */}
      <div className="card border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-sm flex-shrink-0">
              {company.logo || company.name.charAt(0)}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {company.name}
                </h1>
                <span className="badge badge-blue text-xs">
                  {company.industry}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {company.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={13} /> {company.size}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star size={13} className="fill-amber-400" /> {company.rating} Glassdoor
                </span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Globe size={13} /> Careers Portal <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSaveCompany(company.id)}
              className={`btn-secondary ${
                isSaved ? 'text-blue-600 dark:text-blue-400 border-blue-300' : ''
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck size={16} /> Saved to Favorites
                </>
              ) : (
                <>
                  <Bookmark size={16} /> Save Company
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 flex gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 transition-all relative ${
            activeTab === 'roles'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Open Job Roles ({companyRoles.length})
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`pb-3 transition-all relative ${
            activeTab === 'about'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Company Overview & Culture
        </button>
      </div>

      {/* Tab Content: Roles */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">
              Role Compatibility Breakdown
            </h2>
            <span className="text-xs text-slate-500">
              Ranked by your profile overlap
            </span>
          </div>

          <div className="space-y-4">
            {companyRoles.map(({ role, match }) => (
              <div
                key={role.id}
                className="card card-hover border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {role.title}
                    </h3>
                    <span className="badge badge-gray text-xs">{role.level}</span>
                    <span className="badge badge-blue text-xs">{role.salaryRange}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
                      Required Skills:
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
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                            userHasIt
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {userHasIt ? '✓ ' : ''}
                          {req.name}
                        </span>
                      );
                    })}
                    {role.requiredSkills.length > 6 && (
                      <span className="text-[11px] text-slate-400">
                        +{role.requiredSkills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                  <MatchBadge percentage={match.percentage} size="md" />

                  <button
                    onClick={() => navigate(`/roles/${role.id}`)}
                    className="btn-primary text-xs"
                  >
                    Select Role & Compare
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: About */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card space-y-4">
            <h3 className="section-title">About {company.name}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {company.description}
            </p>

            <h4 className="text-sm font-bold text-slate-800 dark:text-white pt-2">
              Engineering Pillars & Focus Areas
            </h4>
            <div className="flex flex-wrap gap-2">
              {company.tags?.map((t) => (
                <span key={t} className="badge badge-purple text-xs">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="card space-y-3">
            <h3 className="section-title">Fast Facts</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-400">Headquarters</span>
                <span className="font-semibold text-slate-800 dark:text-white">{company.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-400">Founded</span>
                <span className="font-semibold text-slate-800 dark:text-white">{company.founded || 2000}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-400">Company Size</span>
                <span className="font-semibold text-slate-800 dark:text-white">{company.size}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Total Open Roles</span>
                <span className="font-semibold text-indigo-600">{companyRoles.length} tracked roles</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
