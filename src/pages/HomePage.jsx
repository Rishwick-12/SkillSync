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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Skill<span className="text-blue-600">Sync</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Home
            </Link>
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How It Works
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all"
              >
                Go to Dashboard
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all"
                >
                  Get Started
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            <Sparkles size={14} className="text-blue-600" />
            Skill-Based Career Matching Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Find Your Skills. <br className="hidden sm:inline" />
            <span className="text-blue-600">Discover Your Career.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SkillSync helps students and job seekers identify suitable jobs based on their current skills, analyze requirements for dream roles, and follow step-by-step learning roadmaps.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-base font-semibold transition-all flex items-center justify-center"
            >
              Explore Features
            </a>
          </div>

          {/* Quick reassurance pill badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-blue-600" /> Free & Beginner Friendly
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-blue-600" /> 100% Client-Side & Private
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-blue-600" /> Personalized Learning Paths
            </span>
          </div>
        </div>
      </section>

      {/* 3. Three Simple Feature Cards */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Everything You Need to Advance Your Career
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Clear, practical tools to help you identify what you know and learn what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Skill Matching */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Skill Matching
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter your programming languages, tools, and databases to calculate real-time compatibility scores for top engineering roles.
              </p>
            </div>

            {/* Card 2: Career Opportunities */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Career Opportunities
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Explore leading tech employers including Google, Microsoft, and Amazon. Compare required vs. preferred skills for each open position.
              </p>
            </div>

            {/* Card 3: Learning Roadmaps */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Map size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Learning Roadmaps
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Follow personalized 5-phase learning roadmaps that target your exact missing skills, with curated documentation and practice tutorials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Three-Step How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How SkillSync Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Get matched with ideal roles and close your skill gaps in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-base flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Add Your Skills
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose the languages and frameworks you already know, and set your proficiency level from Beginner to Advanced.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-base flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                See Your Matches
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Instantly view compatible roles and discover which skills you have, which need improvement, and which are missing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-base flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Follow Your Roadmap
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate a custom 5-phase learning curriculum to master missing concepts and track your milestones until you are interview-ready.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-12 p-8 rounded-2xl bg-blue-600 text-white text-center space-y-4 shadow-md">
            <h3 className="text-2xl font-bold">
              Ready to find your best career match?
            </h3>
            <p className="text-blue-100 text-sm max-w-xl mx-auto">
              Start building your skills profile today. Explore roles and unlock tailored learning paths in minutes.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-sm shadow transition-all inline-flex items-center gap-2"
              >
                Get Started with Demo
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Simple Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              S
            </div>
            <span className="font-bold text-slate-800">SkillSync</span>
            <span>— Skill-Based Career Matching Platform</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/login" className="hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
          </div>

          <p>© {new Date().getFullYear()} SkillSync. Demo Frontend Application.</p>
        </div>
      </footer>
    </div>
  );
}
