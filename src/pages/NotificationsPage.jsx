import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Sparkles,
  TrendingUp,
  Map,
  BookOpen,
  Target,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/ui/EmptyState';

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
  } = useApp();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diffMs / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getIcon = (type) => {
    switch (type) {
      case 'match':
        return <Sparkles className="text-purple-600 dark:text-purple-400" size={16} />;
      case 'milestone':
        return <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={16} />;
      case 'roadmap':
        return <Map className="text-blue-600 dark:text-blue-400" size={16} />;
      case 'resource':
        return <BookOpen className="text-amber-600 dark:text-amber-400" size={16} />;
      case 'recommendation':
        return <Target className="text-indigo-600 dark:text-indigo-400" size={16} />;
      default:
        return <Bell className="text-slate-600 dark:text-slate-400" size={16} />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="badge badge-red font-mono text-[11px]">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay alerted on compatibility shifts, milestone achievements, and curated learning recommendations.
          </p>
        </div>

        {/* Filter and Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-slate-100 dark:bg-canvas-subtle p-0.5 rounded-lg border border-slate-200 dark:border-white/[0.08]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-canvas-elevated text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All <span className="font-mono text-slate-400 ml-0.5">({notifications.length})</span>
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === 'unread'
                  ? 'bg-white dark:bg-canvas-elevated text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Unread <span className="font-mono text-slate-400 ml-0.5">({unreadCount})</span>
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="btn-secondary text-xs flex items-center gap-1.5 py-1.5"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === 'unread' ? 'No unread notifications' : 'No notifications'}
          description={
            filter === 'unread'
              ? 'You have reviewed all your career updates and milestone alerts.'
              : 'Add skills or view matching roles to generate activity updates.'
          }
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (!item.read) markNotificationRead(item.id);
                if (item.link) navigate(item.link);
              }}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                item.read
                  ? 'border-slate-200/70 dark:border-white/[0.06] bg-white dark:bg-canvas-elevated/70 opacity-80 hover:opacity-100 hover:border-slate-300 dark:hover:border-white/[0.12]'
                  : 'border-indigo-200/80 dark:border-indigo-800/60 bg-indigo-50/25 dark:bg-indigo-950/20 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-canvas-subtle border border-slate-200/70 dark:border-white/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3
                      className={`text-xs sm:text-sm truncate ${
                        item.read
                          ? 'font-medium text-slate-800 dark:text-slate-200'
                          : 'font-semibold text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 inline-block flex-shrink-0" />
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap flex items-center gap-1">
                    <Clock size={11} />
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.message}
                </p>

                {item.link && (
                  <div className="pt-1">
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 inline-flex items-center gap-1">
                      Explore update <ArrowRight size={11} />
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {!item.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(item.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Mark read"
                    aria-label="Mark as read"
                  >
                    <Check size={13} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(item.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Dismiss notification"
                  aria-label="Dismiss notification"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
