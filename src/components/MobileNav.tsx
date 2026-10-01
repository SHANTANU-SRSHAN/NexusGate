import React from 'react';
import { LayoutDashboard, Layers, PlayCircle, Bot, User } from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsAIDrawerOpen } = useApp();

  const items: { id: NavigationTab | 'ai'; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'pyqs', label: 'PYQs', icon: Layers },
    { id: 'practice', label: 'Practice', icon: PlayCircle },
    { id: 'ai', label: 'Nexus AI', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090C0B]/95 border-t border-white/10 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === 'ai' ? false : activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'ai') {
                setIsAIDrawerOpen(true);
              } else {
                setActiveTab(item.id as NavigationTab);
              }
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
              isActive 
                ? 'text-emerald-400 font-semibold' 
                : item.id === 'ai' 
                ? 'text-emerald-400 font-medium' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-md ${item.id === 'ai' ? 'bg-emerald-500/10 border border-emerald-500/20' : ''}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
