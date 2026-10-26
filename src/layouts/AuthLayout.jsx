import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <Sparkles size={20} />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              Skill<span className="text-blue-600">Sync</span>
            </span>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Skill-Based Career Matching Platform
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
