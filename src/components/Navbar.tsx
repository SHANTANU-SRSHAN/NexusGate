import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Bell, 
  Menu, 
  X, 
  Flame, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';
import { NexusLogo } from './NexusLogo';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsSearchOpen, 
    setIsAIDrawerOpen,
    userProfile,
    updateUserProfile
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks: { id: NavigationTab; label: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'pyqs', label: 'PYQ Explorer', badge: 'All PYQs' },
    { id: 'practice', label: 'Practice' },
    { id: 'tests', label: 'Mock Tests' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'discussions', label: 'Discussions' },
    { id: 'analytics', label: 'Analytics' }
  ];

  const notifications = [
    { id: 1, title: 'Daily Streak Maintained', desc: '14 days consistent practice. 2x XP active!', time: '1h ago', read: false },
    { id: 2, title: 'New PYQ Added', desc: 'GATE 2024 CS Shift 2 questions normalized with AI solutions.', time: '5h ago', read: false },
    { id: 3, title: 'Discussion Upvote', desc: 'Aditya upvoted your analysis on SRTF Preemption.', time: '1d ago', read: true }
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#090C0B]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Target Year */}
        <div className="flex items-center gap-6">
          <div onClick={() => setActiveTab('landing')}>
            <NexusLogo size="md" />
          </div>

          {/* Quick Target Year Switcher */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/10 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target:</span>
            <select
              value={userProfile.targetYear}
              onChange={(e) => updateUserProfile({ targetYear: parseInt(e.target.value) })}
              className="bg-[#121614] border border-white/10 rounded px-2 py-0.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value={2025}>GATE 2025</option>
              <option value={2026}>GATE 2026</option>
              <option value={2027}>GATE 2027</option>
            </select>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md flex items-center gap-1.5 ${
                  isActive 
                    ? 'text-emerald-400 bg-emerald-500/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Global Search, AI Assistant, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Global Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121614] border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 transition-all text-xs"
            title="Global Search (Press ⌘K or Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search PYQs, concepts...</span>
            <kbd className="hidden sm:inline font-mono text-[10px] bg-black/40 px-1.5 py-0.5 rounded border border-white/10 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick AI Trigger button */}
          <button
            onClick={() => setIsAIDrawerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121614] border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors text-xs font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nexus AI</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#121614] border border-white/10 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <span className="text-xs font-semibold text-slate-200">Notifications</span>
                  <span className="text-[10px] text-emerald-400 hover:underline cursor-pointer">Mark all as read</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-medium text-slate-200">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg bg-[#121614] border border-white/10 hover:border-white/20 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1 text-xs text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-semibold">{userProfile.studyStreakDays}d</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[11px] font-semibold text-emerald-400">
              PV
            </div>
          </div>

          {/* Primary CTA: Start Practicing */}
          <button
            onClick={() => setActiveTab('pyqs')}
            className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg nexus-glow-btn text-xs font-semibold"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Start Practicing</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 bg-[#090C0B] border-b border-white/10 space-y-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'text-slate-400'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                setActiveTab('pyqs');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg nexus-glow-btn text-xs text-center font-semibold"
            >
              Start Practicing PYQs
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
