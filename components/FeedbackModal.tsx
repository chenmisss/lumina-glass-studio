import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import GlassImage from './GlassImage';
import { HistoryItem } from '../types';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: HistoryItem | null;
    readOnly?: boolean;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, submission, readOnly = false }) => {
    const [comment, setComment] = useState('');
    const [isSending, setIsSending] = useState(false);

    // 当 submissions 变化时，重置预设评语
    useEffect(() => {
        if (submission) {
            setComment(`@${submission.userId} 你的这件作品《${submission.recipe.title}》很有潜力。
      
特别是材质的处理上，光泽感非常到位。建议在后续的退火工艺中，稍微延长保温时间，可以进一步减少内部应力纹。期待你的下一件作品！`);
        }
    }, [submission]);

    if (!isOpen || !submission) return null;

    const handleSend = () => {
        setIsSending(true);
        // 模拟发送延迟
        setTimeout(() => {
            setIsSending(false);
            alert('点评已发送！学生将收到您的指导反馈。');
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            {/* Modal Content */}
            <GlassCard className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-6 p-4 md:p-8 border-white/20 shadow-2xl animate-in zoom-in-95 duration-300" opacity={95}>

                {/* Close Button - Sticky to keep it visible */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-white/20 rounded-full text-slate-400 hover:text-white transition-colors z-50 backdrop-blur-sm border border-white/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left: Visual Comparison */}
                <div className="w-full md:w-1/3 flex flex-col gap-4 pt-8 md:pt-0">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        视觉核验
                    </h3>

                    <div className="space-y-4">
                        <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-[4/3]">
                            <GlassImage
                                src={submission.imageUrl}
                                alt="Student Work"
                                className="w-full h-full object-cover"
                                containerClassName="w-full h-full"
                            />
                            <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur text-[10px] text-white font-bold rounded-lg border border-white/10">
                                学员实作
                            </div>
                        </div>

                        <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-[4/3] grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                            {/* 这里的图片还是用同一张，但在真实场景中应该是 Prototype Image */}
                            <GlassImage
                                src={submission.imageUrl}
                                alt="Design Prototype"
                                className="w-full h-full object-cover"
                                containerClassName="w-full h-full"
                            />
                            <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur text-[10px] text-slate-300 font-bold rounded-lg border border-white/10">
                                设计原型
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Analysis & Feedback */}
                <div className="w-full md:w-2/3 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-white italic mb-2">{submission.recipe.title}</h2>
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                                {submission.recipe.difficulty}
                            </span>
                            <span className="text-slate-400 text-sm font-medium">By {submission.userId}</span>
                        </div>
                    </div>

                    {/* AI Score Dashboard */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                            <div className="text-xs text-slate-400 font-bold uppercase mb-1">形态还原</div>
                            <div className="text-xl font-black text-emerald-400">92%</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                            <div className="text-xs text-slate-400 font-bold uppercase mb-1">色彩准确</div>
                            <div className="text-xl font-black text-cyan-400">88%</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                            <div className="text-xs text-slate-400 font-bold uppercase mb-1">工艺难度</div>
                            <div className="text-xl font-black text-orange-400">High</div>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col gap-2 mb-6">
                        <label className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center justify-between">
                            <span>大师评语</span>
                            <span className="text-[10px] text-slate-500 font-normal normal-case">Markdown supported</span>
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => !readOnly && setComment(e.target.value)}
                            readOnly={readOnly}
                            className={`flex-grow w-full bg-black/20 text-white p-4 rounded-xl border border-white/10 focus:outline-none transition-all resize-none font-medium leading-relaxed min-h-[150px]
                                ${readOnly ? 'cursor-default opacity-90' : 'focus:border-cyan-500/50 focus:bg-black/40'}
                                `}
                            placeholder={readOnly ? "暂无评语" : "写下您的指导意见..."}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-auto">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            {readOnly ? '关闭' : '取消'}
                        </button>
                        {!readOnly && (
                            <button
                                onClick={handleSend}
                                disabled={isSending}
                                className="px-8 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-black shadow-lg shadow-purple-900/40 transform active:scale-95 transition-all flex items-center gap-2"
                            >
                                {isSending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        发送中...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                                        </svg>
                                        发送指导
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                </div>
            </GlassCard>
        </div>
    );
};

export default FeedbackModal;
