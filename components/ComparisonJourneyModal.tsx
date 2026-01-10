import React from 'react';
import GlassCard from './GlassCard';
import GlassImage from './GlassImage';
import { HistoryItem } from '../types';

interface ComparisonJourneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: HistoryItem | null;
}

const ComparisonJourneyModal: React.FC<ComparisonJourneyModalProps> = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item || !item.comparisonIterations || item.comparisonIterations.length === 0) {
        return null;
    }

    const iterations = item.comparisonIterations;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/95 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/70 rounded-full text-white/90 hover:text-white transition-colors z-50 backdrop-blur-md border border-white/10 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header with AI Target */}
                <GlassCard className="p-6 mb-6" opacity={80}>
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="w-full lg:w-1/3">
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
                        <div className="flex-1">
                            <div className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-[10px] text-purple-300 font-black uppercase tracking-widest mb-3 border border-purple-500/30">
                                学习迭代记录
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white italic mb-3">{item.recipe.title}</h2>
                            <p className="text-slate-300 text-sm mb-4">{item.recipe.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {item.recipe.techniques.map((tech, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Iterations */}
                <div className="space-y-6">
                    {iterations.map((iteration, idx) => {
                        const isSuccess = iteration.aiScore >= 85;
                        const scoreColor = iteration.aiScore >= 85 ? 'text-emerald-400' : iteration.aiScore >= 70 ? 'text-amber-400' : 'text-red-400';
                        const scoreBg = iteration.aiScore >= 85 ? 'from-emerald-500/20 to-emerald-600/10' : iteration.aiScore >= 70 ? 'from-amber-500/20 to-amber-600/10' : 'from-red-500/20 to-red-600/10';

                        return (
                            <GlassCard key={idx} className="p-0 overflow-hidden" opacity={60}>
                                {/* Iteration Header */}
                                <div className={`p-4 bg-gradient-to-r ${scoreBg} border-b border-white/10 flex items-center justify-between`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${isSuccess ? 'from-emerald-400 to-teal-600' : 'from-amber-400 to-orange-600'} flex items-center justify-center text-white font-black text-sm border-2 border-white/20`}>
                                            {iteration.attemptNumber}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-widest">第 {iteration.attemptNumber} 次尝试</h4>
                                            <p className="text-[10px] text-slate-400">{new Date(iteration.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400 font-bold">AI 评分</span>
                                        <span className={`text-2xl font-black ${scoreColor}`}>{iteration.aiScore}</span>
                                        <span className="text-slate-500">/100</span>
                                    </div>
                                </div>

                                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* User's Attempt Image */}
                                    <div className="lg:col-span-4">
                                        <div className="relative rounded-2xl overflow-hidden border border-white/10">
                                            <GlassImage
                                                src={iteration.userImageUrl}
                                                alt={`尝试 ${iteration.attemptNumber}`}
                                                className="w-full aspect-square object-cover"
                                                containerClassName="w-full"
                                            />
                                            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-bold border border-white/10">
                                                我的实作
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Feedback */}
                                    <div className="lg:col-span-8 space-y-4">
                                        {/* AI Comment */}
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-[10px] text-white font-black">
                                                    AI
                                                </div>
                                                <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">AI 点评</span>
                                            </div>
                                            <p className="text-slate-200 text-sm italic leading-relaxed">"{iteration.aiFeedback}"</p>
                                        </div>

                                        {/* Strengths & Improvements */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                                                <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    做得好的地方
                                                </h5>
                                                <ul className="space-y-1">
                                                    {iteration.aiStrengths.map((s, i) => (
                                                        <li key={i} className="text-xs text-slate-300 flex items-start gap-1">
                                                            <span className="text-emerald-400 mt-0.5">•</span> {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                                                <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    改进建议
                                                </h5>
                                                <ul className="space-y-1">
                                                    {iteration.aiImprovements.map((s, i) => (
                                                        <li key={i} className="text-xs text-slate-300 flex items-start gap-1">
                                                            <span className="text-amber-400 mt-0.5">•</span> {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Master Endorsement */}
                                        {iteration.masterEndorsement && (
                                            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 rounded-2xl p-4 border border-amber-500/20">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-black text-[10px] border border-white/20">
                                                        师
                                                    </div>
                                                    <span className="text-xs font-black text-amber-400 uppercase tracking-widest">主理人意见</span>
                                                </div>
                                                <p className="text-slate-200 text-sm italic leading-relaxed">"{iteration.masterEndorsement}"</p>
                                            </div>
                                        )}

                                        {/* Success Badge */}
                                        {isSuccess && (
                                            <div className="flex items-center justify-center py-4">
                                                <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">达标通过！</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>

                {/* Overall Master Feedback */}
                {item.ownerFeedback && (
                    <GlassCard className="mt-6 p-6" opacity={70}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center border-2 border-white/20 shadow-lg">
                                <span className="text-white font-black text-lg italic">师</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">主理人总评</h4>
                                <p className="text-[10px] text-amber-500 font-bold">OVERALL PROJECT REVIEW</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <p className="text-slate-200 italic leading-relaxed">"{item.ownerFeedback}"</p>
                            <div className="flex justify-end mt-4">
                                <span className="text-[10px] text-slate-500 font-black italic">— 陈师傅, 艺术总监</span>
                            </div>
                        </div>
                    </GlassCard>
                )}
            </div>
        </div>
    );
};

export default ComparisonJourneyModal;
