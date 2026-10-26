import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Sparkles, AlertCircle, CheckCircle2, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email is required'); return; }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    // Simulate async mock request
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card animate-fade-in">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Check your inbox</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xs mx-auto">
              We've <span className="font-medium text-slate-700 dark:text-slate-300">(pretended to)</span> send a password reset link to:
            </p>
            <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400 break-all">{email}</p>
          </div>

          {/* Demo callout */}
          <div className="w-full p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800 flex items-start gap-2.5 text-left">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700 dark:text-amber-300">
              <p className="font-medium">Demo Mode — No email was actually sent</p>
              <p className="mt-0.5 opacity-80">
                In a real application this would trigger an email with a secure one-time reset link. For now, return to login and use the demo credentials to continue exploring.
              </p>
            </div>
          </div>

          <div className="w-full space-y-2 pt-2">
            <button
              type="button"
              onClick={() => { setSubmitted(false); setEmail(''); }}
              className="btn-secondary w-full justify-center py-2.5 text-sm"
            >
              Try a different email
            </button>
            <Link to="/login" className="btn-primary w-full justify-center py-2.5 text-sm flex items-center gap-2">
              <ArrowLeft size={15} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <div className="mb-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot password?</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {/* Demo notice */}
      <div className="mb-6 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-700 dark:text-indigo-300">
          <p className="font-medium">Demo Mode</p>
          <p className="mt-0.5 opacity-80">No real email will be sent. This simulates the password reset flow only.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-2 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
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

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending link…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send size={16} />
              Send Reset Link
            </span>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        Remember your password?{' '}
        <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
