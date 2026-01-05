import React, { useState } from 'react';
import GlassCard from './GlassCard';
import GlassImage from './GlassImage';
import { CommunityPost } from '../types';

interface CommunityPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: CommunityPost | null;
}

const CommunityPostModal: React.FC<CommunityPostModalProps> = ({ isOpen, onClose, post }) => {
    const [newComment, setNewComment] = useState('');

    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/90 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <GlassCard
                className="relative w-full max-w-5xl h-[85vh] md:h-[600px] flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300 border-white/20 overflow-hidden"
                opacity={100}
            >

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/70 rounded-full text-white/90 hover:text-white transition-colors z-50 backdrop-blur-md border border-white/10 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left/Top: Image Section */}
                {/* Mobile: Fixed height header. Desktop: Full height left panel */}
                <div className="md:w-[60%] h-64 md:h-full bg-black relative group shrink-0">
                    <GlassImage
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover md:object-contain"
                        containerClassName="w-full h-full"
                    />
                    {/* Gradient Overlay for Text */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-md">{post.title}</h2>
                        <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${post.authorAvatar} shadow-sm border border-white/20`}></div>
                            <span className="text-sm md:text-base font-bold text-slate-100 drop-shadow">{post.author}</span>
                        </div>
                    </div>
                </div>

                {/* Right/Bottom: Interaction Section */}
                <div className="md:w-[40%] flex flex-col flex-1 bg-slate-900/60 backdrop-blur-xl border-l border-white/10 min-h-0">

                    {/* Header Stats */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
                        <div className="flex items-center gap-5">
                            <span className="flex items-center gap-1.5 text-pink-400 font-bold text-sm bg-pink-500/10 px-2 py-1 rounded-md border border-pink-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                {post.likes}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-300 font-bold text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {post.comments.length} 讨论
                            </span>
                        </div>
                    </div>

                    {/* Comments List - SCROLLABLE */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
                        {post.comments.map((comment, idx) => (
                            <div key={idx} className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className={`
                                    w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-lg text-sm font-bold
                                    ${comment.isMaster
                                        ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                        : 'bg-slate-700 text-slate-300'}
                                `}>
                                    {comment.isMaster ? 'M' : comment.user.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold truncate ${comment.isMaster ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300' : 'text-slate-300'}`}>
                                                {comment.user}
                                            </span>
                                            {comment.isMaster && (
                                                <span className="text-[10px] uppercase font-black tracking-wider bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-[4px] border border-purple-500/30">
                                                    Master
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap ml-2">{comment.time}</span>
                                    </div>
                                    <div className={`text-sm leading-relaxed p-3 rounded-xl rounded-tl-none border ${comment.isMaster ? 'bg-purple-900/20 border-purple-500/20 text-purple-100' : 'bg-white/5 border-white/5 text-slate-200'}`}>
                                        {comment.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area - FIXED BOTTOM */}
                    <div className="p-3 md:p-4 bg-black/40 border-t border-white/10 shrink-0">
                        <div className="relative">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="参与讨论..."
                                className="w-full bg-slate-800/80 text-white text-sm rounded-xl pl-4 pr-12 py-3.5 border border-white/10 focus:border-cyan-500/50 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-slate-500"
                            />
                            <button
                                disabled={!newComment.trim()}
                                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-cyan-600 text-white disabled:opacity-0 disabled:scale-95 hover:bg-cyan-500 transition-all font-bold text-xs uppercase tracking-wider shadow-lg"
                            >
                                发送
                            </button>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default CommunityPostModal;
