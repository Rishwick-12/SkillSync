import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email is required'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email'); return; }
    if (!password) { setError('Password is required'); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@skillsync.app');
    setPassword('demo123');
  };

  return (
    <div className="card animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your SkillSync account</p>
      </div>

      {/* Demo notice */}
      <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-700 dark:text-blue-300">
          <p className="font-semibold">Demo Account Available</p>
          <p className="mt-0.5 opacity-90">Click "Use Demo Account" below to immediately test the platform.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-2 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0">Password</label>
            <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10 pr-10"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 text-sm">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : 'Sign In'}
        </button>

        <button type="button" onClick={handleDemoLogin} className="btn-secondary w-full justify-center py-2.5 text-xs">
          <Sparkles size={14} className="text-blue-600" />
          Use Demo Account
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Create account</Link>
      </p>
    </div>
  );
}
