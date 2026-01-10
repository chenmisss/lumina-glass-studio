import React, { useState } from 'react';
import GlassCard from './GlassCard';
import GlassImage from './GlassImage';
import { HistoryItem } from '../types';
import ComparisonJourneyModal from './ComparisonJourneyModal';

interface HistoryViewProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem, scrollToCompare?: boolean) => void;
  onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ items, onSelect, onClear }) => {
  const [journeyItem, setJourneyItem] = useState<HistoryItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center fade-in-standard px-4">
        <GlassCard className="p-8 md:p-12 flex flex-col items-center max-w-lg" opacity={30}>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">暂无设计记录</h3>
          <p className="text-slate-300 mb-6">您还没有生成过任何玻璃艺术设计。前往"创意预览"开始您的第一个作品吧！</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 fade-in-standard">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl md:text-4xl font-black text-white">创意历史档案</h2>
          <p className="text-slate-300 mt-2 text-sm md:text-base font-bold">已为您永久保存了 {items.length} 个创意方案</p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('确定要清空所有历史记录吗？此操作不可恢复。')) onClear();
          }}
          className="text-xs text-red-400 hover:text-red-300 px-3 py-1 rounded hover:bg-red-500/10 transition-colors font-bold uppercase tracking-widest"
        >
          清空记录
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => {
          const hasIterations = item.comparisonIterations && item.comparisonIterations.length > 0;

          return (
            <GlassCard
              key={item.id}
              className="group hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
              opacity={40}
            >
              <div className="aspect-[4/3] relative overflow-hidden border-b border-white/10 bg-white/5 cursor-pointer" onClick={() => onSelect(item)}>
                <GlassImage
                  src={item.imageUrl}
                  alt={item.recipe.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-20">
                  <span className="text-cyan-300 text-xs font-black uppercase tracking-widest">查看完整配方 →</span>
                </div>

                {/* Iteration Badge */}
                {hasIterations && (
                  <div
                    onClick={(e) => { e.stopPropagation(); setJourneyItem(item); }}
                    className="absolute top-3 right-3 px-2.5 py-1.5 bg-purple-600/90 backdrop-blur-md rounded-lg text-[9px] text-white font-black uppercase tracking-widest border border-purple-400/50 shadow-lg z-30 flex items-center gap-1.5 cursor-pointer hover:bg-purple-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    迭代记录
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-base line-clamp-1 flex-1 mr-2">{item.recipe.title}</h3>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black ${item.recipe.difficulty === 'Beginner' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                    item.recipe.difficulty === 'Intermediate' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                      'border-red-500/30 text-red-400 bg-red-500/10'
                    }`}>
                    {item.recipe.difficulty === 'Beginner' ? '入门' :
                      item.recipe.difficulty === 'Intermediate' ? '进阶' : '大师'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-2 mb-4 h-8 leading-relaxed font-medium">{item.recipe.description}</p>

                <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
                  {hasIterations ? (
                    <button
                      onClick={() => setJourneyItem(item)}
                      className="w-full py-2 bg-purple-600/30 hover:bg-purple-500 text-purple-100 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-purple-500/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      查看学习历程 ({item.comparisonIterations!.length}次)
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelect(item, true)}
                      className="w-full py-2 bg-cyan-600/30 hover:bg-cyan-500 text-cyan-100 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-cyan-500/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      开启对比评估
                    </button>
                  )}
                  <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-widest pt-1 px-1">
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <span>{item.recipe.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Comparison Journey Modal */}
      <ComparisonJourneyModal
        isOpen={!!journeyItem}
        onClose={() => setJourneyItem(null)}
        item={journeyItem}
      />
    </div>
  );
};

export default HistoryView;