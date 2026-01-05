import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg';
  opacity?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', blur = 'md', opacity = 20 }) => {
  const backdropBlur = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-xl',
  }[blur];

  return (
    <div
      className={`
        relative rounded-2xl 
        bg-slate-900/${opacity} ${backdropBlur} 
        text-white overflow-hidden
        transition-all duration-500
        hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]
        group
        ${className}
      `}
    >
      {/* Premium Gradient Border */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/30 via-white/10 to-white/5 pointer-events-none -z-10 group-hover:from-cyan-400/50 group-hover:via-purple-500/30 group-hover:to-transparent transition-colors duration-700">
        <div className="w-full h-full bg-slate-900/40 rounded-2xl backdrop-blur-xl"></div>
      </div>

      {/* Glossy reflection effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-50" />

      {/* Subtle shine animation */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-cyan-500/5 via-transparent to-purple-500/5" />

      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;