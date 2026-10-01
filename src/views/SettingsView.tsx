import React, { useState } from 'react';
import { 
  Settings, 
  RotateCcw, 
  Check, 
  Trash2, 
  Bell, 
  Moon, 
  Zap, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { userProfile, updateUserProfile } = useApp();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [targetYear, setTargetYear] = useState(userProfile.targetYear);
  const [targetBranch, setTargetBranch] = useState(userProfile.targetBranch);
  const [confettiEnabled, setConfettiEnabled] = useState(true);
  const [aiAutoContext, setAiAutoContext] = useState(true);

  const handleSave = () => {
    updateUserProfile({
      targetYear,
      targetBranch
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetData = () => {
    if (confirm("Reset local practice attempts and bookmarks to initial state?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="border-b border-[rgba(0,255,136,0.12)] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>Platform Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F6]">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#9BA7A1] mt-1">
          Configure your target exam cycle, study preferences, and application behaviors.
        </p>
      </div>

      <div className="nexus-card rounded-2xl p-6 sm:p-8 space-y-6">
        
        {/* Target Exam Setup */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7F6]">Exam Target Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#9BA7A1] mb-1 font-mono">Target GATE Year</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(parseInt(e.target.value))}
                className="w-full bg-[#050807] border border-white/10 rounded-xl p-2.5 text-[#F5F7F6] focus:outline-none"
              >
                <option value={2025}>GATE 2025</option>
                <option value={2026}>GATE 2026</option>
                <option value={2027}>GATE 2027</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9BA7A1] mb-1 font-mono">Primary Engineering Branch</label>
              <select
                value={targetBranch}
                onChange={(e) => setTargetBranch(e.target.value as any)}
                className="w-full bg-[#050807] border border-white/10 rounded-xl p-2.5 text-[#F5F7F6] focus:outline-none"
              >
                {['CSE/IT', 'ECE', 'EE', 'ME', 'CE', 'IN', 'DA'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Study Experience Preferences */}
        <div className="pt-4 border-t border-[rgba(0,255,136,0.1)] space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7F6]">Experience Preferences</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#050807] border border-white/5 text-xs">
              <div>
                <span className="font-semibold text-[#F5F7F6] block">Confetti Celebration</span>
                <span className="text-[#9BA7A1] text-[11px]">Trigger visual celebration upon correct answer submission</span>
              </div>
              <input
                type="checkbox"
                checked={confettiEnabled}
                onChange={(e) => setConfettiEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#00FF88] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#050807] border border-white/5 text-xs">
              <div>
                <span className="font-semibold text-[#F5F7F6] block">AI Automatic Context Injection</span>
                <span className="text-[#9BA7A1] text-[11px]">Automatically attach active question and weak areas to Nexus AI queries</span>
              </div>
              <input
                type="checkbox"
                checked={aiAutoContext}
                onChange={(e) => setAiAutoContext(e.target.checked)}
                className="w-4 h-4 accent-[#00FF88] rounded"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-2 flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs text-[#00FF88] font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          )}
          <div className="ml-auto">
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl nexus-glow-btn text-xs font-bold"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-rose-500/20 space-y-3">
          <h3 className="text-xs font-mono uppercase text-rose-400">Danger Zone</h3>
          <div className="flex items-center justify-between p-4 rounded-xl bg-rose-950/15 border border-rose-500/20 text-xs">
            <div>
              <span className="font-semibold text-rose-300 block">Reset Local Progress</span>
              <span className="text-[#9BA7A1] text-[11px]">Clears all local bookmarks, attempt history, and custom questions</span>
            </div>
            <button
              onClick={handleResetData}
              className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
