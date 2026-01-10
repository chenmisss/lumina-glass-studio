import React from 'react';
import GlassCard from './GlassCard';
import { User, ViewMode } from '../types';

interface HeaderProps {
  user: User | null;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentView, onViewChange, onLogout }) => {
  return (
    <header className="p-2 md:p-6 sticky top-0 z-50">
      <GlassCard className="px-2 py-1.5 md:px-6 md:py-4 flex justify-between items-center" opacity={85}>
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
          onClick={() => user && onViewChange('dashboard')}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base md:text-xl font-black tracking-tighter text-white uppercase italic">LUMINA</h1>
            <p className="text-[8px] md:text-[10px] text-cyan-400 font-bold uppercase tracking-wider leading-none">
              {user?.role === 'owner' ? '主理人模式' : '学员工作台'}
            </p>
          </div>
          {/* Mobile Text Logo Simplified */}
          <div className="sm:hidden">
            <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">LUMINA</h1>
          </div>
        </div>

        {/* Navigation */}
        {user && (
          <div className="flex items-center gap-1 md:gap-6">
            <nav className="flex bg-black/40 rounded-full p-0.5 md:p-1 border border-white/5">
              <button
                onClick={() => onViewChange('dashboard')}
                className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[9px] md:text-sm font-bold transition-all whitespace-nowrap ${currentView === 'dashboard'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-500 hover:text-white'
                  }`}
              >
                {user.role === 'owner' ? '管理' : '预览'}
              </button>
              <button
                onClick={() => onViewChange('history')}
                className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[9px] md:text-sm font-bold transition-all whitespace-nowrap ${currentView === 'history'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-500 hover:text-white'
                  }`}
              >
                {user.role === 'owner' ? '档案' : '历史'}
              </button>
              {user.role === 'hobbyist' && (
                <button
                  onClick={() => onViewChange('portfolio')}
                  className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[9px] md:text-sm font-bold transition-all whitespace-nowrap ${currentView === 'portfolio'
                    ? 'bg-purple-500/30 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'text-slate-500 hover:text-white'
                    }`}
                >
                  作品
                </button>
              )}
            </nav>

            <div className="flex items-center gap-0.5 md:gap-4 pl-1 md:pl-4 border-l border-white/10">
              <button
                onClick={() => {
                  const key = prompt('请输入您的 Google Gemini API Key 以启用 Live AI 功能 (仅存储在本地):', localStorage.getItem('lumina_api_key') || '');
                  if (key !== null) {
                    import('../services/geminiService').then(({ setApiKey }) => {
                      setApiKey(key);
                      alert('API Key 已更新，AI 功能现已激活。');
                    });
                  }
                }}
                className="p-1.5 md:p-2 text-slate-500 hover:text-cyan-400 transition-colors"
                title="设置 API Key"
              >
                <span className="text-lg md:text-xl">🔑</span>
              </button>
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-xs font-bold text-white">{user.username}</span>
                <span className="text-[9px] uppercase text-slate-500 tracking-widest font-black">{user.role === 'owner' ? 'Studio Master' : 'Artist'}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 md:p-2 text-slate-500 hover:text-red-400 transition-colors"
                title="退出"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm('确定要重置所有演示数据吗？这将清除历史记录和本地缓存。')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="p-1.5 md:p-2 text-slate-500 hover:text-yellow-400 transition-colors"
                title="重置演示数据"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </header >
  );
};

export default Header;