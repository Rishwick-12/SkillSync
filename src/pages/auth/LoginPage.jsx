import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, loginDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    loginDemoUser();
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 sm:p-8 animate-slide-up bg-white dark:bg-[#12151B] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Sign in to your account
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Welcome back. Enter your credentials to access your candidate workspace.
        </p>
      </div>

      {error && (
        <div 
          className="mb-5 p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs"
          role="alert"
        >
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="label" htmlFor="email-input">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-9.5 text-sm"
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0" htmlFor="password-input">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-9.5 pr-10 text-sm"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5 mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Demo Login Quick Action */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80 dark:border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-slate-400">
            <span className="bg-white dark:bg-[#12151B] px-2 font-mono">or demo access</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="btn-secondary w-full py-2 text-xs font-semibold gap-1.5"
        >
          <Zap size={14} className="text-amber-500" />
          <span>Quick Demo Login (1-Click Access)</span>
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
