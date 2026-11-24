import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Target,
  Building2,
  Map,
  ArrowRight,
  CheckCircle2,
  Code2,
  Compass,
  Briefcase,
  Layers,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0D11] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-500/20">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0B0D11]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900 shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              Skill<span className="text-brand-600 dark:text-brand-400">Sync</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link to="/" className="text-slate-900 dark:text-white font-semibold">
              Home
            </Link>
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              How It Works
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-xs px-3.5 py-1.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={13} />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-ghost text-xs px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs px-3.5 py-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight size={13} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-slate-200/80 dark:border-white/[0.08]">
        {/* Subtle radial ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Skill-Based Career Matching & Gap Analysis
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            Map your existing skills. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-brand-600 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-brand-400">
              Close gaps for your target roles.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            SkillSync calculates exact compatibility between your technical abilities and hiring requirements from top engineering teams. Discover what you have, what to improve, and follow structured roadmaps.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
              className="btn-primary w-full sm:w-auto px-5 py-2.5 text-sm gap-2"
            >
              <span>Explore Candidate Dashboard</span>
              <ArrowRight size={15} />
            </button>
            <a
              href="#features"
              className="btn-secondary w-full sm:w-auto px-5 py-2.5 text-sm"
            >
              Explore Capabilities
            </a>
          </div>

          {/* Quick metrics / reassurance bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              100% Client-Side Engine
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Real-Time Match Calculations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Curated 5-Phase Roadmaps
            </span>
          </div>
        </div>
      </section>

      {/* 3. Three Feature Cards */}
      <section id="features" className="py-16 md:py-24 bg-white dark:bg-[#0B0D11]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Built for pragmatic career progression
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Clear, structured tools designed to remove ambiguity from technical hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Skill Matching */}
            <div className="card card-hover p-6 space-y-3.5">
              <div className="w-9 h-9 rounded-lg border border-slate-200/80 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 flex items-center justify-center">
                <Target size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                Skill Matching Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Add your languages, frameworks, and proficiencies. Instantly compute weighted match percentages against required and preferred job specifications.
              </p>
            </div>

            {/* Card 2: Company Directory */}
            <div className="card card-hover p-6 space-y-3.5">
              <div className="w-9 h-9 rounded-lg border border-slate-200/80 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 flex items-center justify-center">
                <Building2 size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                Company Discovery
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Explore tech companies including Google, Microsoft, and Amazon. Filter by minimum match compatibility and inspect exact hiring criteria.
              </p>
            </div>

            {/* Card 3: Learning Roadmaps */}
            <div className="card card-hover p-6 space-y-3.5">
              <div className="w-9 h-9 rounded-lg border border-slate-200/80 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 flex items-center justify-center">
                <Map size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                Phased Roadmaps
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Generate personalized five-phase roadmaps from Fundamentals to System Design and Mock Interviews, targeting your exact missing skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Three-Step How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-[#F9FAFB] dark:bg-[#0E1015] border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Workflow
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              How SkillSync Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              From inventory to interview readiness in three seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="card p-5 space-y-3">
              <div className="w-7 h-7 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-semibold text-xs flex items-center justify-center">
                01
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Add Your Skills
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Catalog your languages, tools, and databases with verified proficiency levels from Beginner to Advanced.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card p-5 space-y-3">
              <div className="w-7 h-7 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-semibold text-xs flex items-center justify-center">
                02
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Inspect Gaps & Overlap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Review automated categorizations: Skills You Have, Skills to Improve, and Critical Missing Requirements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card p-5 space-y-3">
              <div className="w-7 h-7 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-semibold text-xs flex items-center justify-center">
                03
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Execute Your Curriculum
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Check off milestone tasks, track estimated duration, and save roadmaps directly to your local workspace.
              </p>
            </div>
          </div>

          {/* Minimalist CTA Banner */}
          <div className="card p-8 text-center space-y-4 border border-brand-200/80 dark:border-brand-900/40 bg-gradient-to-b from-brand-50/40 to-transparent dark:from-brand-950/20 dark:to-transparent">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Ready to assess your career readiness?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Start building your profile today. Access the full feature suite with instant demo login.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
                className="btn-primary text-xs px-4 py-2 gap-1.5"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-white/[0.08] py-6 bg-white dark:bg-[#0B0D11]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold flex items-center justify-center text-[10px]">
              S
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">SkillSync</span>
            <span className="text-slate-400 dark:text-slate-500">· Skill-Based Career Matching</span>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>

          <p className="font-mono text-[11px]">© {new Date().getFullYear()} SkillSync Frontend</p>
        </div>
      </footer>
    </div>
  );
}
