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
        {submissions.map((item) => {
          const hasIterations = item.comparisonIterations && item.comparisonIterations.length > 0;
          const hasFeedback = !!item.ownerFeedback;
          const latestScore = hasIterations
            ? item.comparisonIterations![item.comparisonIterations!.length - 1].aiScore
            : null;

          return (
            <GlassCard key={item.id} className="p-0 overflow-hidden group border-white/15" opacity={40}>
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-1/3 aspect-[4/3] sm:aspect-auto bg-slate-900 overflow-hidden cursor-pointer relative" onClick={() => setSelectedSubmission(item)}>
                  <GlassImage src={item.userUploadedImageUrl || item.imageUrl} alt="" containerClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {hasIterations && (
                      <span className="px-2 py-1 bg-purple-600/90 backdrop-blur-md rounded text-[8px] text-white font-black uppercase tracking-wider border border-purple-400/50 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-2.5 h-2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        {item.comparisonIterations!.length}次迭代
                      </span>
                    )}
                    {hasFeedback && (
                      <span className="px-2 py-1 bg-amber-500/90 backdrop-blur-md rounded text-[8px] text-white font-black uppercase tracking-wider border border-amber-400/50">
                        ✓ 已点评
                      </span>
                    )}
                  </div>

                  {/* AI Score Badge */}
                  {latestScore && (
                    <div className={`absolute bottom-2 right-2 px-2 py-1 rounded backdrop-blur-md text-[10px] font-black border ${latestScore >= 85 ? 'bg-emerald-500/90 border-emerald-400/50 text-white' : latestScore >= 70 ? 'bg-amber-500/90 border-amber-400/50 text-white' : 'bg-red-500/90 border-red-400/50 text-white'}`}>
                      AI {latestScore}分
                    </div>
                  )}
                </div>
                <div className="sm:w-2/3 p-4 md:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-base md:text-lg line-clamp-1">{item.recipe.title}</h3>
                      <span className={`text-[9px] px-2 py-0.5 rounded border font-bold ${item.recipe.difficulty === 'Beginner' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                          item.recipe.difficulty === 'Intermediate' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                            'border-red-500/30 text-red-400 bg-red-500/10'
                        }`}>
                        {item.recipe.difficulty === 'Beginner' ? '入门' : item.recipe.difficulty === 'Intermediate' ? '进阶' : '大师'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-[10px] text-white font-black border border-white/20">
                        {item.userId.charAt(0)}
                      </div>
                      <span className="text-[11px] text-slate-300 font-bold">{item.userId}</span>
                    </div>

                    {/* Social Stats Row */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-[10px] text-pink-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span className="font-black">{item.socialRecords?.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-cyan-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-black">{item.socialRecords?.comments.length || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">{new Date(item.timestamp).toLocaleDateString()}</span>
                    <button
                      onClick={() => setSelectedSubmission(item)}
                      className={`px-4 py-1.5 rounded-lg text-[11px] font-black transition-all border shadow-sm ${hasFeedback
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500 hover:text-white'
                          : 'bg-white/10 hover:bg-purple-500 hover:text-white text-slate-200 border-white/10'
                        }`}
                    >
                      {hasFeedback ? '查看点评' : '批改指导'}
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
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