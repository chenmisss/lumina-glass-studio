import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { UserRole } from '../types';

interface LoginViewProps {
  onLogin: (username: string, role: UserRole) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('hobbyist');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    // 切换角色时清空或设置默认用户名，确保主理人账号能被正确识别
    if (newRole === 'owner') {
      setUsername('主理人·大师');
    } else {
      setUsername('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 演示模式：如果用户没填，给予默认名字。最重要的是带上当前的 role。
    const finalUsername = username.trim() || (role === 'hobbyist' ? '学员·林木' : '主理人·陈师傅');
    onLogin(finalUsername, role);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 fade-in-standard">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.4)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
        </div>
        <h1 className="text-5xl font-black text-white mb-2 tracking-tighter italic">Lumina</h1>
        <div className="h-1 w-16 mx-auto bg-cyan-500 mb-3 rounded-full"></div>
        <p className="text-cyan-200 uppercase tracking-[0.4em] text-[10px] font-black">玻璃艺术 AI 助手</p>
      </div>

      <GlassCard className="w-full max-w-sm p-8 border-white/20" opacity={70}>
        {/* 角色切换按钮组 */}
        <div className="flex bg-black/40 rounded-xl p-1 mb-8 border border-white/10">
          <button
            type="button"
            onClick={() => handleRoleChange('hobbyist')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
              role === 'hobbyist' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            学员入口
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('owner')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
              role === 'owner' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            主理人入口
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-300 mb-2 uppercase tracking-widest">
              {role === 'hobbyist' ? '学员名号' : '管理权限 ID'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === 'hobbyist' ? "输入您的名字..." : "主理人专属 ID..."}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-300 mb-2 uppercase tracking-widest">
              访问密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="演示模式：任意输入..."
              className="w-full bg-black/40 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            className={`w-full font-black py-4 rounded-xl transition-all shadow-xl text-white tracking-widest text-sm mt-4 uppercase ${
              role === 'hobbyist' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/20' 
                : 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-purple-500/20'
            }`}
          >
            {role === 'hobbyist' ? '开启创作之旅' : '进入管理后台'}
          </button>
          
          <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            演示版本 · 账户系统已开放
          </p>
        </form>
      </GlassCard>
    </div>
  );
};

export default LoginView;