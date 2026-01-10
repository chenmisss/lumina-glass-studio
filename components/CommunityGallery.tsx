import React, { useState } from 'react';
import GlassCard from './GlassCard';
import GlassImage from './GlassImage';
import { storageService } from '../services/storageService';
import CommunityPostModal from './CommunityPostModal';
import { CommunityPost } from '../types';

interface CommunityGalleryProps {
  onCopyPrompt: (prompt: string) => void;
}

const CommunityGallery: React.FC<CommunityGalleryProps> = ({ onCopyPrompt }) => {
  const [posts, setPosts] = useState(storageService.getCommunityPosts());
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: string, content: string) => {
    const currentUser = storageService.getCurrentUser();
    if (!currentUser) {
      alert('请先登录');
      return;
    }
    const updatedPosts = storageService.addCommunityComment(postId, content, currentUser);
    setPosts(updatedPosts);
    // Also update the selected post to reflect changes immediately
    const updatedPost = updatedPosts.find(p => p.id === postId);
    if (updatedPost) setSelectedPost(updatedPost);
  };

  return (

    <>
      <div className="mb-12 px-4 md:px-6 fade-in-standard overflow-hidden">
        <div className="flex justify-between items-end mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-cyan-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.5)]"></div>
            <div>
              <h3 className="text-xl font-bold text-white">灵感长廊</h3>
              <p className="text-[10px] text-slate-300 uppercase tracking-widest font-black">Community Inspirations</p>
            </div>
          </div>
          <button
            onClick={() => alert('更多社区佳作即将上线，敬请期待！')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            浏览全部
          </button>
        </div>

        <div className="flex overflow-x-auto pb-4 gap-5 snap-x hide-scrollbar">
          {posts.map((post) => (
            <div key={post.id} className="snap-start shrink-0 w-[280px] md:w-[340px]">
              <GlassCard className="h-full flex flex-col group p-0 overflow-hidden border-white/20" opacity={50}>
                <div
                  className="aspect-[4/3] overflow-hidden relative bg-slate-900 cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <GlassImage
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-20">
                    <button
                      onClick={(e) => { e.stopPropagation(); onCopyPrompt(`我想尝试“${post.title}”的设计风格`); }}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-black border border-white/30 text-white shadow-xl transition-all hover:scale-105"
                    >
                      获取灵感
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/95 backdrop-blur-md border-t border-white/5 cursor-pointer" onClick={() => setSelectedPost(post)}>
                  <h4 className="font-bold text-white text-base mb-4 truncate italic">{post.title}</h4>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${post.authorAvatar} flex items-center justify-center text-[11px] text-white font-black border border-white/30 shadow-sm`}>
                        {post.author.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-200 font-bold">{post.author}</span>
                    </div>

                    <div
                      onClick={(e) => handleLike(post.id, e)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all duration-300 active:scale-90 ${post.isLiked
                        ? 'bg-pink-500/25 border-pink-500/60 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                        : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10'
                        }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4.5 w-4.5 transition-all duration-300 ${post.isLiked ? 'scale-110 fill-current' : 'fill-none stroke-current'}`}
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span className={`text-xs font-black min-w-[20px] text-center ${post.isLiked ? 'text-white' : 'text-white/70'}`}>{post.likes}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>

      <CommunityPostModal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        post={selectedPost}
        onComment={handleComment}
      />
    </>
  );
};

export default CommunityGallery;