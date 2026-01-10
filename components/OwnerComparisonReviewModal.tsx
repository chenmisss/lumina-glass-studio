import React, { useState } from 'react';
import GlassCard from './GlassCard';
import GlassImage from './GlassImage';
import { HistoryItem } from '../types';

interface OwnerComparisonReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: HistoryItem | null;
    onAccept?: (itemId: string, feedback: string) => void;
}

const OwnerComparisonReviewModal: React.FC<OwnerComparisonReviewModalProps> = ({
    isOpen,
    onClose,
    item,
    onAccept
}) => {
    const [ownerNote, setOwnerNote] = useState('');
    const [isAccepting, setIsAccepting] = useState(false);

    if (!isOpen || !item) return null;

    const iterations = item.comparisonIterations || [];
    const hasIterations = iterations.length > 0;
    const isAccepted = !!item.ownerFeedback;
    const latestScore = hasIterations ? iterations[iterations.length - 1].aiScore : null;

    const handleAccept = () => {
        if (!onAccept) return;
        setIsAccepting(true);
        setTimeout(() => {
            onAccept(item.id, ownerNote || '作品已通过验收，恭喜！');
            setIsAccepting(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/95 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl mt-2 md:mt-0 animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/70 rounded-full text-white/90 hover:text-white transition-colors z-50 backdrop-blur-md border border-white/10 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header - AI Target + Student Info */}
                <GlassCard className="p-4 md:p-6 mb-4" opacity={80}>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        {/* AI Target Image */}
                        <div className="w-full md:w-1/3">
                            <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                                <GlassImage
                                    src={item.imageUrl}
                                    alt="AI 目标设计"
                                    className="w-full aspect-square object-cover"
                                    containerClassName="w-full"
                                />
                                <div className="absolute top-3 left-3 px-3 py-1.5 bg-cyan-600/90 backdrop-blur-md rounded-full text-[10px] text-white font-black uppercase tracking-widest border border-cyan-400/50">
                                    🎯 AI 目标设计
                                </div>
                            </div>
                        </div>
                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black border border-white/20">
                                    {item.userId.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white">{item.userId}</h3>
                                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">学员作品评审</span>
                                </div>
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-white italic mb-2">{item.recipe.title}</h2>
                            <p className="text-slate-300 text-sm mb-3">{item.recipe.description}</p>

                            {/* Status Badge */}
                            {isAccepted ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">已验收通过</span>
                                </div>
                            ) : latestScore && latestScore >= 85 ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full border border-amber-500/30">
                                    <span className="text-sm font-black text-amber-400">AI 评分 {latestScore} - 待主理人验收</span>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-500/20 rounded-full border border-slate-500/30">
                                    <span className="text-sm font-bold text-slate-400">进行中 - {hasIterations ? `${iterations.length}次迭代` : '暂无迭代'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </GlassCard>

                {/* Iterations */}
                {hasIterations ? (
                    <div className="space-y-4 mb-4">
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">迭代历程 ({iterations.length}次)</h4>
                        {iterations.map((iteration, idx) => {
                            const isSuccess = iteration.aiScore >= 85;
                            const scoreColor = iteration.aiScore >= 85 ? 'text-emerald-400' : iteration.aiScore >= 70 ? 'text-amber-400' : 'text-red-400';

                            return (
                                <GlassCard key={idx} className="p-0 overflow-hidden" opacity={60}>
                                    <div className={`p-3 bg-gradient-to-r ${isSuccess ? 'from-emerald-500/20 to-emerald-600/10' : 'from-amber-500/20 to-amber-600/10'} border-b border-white/10 flex items-center justify-between`}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${isSuccess ? 'from-emerald-400 to-teal-600' : 'from-amber-400 to-orange-600'} flex items-center justify-center text-white font-black text-xs`}>
                                                {iteration.attemptNumber}
                                            </div>
                                            <span className="text-xs font-black text-white">第 {iteration.attemptNumber} 次尝试</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className={`text-xl font-black ${scoreColor}`}>{iteration.aiScore}</span>
                                            <span className="text-slate-500 text-xs">/100</span>
                                        </div>
                                    </div>

                                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* User Image */}
                                        <div className="relative rounded-xl overflow-hidden border border-white/10">
                                            <GlassImage
                                                src={iteration.userImageUrl}
                                                alt={`尝试 ${iteration.attemptNumber}`}
                                                className="w-full aspect-square object-cover"
                                                containerClassName="w-full"
                                            />
                                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] text-white font-bold">
                                                学员实作
                                            </div>
                                        </div>

                                        {/* AI Feedback */}
                                        <div className="md:col-span-2 space-y-3">
                                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-[8px] text-white font-black">AI</div>
                                                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">AI 点评</span>
                                                </div>
                                                <p className="text-slate-200 text-xs italic">"{iteration.aiFeedback}"</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-emerald-500/10 rounded-lg p-2 border border-emerald-500/20">
                                                    <h5 className="text-[9px] font-black text-emerald-400 uppercase mb-1">✓ 优点</h5>
                                                    <ul className="space-y-0.5">
                                                        {iteration.aiStrengths.map((s, i) => (
                                                            <li key={i} className="text-[10px] text-slate-300">• {s}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="bg-amber-500/10 rounded-lg p-2 border border-amber-500/20">
                                                    <h5 className="text-[9px] font-black text-amber-400 uppercase mb-1">⚠ 改进</h5>
                                                    <ul className="space-y-0.5">
                                                        {iteration.aiImprovements.map((s, i) => (
                                                            <li key={i} className="text-[10px] text-slate-300">• {s}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {iteration.masterEndorsement && (
                                                <div className="bg-amber-500/10 rounded-lg p-2 border border-amber-500/20">
                                                    <span className="text-[9px] font-black text-amber-400">师 主理人附注:</span>
                                                    <p className="text-[10px] text-slate-300 mt-1">"{iteration.masterEndorsement}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                ) : (
                    <GlassCard className="p-6 mb-4 text-center" opacity={40}>
                        <p className="text-slate-400">该学员尚未开始迭代对比</p>
                    </GlassCard>
                )}

                {/* Owner Acceptance Section */}
                {!isAccepted ? (
                    <GlassCard className="p-4 md:p-6" opacity={70}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center border-2 border-white/20">
                                <span className="text-white font-black text-sm">师</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">主理人验收</h4>
                                <p className="text-[10px] text-slate-400">验收后学员将无法继续提交新的对比</p>
                            </div>
                        </div>

                        <textarea
                            value={ownerNote}
                            onChange={(e) => setOwnerNote(e.target.value)}
                            placeholder="输入验收评语（可选）..."
                            className="w-full bg-black/20 text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50 focus:bg-black/40 transition-all resize-none font-medium leading-relaxed min-h-[100px] mb-4"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                暂不验收
                            </button>
                            <button
                                onClick={handleAccept}
                                disabled={isAccepting || !latestScore || latestScore < 85}
                                className={`px-8 py-2 rounded-xl font-black shadow-lg transform active:scale-95 transition-all flex items-center gap-2 ${latestScore && latestScore >= 85
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/40'
                                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                {isAccepting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        验收中...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        确认验收通过
                                    </>
                                )}
                            </button>
                        </div>
                    </GlassCard>
                ) : (
                    <GlassCard className="p-4 md:p-6" opacity={70}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center border-2 border-white/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest">已验收通过</h4>
                                <p className="text-[10px] text-slate-400">此作品已完成验收，学员无法再提交对比</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-slate-200 italic">"{item.ownerFeedback}"</p>
                        </div>
                    </GlassCard>
                )}
            </div>
        </div>
    );
};

export default OwnerComparisonReviewModal;
