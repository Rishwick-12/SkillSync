import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );
        if (error) throw error;
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to send the reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card p-6 sm:p-8 animate-slide-up text-center bg-white dark:bg-[#12151B] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
              Check your inbox
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs leading-relaxed">
              If an account exists for <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>, you will receive password reset instructions shortly.
            </p>
          </div>

          <div className="w-full space-y-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setEmail('');
                setError('');
              }}
              className="btn-secondary w-full py-2 text-xs"
            >
              Try a different email
            </button>

            <Link
              to="/login"
              className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8 animate-slide-up bg-white dark:bg-[#12151B] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
      <div className="mb-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-3 transition-colors"
        >
          <ArrowLeft size={13} />
          Back to Sign In
        </Link>

        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Reset password
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your registered email address and we will send you a reset link.
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
        <div>
          <label className="label" htmlFor="forgot-email">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="forgot-email"
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

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Sending link...</span>
            </>
          ) : (
            <>
              <Send size={14} />
              <span>Send Reset Link</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
        Remember your password?{' '}
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
