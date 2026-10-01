import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  PlayCircle, 
  FileCheck2, 
  BookMarked, 
  History, 
  BarChart3, 
  Bot, 
  Library, 
  MessageSquare, 
  Settings, 
  ShieldCheck, 
  Flame, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';
import { NexusLogo } from './NexusLogo';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  isSpecial?: boolean;
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsAIDrawerOpen, 
    userProfile,
    bookmarks 
  } = useApp();

  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pyqs', label: 'PYQ Explorer', icon: Layers, badge: 'Unified' },
    { id: 'practice', label: 'Practice Mode', icon: PlayCircle },
    { id: 'tests', label: 'Mock Tests', icon: FileCheck2 },
    { id: 'subjects', label: 'Subjects', icon: Library },
    { id: 'discussions', label: 'Discussions', icon: MessageSquare }
  ];

  const secondaryNavItems: NavItem[] = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'bookmarks', label: 'My Bookmarks', icon: BookMarked, badge: bookmarks.length ? `${bookmarks.length}` : undefined },
    { id: 'history', label: 'Practice History', icon: History },
    { id: 'admin', label: 'Admin Hub', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-[#090C0B] h-screen sticky top-0 z-20 shrink-0">
      
      {/* Top Branding */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div onClick={() => setActiveTab('landing')}>
          <NexusLogo size="md" />
        </div>
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        
        {/* Core Exploration Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono tracking-wider uppercase text-slate-500">
            Preparation
          </div>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Assistant Special Action Card */}
        <div className="p-3.5 rounded-xl bg-[#121614] border border-emerald-500/20">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nexus AI Assistant</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Ask doubts, get step-by-step solutions, or generate practice questions.
          </p>
          <button
            onClick={() => setIsAIDrawerOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Open AI Panel</span>
          </button>
        </div>

        {/* Study Tools & Management */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono tracking-wider uppercase text-slate-500">
            Insights & Tools
          </div>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Profile Bar */}
      <div 
        onClick={() => setActiveTab('profile')}
        className="p-3 m-3 rounded-xl bg-[#121614] border border-white/10 hover:border-white/20 transition-colors cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-semibold text-xs text-emerald-400 shrink-0">
            PV
          </div>
          <div className="truncate">
            <div className="text-xs font-medium text-slate-200 truncate">{userProfile.name}</div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="text-emerald-400 font-medium">{userProfile.targetBranch}</span>
              <span>·</span>
              <span>GATE '{userProfile.targetYear % 100}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold shrink-0">
          <Flame className="w-3.5 h-3.5 fill-amber-400" />
          <span>{userProfile.studyStreakDays}d</span>
        </div>
      </div>

    </aside>
  );
};
