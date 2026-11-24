import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, LayoutDashboard, Code2, Building2, Target, Map, Bookmark,
  Bell, User, Settings, LogOut, Menu, X, ChevronRight, Sparkles,
  Sun, Moon
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
  const { notifications, user, theme, toggleTheme } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Resolve current active page title for header breadcrumb
  const currentNavItem = navItems.find(item => location.pathname.startsWith(item.to));
  const pageTitle = currentNavItem?.label || 'Workspace';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-[#0E1015]">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900 shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
              Skill<span className="text-brand-600 dark:text-brand-400">Sync</span>
            </span>
          </div>
        </Link>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10 text-slate-500 uppercase tracking-wider">
          v1.0
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Home className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
          <span className="flex-1">Home Overview</span>
        </NavLink>

        <div className="pt-4 pb-1.5 px-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
            Platform
          </span>
        </div>

        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `sidebar-link group ${isActive ? 'active' : ''}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="flex-1 truncate">{label}</span>
            {badge && unreadCount > 0 && (
              <span className="bg-brand-600 text-white font-mono text-[10px] font-semibold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Footer */}
      <div className="p-3 border-t border-slate-200/80 dark:border-white/[0.08] space-y-1 bg-slate-50/50 dark:bg-white/[0.01]">
        <div 
          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/[0.05] cursor-pointer transition-colors" 
          onClick={() => navigate('/profile')}
        >
          <div className="w-7 h-7 rounded-md bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold text-xs flex items-center justify-center flex-shrink-0 border border-brand-200/60 dark:border-brand-800/40">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-900 dark:text-slate-200 truncate leading-tight">
              {user?.name || 'Candidate'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
              {user?.email || 'demo@skillsync.app'}
            </p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 rounded-md transition-colors font-medium"
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F9FAFB] dark:bg-[#0B0D11] overflow-hidden text-slate-900 dark:text-slate-100 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 dark:border-white/[0.08] flex-shrink-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div 
            className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)} 
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#0E1015] shadow-2xl z-10 animate-slide-in">
            <div className="absolute top-3 right-3 z-20">
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 px-4 sm:px-6 bg-white/80 dark:bg-[#0B0D11]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-1.5 -ml-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            
            {/* Breadcrumb indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="hidden sm:inline">Workspace</span>
              <span className="hidden sm:inline text-slate-300 dark:text-white/20">/</span>
              <span className="font-semibold text-slate-900 dark:text-white">{pageTitle}</span>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => toggleTheme()}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Notifications Button */}
            <NavLink
              to="/notifications"
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              aria-label="View notifications"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
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
