import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Sliders,
  Database,
  Trash2,
  LogOut,
  Check,
  RotateCcw,
  Shield,
  Download,
  AlertTriangle,
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

  const [saveSuccess, setSaveSuccess] = useState(false);

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
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Application Settings & Preferences
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Customize UI appearance, notification frequencies, and local browser storage management.
        </p>
      </div>

      {/* 1. Appearance / Theme */}
      <div className="card space-y-4">
        <h3 className="section-title flex items-center gap-2">
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          Interface Theme
        </h3>
        <p className="text-xs text-slate-500">
          Select between light and dark modes. Settings are preserved across browser refreshes.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 max-w-md pt-1">
          <button
            type="button"
            onClick={() => toggleTheme('light')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-500/20 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Sun size={18} />
            </div>
            <div className="text-left">
              <strong className="block text-sm font-semibold">Light Mode</strong>
              <span className="text-xs text-slate-400">Crisp slate & white</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleTheme('dark')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'border-indigo-500 bg-slate-800 text-white ring-2 ring-indigo-500/30 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-900/60 text-indigo-400 flex items-center justify-center">
              <Moon size={18} />
            </div>
            <div className="text-left">
              <strong className="block text-sm font-semibold">Dark Mode</strong>
              <span className="text-xs text-slate-400">Deep slate & indigo</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <div className="card space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <Bell size={18} />
          Notification Preferences
        </h3>
        <p className="text-xs text-slate-500">
          Configure which events trigger updates in your in-app notification center.
        </p>

        <div className="space-y-3 pt-1 divide-y divide-slate-100 dark:divide-slate-700/60">
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                Role Compatibility Shifts
              </h4>
              <p className="text-[11px] text-slate-500">
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
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                Roadmap Milestones & Target Reminders
              </h4>
              <p className="text-[11px] text-slate-500">
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
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                Curated Learning Resources
              </h4>
              <p className="text-[11px] text-slate-500">
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
      <div className="card space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <Sliders size={18} />
          Account & Match Preferences
        </h3>

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
              className="input-field"
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
              className="input-field"
            >
              <option value="Hybrid & Remote">Hybrid & Remote (Flexible)</option>
              <option value="Remote Only">Remote Only</option>
              <option value="On-Site">On-Site Office Hubs</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Local Storage & Data Management */}
      <div className="card space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <Database size={18} />
          Browser Data Management (localStorage)
        </h3>
        <p className="text-xs text-slate-500">
          All your profile information, custom skills, roadmaps, and favorites exist purely in your browser storage.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportData}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Download size={14} />
            Export My Data Backup (JSON)
          </button>

          <button
            onClick={handleResetData}
            className="btn-secondary text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            Reset to Factory Demo State
          </button>
        </div>
      </div>

      {/* 5. Session / Sign Out */}
      <div className="card border-red-200 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/10 space-y-3">
        <h3 className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
          <Shield size={16} />
          Demo Session Management
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Sign out of your current session. You can sign back in anytime using the prefilled demo account.
        </p>

        <button onClick={handleLogout} className="btn-danger text-xs">
          <LogOut size={14} />
          Sign Out of SkillSync
        </button>
      </div>
    </div>
  );
}
