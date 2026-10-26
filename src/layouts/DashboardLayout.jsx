import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Home, LayoutDashboard, Code2, Building2, Target, Map, Bookmark,
  Bell, User, Settings, LogOut, Menu, X, ChevronRight, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/skills', label: 'My Skills', icon: Code2 },
  { to: '/matches', label: 'Recommended Jobs', icon: Target },
  { to: '/companies', label: 'Explore Companies', icon: Building2 },
  { to: '/roadmaps', label: 'My Roadmaps', icon: Map },
  { to: '/saved', label: 'Saved Items', icon: Bookmark },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: true },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications, user } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-700">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Skill<span className="text-blue-600">Sync</span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
              Career Matching
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Home className="w-4.5 h-4.5 flex-shrink-0" size={18} />
          <span className="flex-1">Home Page</span>
        </NavLink>

        <div className="pt-2 pb-1 px-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </span>
        </div>

        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
            <span className="flex-1">{label}</span>
            {badge && unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-[11px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <div 
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer transition-colors" 
          onClick={() => navigate('/profile')}
        >
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-sm flex items-center justify-center flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user?.name || 'Candidate'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user?.email || 'demo@skillsync.app'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden text-slate-900 dark:text-slate-100 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-700 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setSidebarOpen(false)} className="btn-ghost p-1.5 rounded-lg text-slate-500">
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <button onClick={() => setSidebarOpen(true)} className="btn-ghost p-2 -ml-2 text-slate-600">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                <Sparkles size={16} />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                Skill<span className="text-blue-600">Sync</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <NavLink to="/notifications" className="relative btn-ghost p-2 text-slate-600">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </NavLink>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
