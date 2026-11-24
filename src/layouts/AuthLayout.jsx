import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0D11] flex flex-col justify-center items-center p-4 sm:p-6 relative">
      {/* Background Subtle Gradient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900 shadow-sm transition-transform group-hover:scale-105">
              <Sparkles size={16} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Skill<span className="text-brand-600 dark:text-brand-400">Sync</span>
            </span>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">
            Skill-Based Career Matching Platform
          </p>
        </div>

        {/* Auth Card Outlet */}
        <Outlet />
      </div>
    </div>
  );
}
