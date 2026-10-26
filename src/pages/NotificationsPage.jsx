import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  AlertCircle,
  Clock,
  ArrowRight,
  Filter,
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
        return <Sparkles className="text-purple-600 dark:text-purple-400" size={18} />;
      case 'milestone':
        return <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={18} />;
      case 'roadmap':
        return <Map className="text-blue-600 dark:text-blue-400" size={18} />;
      case 'resource':
        return <BookOpen className="text-amber-600 dark:text-amber-400" size={18} />;
      case 'recommendation':
        return <Target className="text-indigo-600 dark:text-indigo-400" size={18} />;
      default:
        return <Bell className="text-slate-600 dark:text-slate-400" size={18} />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Notification Center
            {unreadCount > 0 && (
              <span className="badge badge-red">{unreadCount} Unread</span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Stay alerted on compatibility shifts, milestone achievements, and curated learning recommendations.
          </p>
        </div>

        {/* Filter and Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <CheckCheck size={14} />
              Mark all as read
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
              ? 'You have reviewed all your career and skill updates.'
              : 'Add skills or view matching roles to generate activity updates.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (!item.read) markNotificationRead(item.id);
                if (item.link) navigate(item.link);
              }}
              className={`card p-4 card-hover border flex items-start gap-4 transition-all cursor-pointer ${
                item.read
                  ? 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/80'
                  : 'border-indigo-200 dark:border-indigo-800/70 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-sm'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm ${
                        item.read
                          ? 'font-medium text-slate-800 dark:text-slate-200'
                          : 'font-bold text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                    <Clock size={11} />
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.message}
                </p>

                {item.link && (
                  <div className="pt-1">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                      Explore update <ArrowRight size={12} />
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
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Mark read"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(item.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="Dismiss notification"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
