import React, { useState } from 'react';
import GlassCard from './GlassCard';
import GlassImage from './GlassImage';
import FeedbackModal from './FeedbackModal';
import { storageService } from '../services/storageService';
import { User, HistoryItem } from '../types';

interface OwnerDashboardProps {
  user: User;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user }) => {
  const analytics = storageService.getAnalytics();
  const submissions = storageService.getStudentSubmissions();

  const [selectedSubmission, setSelectedSubmission] = useState<HistoryItem | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 fade-in-standard overflow-x-hidden">
      {/* 头部状态 */}
      <div className="mb-10 text-center md:text-left">
        <div className="inline-block px-3 py-1 bg-purple-500/30 rounded-full text-[10px] text-purple-200 font-bold uppercase tracking-widest mb-3 border border-purple-500/30">
          管理入口
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">工作室运营总览</h1>
        <p className="text-slate-300 text-sm font-medium">欢迎回来，{user.username}。今日有 <span className="text-purple-400 font-bold underline underline-offset-4">{submissions.length}</span> 位学员提交了作品。</p>
      </div>

      {/* 核心指标看板保持不变 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
        <GlassCard className="p-4 md:p-6 border-white/10" opacity={50}>
          <p className="text-slate-300 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-3 md:mb-4">云端算力消耗</p>
          <div className="text-xl md:text-3xl font-black text-white">{analytics.computeCost}</div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono font-bold">T/OPS OPS</div>
        </GlassCard>
        <GlassCard className="p-4 md:p-6 border-white/10" opacity={50}>
          <p className="text-slate-300 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-3 md:mb-4">累计设计产出</p>
          <div className="text-xl md:text-3xl font-black text-cyan-400">{analytics.totalGenerations}</div>
          <div className="mt-2 text-[10px] text-slate-400 font-bold">件作品</div>
        </GlassCard>
        <GlassCard className="p-4 md:p-6 border-white/10" opacity={50}>
          <p className="text-slate-300 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-3 md:mb-4">当前活跃学员</p>
          <div className="text-xl md:text-3xl font-black text-emerald-400">{analytics.activeStudents}</div>
          <div className="mt-2 text-[10px] text-slate-400 font-bold">人</div>
        </GlassCard>
        <GlassCard className="p-4 md:p-6 border-white/10" opacity={50}>
          <p className="text-slate-300 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-3 md:mb-4">平均技艺评分</p>
          <div className="text-xl md:text-3xl font-black text-orange-400">{analytics.avgScore}</div>
          <div className="mt-2 text-[10px] text-slate-400 font-bold">分</div>
        </GlassCard>
      </div>

      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
          学员最新提交
        </h2>
        <button
          onClick={() => alert('已加载所有待审核作品')}
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          查看全部
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {submissions.map((item) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden group border-white/15" opacity={40}>
            <div className="flex flex-col sm:flex-row h-full">
              <div className="sm:w-1/3 aspect-[4/3] sm:aspect-auto bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setSelectedSubmission(item)}>
                <GlassImage src={item.imageUrl} alt="" containerClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="sm:w-2/3 p-4 md:p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-base md:text-lg line-clamp-1">{item.recipe.title}</h3>
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded border border-white/20 text-white font-bold">
                      {item.recipe.difficulty === 'Beginner' ? '入门' : '进阶'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-200 border border-white/20">
                      {item.userId.charAt(0)}
                    </div>
                    <span className="text-[11px] text-slate-300 font-bold">{item.userId}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">{new Date(item.timestamp).toLocaleDateString()}</span>
                  <button
                    onClick={() => setSelectedSubmission(item)}
                    className="px-4 py-1.5 bg-white/10 hover:bg-purple-500 hover:text-white rounded-lg text-[11px] font-black text-slate-200 transition-all border border-white/10 shadow-sm"
                  >
                    批改指导
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* 批改弹窗 */}
      <FeedbackModal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        submission={selectedSubmission}
      />
    </div>
  );
};

export default OwnerDashboard;