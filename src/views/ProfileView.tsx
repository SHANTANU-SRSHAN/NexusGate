import React, { useState } from 'react';
import { 
  User, 
  Flame, 
  Target, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Edit3, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Compass, 
  CalendarCheck, 
  Sword 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../types';

export const ProfileView: React.FC = () => {
  const { userProfile, updateUserProfile, badges, setActiveTab } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [targetYear, setTargetYear] = useState(userProfile.targetYear);
  const [targetBranch, setTargetBranch] = useState(userProfile.targetBranch);
  const [targetScore, setTargetScore] = useState(userProfile.targetScore);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      targetYear,
      targetBranch,
      targetScore
    });
    setIsEditing(false);
  };

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'Target': return Target;
      case 'Zap': return Zap;
      case 'Flame': return Flame;
      case 'Compass': return Compass;
      case 'CalendarCheck': return CalendarCheck;
      case 'Award': return Award;
      case 'Sword': return Sword;
      default: return Award;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Profile Card Header */}
      <div className="nexus-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#00FF88]/20 border border-[#00FF88]/40 flex items-center justify-center font-bold text-2xl text-[#00FF88] shadow-[0_0_25px_rgba(0,255,136,0.3)]">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#F5F7F6]">{userProfile.name}</h1>
                <span className="font-mono text-xs text-[#00FF88] bg-[#00FF88]/15 px-2 py-0.5 rounded border border-[#00FF88]/30">
                  Aspirant
                </span>
              </div>
              <p className="text-xs text-[#9BA7A1]">{userProfile.email}</p>
              <div className="flex items-center gap-3 text-xs text-[#9BA7A1] pt-1">
                <span>Branch: <strong className="text-[#00FF88]">{userProfile.targetBranch}</strong></span>
                <span>·</span>
                <span>Target: <strong className="text-[#F5F7F6]">GATE {userProfile.targetYear}</strong></span>
                <span>·</span>
                <span>Goal Score: <strong className="text-[#00FF88]">{userProfile.targetScore}+</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00FF88] text-xs font-semibold text-[#F5F7F6] flex items-center gap-1.5 self-start sm:self-center"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile Goals'}</span>
          </button>

        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="p-4 rounded-2xl bg-[#050807] border border-[rgba(0,255,136,0.2)] space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[#9BA7A1] mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#080C0A] border border-white/10 focus:border-[#00FF88] rounded-lg p-2 text-[#F5F7F6] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#9BA7A1] mb-1">Target GATE Year</label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(parseInt(e.target.value))}
                  className="w-full bg-[#080C0A] border border-white/10 focus:border-[#00FF88] rounded-lg p-2 text-[#F5F7F6] focus:outline-none"
                >
                  <option value={2025}>GATE 2025</option>
                  <option value={2026}>GATE 2026</option>
                  <option value={2027}>GATE 2027</option>
                </select>
              </div>
              <div>
                <label className="block text-[#9BA7A1] mb-1">Branch</label>
                <select
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value as any)}
                  className="w-full bg-[#080C0A] border border-white/10 focus:border-[#00FF88] rounded-lg p-2 text-[#F5F7F6] focus:outline-none"
                >
                  {['CSE/IT', 'ECE', 'EE', 'ME', 'CE', 'IN', 'DA'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#9BA7A1] mb-1">Target Score (out of 100)</label>
                <input
                  type="number"
                  step="0.5"
                  value={targetScore}
                  onChange={(e) => setTargetScore(parseFloat(e.target.value))}
                  className="w-full bg-[#080C0A] border border-white/10 focus:border-[#00FF88] rounded-lg p-2 text-[#F5F7F6] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg nexus-glow-btn text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Badges & Gamification (Section 27) */}
      <div className="nexus-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.1)] pb-4">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#00FF88]" />
            <h2 className="text-base sm:text-lg font-bold text-[#F5F7F6]">
              Milestone Badges ({badges.filter(b => b.unlocked).length} / {badges.length} Unlocked)
            </h2>
          </div>
          <span className="text-xs text-[#9BA7A1]">Earned through rigorous practice</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge: Badge) => {
            const Icon = getBadgeIcon(badge.icon);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  badge.unlocked
                    ? 'bg-[#050807] border-[#00FF88]/30 shadow-[0_0_15px_rgba(0,255,136,0.08)]'
                    : 'bg-[#050807]/50 border-white/5 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      badge.unlocked ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40' : 'bg-white/5 text-white/40'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {badge.unlocked ? (
                      <span className="text-[10px] font-mono text-[#00FF88] bg-[#00FF88]/10 px-1.5 py-0.2 rounded border border-[#00FF88]/20">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#9BA7A1] font-mono">
                        {badge.progress} / {badge.maxProgress}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-[#F5F7F6]">{badge.name}</h3>
                  <p className="text-[11px] text-[#9BA7A1] leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {badge.unlockedAt && (
                  <span className="text-[10px] text-[#9BA7A1] block pt-2 border-t border-white/5">
                    Earned {badge.unlockedAt}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
