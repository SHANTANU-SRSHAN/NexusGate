import React from 'react';

interface NexusLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({ size = 'md', showText = true }) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  }[size];

  return (
    <div className="flex items-center gap-2.5 select-none group cursor-pointer">
      <div className={`relative ${iconDimensions} rounded-lg bg-[#0F1412] border border-white/10 flex items-center justify-center p-1.5 transition-colors group-hover:border-emerald-500/50`}>
        {/* Custom SVG logo: Stylized 'N' made of network nodes & data links */}
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Connector paths */}
          <line x1="10" y1="32" x2="10" y2="8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="10" x2="30" y2="30" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="32" x2="30" y2="8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Accent cross-node circuit */}
          <line x1="10" y1="20" x2="20" y2="20" stroke="#34D399" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="20" y1="20" x2="30" y2="12" stroke="#34D399" strokeWidth="1.5" strokeOpacity="0.7" />

          {/* Node vertices */}
          <circle cx="10" cy="8" r="3" fill="#10B981" />
          <circle cx="10" cy="32" r="3" fill="#10B981" />
          <circle cx="20" cy="20" r="2.5" fill="#F8FAFC" />
          <circle cx="30" cy="8" r="3" fill="#10B981" />
          <circle cx="30" cy="32" r="3" fill="#10B981" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className={`font-bold tracking-tight text-[#F1F5F9] ${textSizes}`}>
              Nexus<span className="text-emerald-400 font-semibold">Gate</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
