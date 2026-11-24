import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Bell,
  Sliders,
  Database,
  Trash2,
  LogOut,
  Check,
  RotateCcw,
  Shield,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Local settings
  const [notificationSettings, setNotificationSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_settings_notifications');
      return stored
        ? JSON.parse(stored)
        : {
            roleMatches: true,
            milestoneAlerts: true,
            curatedResources: true,
            weeklyDigest: false,
          };
    } catch {
      return {
        roleMatches: true,
        milestoneAlerts: true,
        curatedResources: true,
        weeklyDigest: false,
      };
    }
  });

  const [accountPrefs, setAccountPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_settings_prefs');
      return stored
        ? JSON.parse(stored)
        : {
            preferredCurrency: 'INR (₹)',
            targetLocationType: 'Hybrid & Remote',
            anonymizeProfile: false,
          };
    } catch {
      return {
        preferredCurrency: 'INR (₹)',
        targetLocationType: 'Hybrid & Remote',
        anonymizeProfile: false,
      };
    }
  });

  const [exportNotice, setExportNotice] = useState(false);

  const toggleNotif = (key) => {
    setNotificationSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('skillsync_settings_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetData = () => {
    if (
      confirm(
        'Reset all SkillSync demo data back to factory defaults? Your skills and roadmaps will return to initial starter values.'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const backup = {
      skills: localStorage.getItem('skillsync_user_skills'),
      profile: localStorage.getItem('skillsync_user_profile'),
      roadmaps: localStorage.getItem('skillsync_saved_roadmaps'),
      progress: localStorage.getItem('skillsync_roadmap_progress'),
      savedCompanies: localStorage.getItem('skillsync_saved_companies'),
      savedRoles: localStorage.getItem('skillsync_saved_roles'),
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `skillsync_backup_${Date.now()}.json`);
    dlAnchor.click();

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Application Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize UI appearance, notification frequencies, and local browser storage management.
        </p>
      </div>

      {/* 1. Appearance / Theme */}
      <div className="card p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            Interface Theme
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select between light and dark modes. Settings are preserved across browser sessions.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => toggleTheme('light')}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all text-left ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.14] text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Sun size={16} />
            </div>
            <div>
              <strong className="block text-xs font-semibold">Light Mode</strong>
              <span className="text-[11px] text-slate-500">Clean slate & white</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleTheme('dark')}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all text-left ${
              theme === 'dark'
                ? 'border-indigo-500/80 bg-indigo-950/20 text-white ring-1 ring-indigo-500/30 shadow-xs'
                : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.14] text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-900/40 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Moon size={16} />
            </div>
            <div>
              <strong className="block text-xs font-semibold">Dark Mode</strong>
              <span className="text-[11px] text-slate-400">Deep obsidian & indigo</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <div className="card p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell size={16} />
            Notification Preferences
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure which events trigger alerts in your in-app notification center.
          </p>
        </div>

        <div className="space-y-3 pt-1 divide-y divide-slate-100 dark:divide-white/[0.06]">
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <h4 className="text-xs font-medium text-slate-900 dark:text-white">
                Role Compatibility Shifts
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Notify when newly added skills increase match scores for target roles.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.roleMatches}
              onChange={() => toggleNotif('roleMatches')}
              className="rounded text-indigo-600 accent-indigo-600 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-medium text-slate-900 dark:text-white">
                Roadmap Milestones & Target Reminders
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Reminders when roadmap milestones or target completion dates approach.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.milestoneAlerts}
              onChange={() => toggleNotif('milestoneAlerts')}
              className="rounded text-indigo-600 accent-indigo-600 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-medium text-slate-900 dark:text-white">
                Curated Learning Resources
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Suggestions for documentation, courses, and interview guides matching your gaps.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.curatedResources}
              onChange={() => toggleNotif('curatedResources')}
              className="rounded text-indigo-600 accent-indigo-600 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Account Preferences */}
      <div className="card p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders size={16} />
            Account & Match Preferences
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure default units and job search filtering parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="label">Salary & Compensation Display</label>
            <select
              value={accountPrefs.preferredCurrency}
              onChange={(e) => {
                const updated = { ...accountPrefs, preferredCurrency: e.target.value };
                setAccountPrefs(updated);
                localStorage.setItem('skillsync_settings_prefs', JSON.stringify(updated));
              }}
              className="input-field text-xs"
            >
              <option value="INR (₹)">INR (₹ - Lakhs per annum)</option>
              <option value="USD ($)">USD ($ - Annual compensation)</option>
              <option value="EUR (€)">EUR (€ - European benchmarks)</option>
            </select>
          </div>

          <div>
            <label className="label">Preferred Work Model</label>
            <select
              value={accountPrefs.targetLocationType}
              onChange={(e) => {
                const updated = { ...accountPrefs, targetLocationType: e.target.value };
                setAccountPrefs(updated);
                localStorage.setItem('skillsync_settings_prefs', JSON.stringify(updated));
              }}
              className="input-field text-xs"
            >
              <option value="Hybrid & Remote">Hybrid & Remote (Flexible)</option>
              <option value="Remote Only">Remote Only</option>
              <option value="On-Site">On-Site Office Hubs</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Local Storage & Data Management */}
      <div className="card p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Database size={16} />
            Browser Data Management (localStorage)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            All profile information, custom skills, roadmaps, and favorites exist purely in client-side browser storage.
          </p>
        </div>

        {exportNotice && (
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 size={13} />
            Data backup downloaded successfully.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={handleExportData}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Download size={13} />
            Export Data Backup (JSON)
          </button>

          <button
            onClick={handleResetData}
            className="btn-secondary text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            Reset to Factory Demo State
          </button>
        </div>
      </div>

      {/* 5. Session / Sign Out */}
      <div className="card p-5 sm:p-6 border-rose-200/80 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 space-y-3">
        <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
          <Shield size={15} />
          Demo Session Management
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Sign out of your active session. You can sign back in at any time with the preconfigured demo account.
        </p>

        <div>
          <button onClick={handleLogout} className="btn-danger text-xs">
            <LogOut size={13} />
            Sign Out of SkillSync
          </button>
        </div>
      </div>
    </div>
  );
}
