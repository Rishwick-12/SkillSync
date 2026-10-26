import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { score, label: 'Fair', color: 'bg-orange-400' };
  if (score === 3) return { score, label: 'Good', color: 'bg-yellow-400' };
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
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const validate = () => {
    if (!name.trim()) { setError('Name is required'); return false; }
    if (!email) { setError('Email is required'); return false; }
    if (!email.includes('@') || !email.includes('.')) { setError('Please enter a valid email address'); return false; }
    if (!password) { setError('Password is required'); return false; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return false; }
    if (!confirmPassword) { setError('Please confirm your password'); return false; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name.trim(), email, password);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card animate-fade-in text-center">
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account created!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome to SkillSync, {name}. Redirecting to your dashboard…</p>
          </div>
          <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Start tracking your skills with SkillSync</p>
      </div>

      {/* Demo notice */}
      <div className="mb-6 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-700 dark:text-indigo-300">
          <p className="font-medium">Demo Mode</p>
          <p className="mt-0.5 opacity-80">No real account is created. Your data is stored locally in this session only.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-2 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="label">Full name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field pl-10"
              placeholder="Jane Smith"
              autoComplete="name"
            />
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10 pr-10"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Password strength indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-medium ${
                strength.score <= 1 ? 'text-red-500' :
                strength.score === 2 ? 'text-orange-400' :
                strength.score === 3 ? 'text-yellow-500' :
                'text-emerald-500'
              }`}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="label">Confirm password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`input-field pl-10 pr-10 ${
                confirmPassword && confirmPassword !== password
                  ? 'border-red-400 focus:ring-red-400'
                  : confirmPassword && confirmPassword === password
                  ? 'border-emerald-400 focus:ring-emerald-400'
                  : ''
              }`}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirmPassword && confirmPassword === password && (
            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} /> Passwords match
            </p>
          )}
          {confirmPassword && confirmPassword !== password && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> Passwords do not match
            </p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account…
            </span>
          ) : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
