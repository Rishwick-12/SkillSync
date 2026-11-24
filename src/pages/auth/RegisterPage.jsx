import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500' };
  if (score === 2) return { score, label: 'Fair', color: 'bg-amber-400' };
  if (score === 3) return { score, label: 'Good', color: 'bg-amber-500' };
  if (score === 4) return { score, label: 'Strong', color: 'bg-emerald-400' };

  return { score, label: 'Very Strong', color: 'bg-emerald-500' };
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const validate = () => {
    if (!name.trim()) {
      setError('Full name is required');
      return false;
    }

    if (!email) {
      setError('Email address is required');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (!confirmPassword) {
      setError('Please confirm your password');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await register(name.trim(), email, password);

      setConfirmationRequired(result.requiresEmailConfirmation);
      setSuccess(true);

      if (!result.requiresEmailConfirmation) {
        setTimeout(() => navigate('/dashboard'), 1200);
      }
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card p-6 sm:p-8 animate-slide-up text-center bg-white dark:bg-[#12151B] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>

          <div>
            {confirmationRequired ? (
              <>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                  Check your inbox!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                  We've sent a confirmation link to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>.
                  Please verify your email before signing in.
                </p>
                <Link
                  to="/login"
                  className="btn-primary mt-5 inline-flex text-xs px-4 py-2"
                >
                  Return to Sign In
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                  Account Created Successfully
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Welcome, {name}. Redirecting to your dashboard...
                </p>
              </>
            )}
          </div>

          {!confirmationRequired && (
            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mt-2" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8 animate-slide-up bg-white dark:bg-[#12151B] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Create your account
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Start matching your skills with verified career roles.
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
        {/* Name */}
        <div>
          <label className="label" htmlFor="register-name">Full name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field pl-9.5 text-sm"
              placeholder="Alex Johnson"
              autoComplete="name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="label" htmlFor="register-email">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-9.5 text-sm"
              placeholder="alex@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="label" htmlFor="register-password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-9.5 pr-10 text-sm"
              placeholder="At least 8 characters"
              autoComplete="new-password"
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

          {/* Password strength indicator */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.score
                        ? strength.color
                        : 'bg-slate-200 dark:bg-white/[0.08]'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Strength: <span className="text-slate-700 dark:text-slate-300 font-semibold">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="label" htmlFor="register-confirm">Confirm password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="register-confirm"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`input-field pl-9.5 pr-10 text-sm ${
                confirmPassword && confirmPassword !== password
                  ? 'border-rose-400 focus:ring-rose-400'
                  : confirmPassword && confirmPassword === password
                  ? 'border-emerald-400 focus:ring-emerald-400'
                  : ''
              }`}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5 mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
