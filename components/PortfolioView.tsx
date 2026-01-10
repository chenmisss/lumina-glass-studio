import React, { useState } from 'react';
import GlassCard from './GlassCard';
import GlassImage from './GlassImage';
import { HistoryItem, ViewMode } from '../types';
import { storageService } from '../services/storageService';
import { generateCraftDescription } from '../services/geminiService';
import CommunityPostModal from './CommunityPostModal';
import { CommunityPost } from '../types';

interface PortfolioViewProps {
  items: HistoryItem[];
  onNavigate: (view: ViewMode) => void;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ items, onNavigate }) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modalItem, setModalItem] = useState<HistoryItem | null>(null);

  // Track which item is expanded (default to first item)
  const [expandedItemId, setExpandedItemId] = useState<string | null>(items.length > 0 ? items[0].id : null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setUploadModalOpen(true);
        setDescription('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiAssist = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const aiText = await generateCraftDescription(selectedImage);
      setDescription(aiText);
    } catch (error) {
      console.error(error);
      setDescription("AI 灵感枯竭了，请稍后再试...");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublish = () => {
    if (!selectedImage) return;
    const user = storageService.getCurrentUser();
    if (user) {
      storageService.saveDesign(user.id, {
        imageUrl: selectedImage,
        recipe: {
          title: '我的新作',
          description: description || '这是我最新创作的玻璃艺术作品。',
          techniques: ['手工制作'],
          difficulty: 'Intermediate',
          estimatedTime: '未知',
          materials: ['玻璃'],
          steps: [],
          visualPrompt: ''
        }
      });
      setUploadModalOpen(false);
      window.location.reload();
    }
  };

  const handleComment = (postId: string, content: string) => {
    const user = storageService.getCurrentUser();
    if (!user) return;
    storageService.addPortfolioComment(postId, content, user);
  };

  const mapHistoryToPost = (item: HistoryItem): CommunityPost => {
    return {
      id: item.id,
      author: 'Me',
      authorAvatar: 'from-cyan-400 to-blue-600',
      imageUrl: item.userUploadedImageUrl || item.imageUrl,
      title: item.recipe.title,
      likes: item.socialRecords?.likes || 0,
      isLiked: false,
      comments: item.socialRecords?.comments.map(c => ({
        ...c,
        avatar: c.user === 'Lumina Master' || c.user === '陈师傅' ? 'from-blue-600 to-indigo-600' : undefined,
        isMaster: c.user === 'Lumina Master' || c.user === '陈师傅'
      })) || []
    };
  };

  const expandedItem = items.find(i => i.id === expandedItemId);
  const collapsedItems = items.filter(i => i.id !== expandedItemId);

  // Empty state
  if (items.length === 0 && !uploadModalOpen) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center fade-in-standard">
        <GlassCard className="p-12 border-dashed border-white/10" opacity={30}>
          <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-4">开启您的作品会议</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            在这里收录您最满意的实作作品，主理人的深度点评和同学们的点赞都会汇聚于此。
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate('history')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-black text-sm uppercase tracking-widest transition-all"
            >
              从档案导入
            </button>
            <div className="relative overflow-hidden rounded-full">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileSelect}
              />
              <button className="px-8 py-3 bg-white text-slate-900 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                直接上传新作
              </button>
            </div>
          </div>
        </GlassCard>
        {uploadModalOpen && renderUploadModal()}
      </div>
    );
  }

  function renderUploadModal() {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setUploadModalOpen(false)}></div>
        <GlassCard className="relative w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 border-white/20" opacity={100}>
          <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-black">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white">收录新作</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-black border border-white/10">
                <img src={selectedImage || ''} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  作品描述 / 心得
                </label>
                <div className="relative flex-1">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="写下您的创作灵感、使用的工艺，或者想对大家说的话..."
                    className="w-full h-full min-h-[150px] bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none mb-14"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      onClick={handleAiAssist}
                      disabled={isAnalyzing}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                        ${isAnalyzing
                          ? 'bg-purple-500/20 border-purple-500/30 text-purple-300 cursor-wait'
                          : 'bg-purple-600 hover:bg-purple-500 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'}`}
                    >
                      {isAnalyzing ? 'AI 构思中...' : 'AI 帮我写文案'}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handlePublish}
                  className="mt-auto w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg transition-all"
                >
                  确认收录
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Render expanded item section
  function renderExpandedItem(item: HistoryItem) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 animate-in fade-in duration-500">
        {/* Left: Image */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className="relative group overflow-hidden rounded-3xl border border-white/20 aspect-square shadow-2xl cursor-pointer"
            onClick={() => setModalItem(item)}
          >
            <GlassImage
              src={item.userUploadedImageUrl || item.imageUrl}
              alt={item.recipe.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              containerClassName="w-full h-full"
            />
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-black uppercase tracking-widest border border-white/10 z-20">
              {item.userUploadedImageUrl ? '实作作品' : 'AI 原型'}
            </div>
            {/* Expand indicator */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-purple-600/80 backdrop-blur-md rounded-full text-[10px] text-white font-black uppercase tracking-widest border border-purple-400/30 z-20 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m10.5 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15m-6 0L3.75 20.25m16.5-16.5L15 9" />
              </svg>
              当前展开
            </div>
          </div>
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-black text-white italic">{item.recipe.title}</h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase">{new Date(item.timestamp).toLocaleDateString()}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-sm text-slate-300 leading-relaxed italic">
            "{item.recipe.description}"
          </div>
        </div>

        {/* Right: Feedback & Social */}
        <div className="lg:col-span-7 space-y-6">
          {/* Master Feedback */}
          <GlassCard className="p-6 md:p-8 relative overflow-hidden group hover:border-amber-500/30 transition-colors" opacity={60}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center border-2 border-white/20 shadow-lg">
                <span className="text-white font-black italic">师</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">主理人批示</h4>
                <p className="text-[10px] text-amber-500 font-bold">STUDIO MASTER'S PRIVATE NOTE</p>
              </div>
            </div>
            {item.ownerFeedback ? (
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                <p className="text-slate-200 italic leading-relaxed text-sm md:text-base mb-4">
                  "{item.ownerFeedback}"
                </p>
                <div className="flex justify-end">
                  <span className="text-[10px] text-slate-500 font-black italic">— 陈师傅, 艺术总监</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">等待主理人审阅中...</p>
              </div>
            )}
          </GlassCard>

          {/* Social Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard
              className="p-5 hover:bg-white/5 transition-colors cursor-pointer group"
              opacity={40}
              onClick={() => setModalItem(item)}
            >
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-[10px] font-black text-pink-400 uppercase tracking-widest group-hover:text-pink-300 transition-colors">最近获得点赞</h5>
                <span className="text-xs text-white font-black">{item.socialRecords?.likes || 0}</span>
              </div>
              <div className="flex -space-x-2">
                {[
                  { char: '王', color: 'from-purple-400 to-pink-600' },
                  { char: 'C', color: 'from-emerald-400 to-teal-600' },
                  { char: 'L', color: 'from-orange-400 to-red-600' },
                  { char: 'Z', color: 'from-cyan-400 to-blue-600' }
                ].map((avatar, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-gradient-to-br ${avatar.color} flex items-center justify-center text-[10px] text-white font-black shadow-lg`}>
                    {avatar.char}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 font-black">
                  +{Math.max(0, (item.socialRecords?.likes || 0) - 4)}
                </div>
              </div>
            </GlassCard>

            <GlassCard
              className="p-5 hover:bg-white/5 transition-colors cursor-pointer group"
              opacity={40}
              onClick={() => setModalItem(item)}
            >
              <h5 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4 group-hover:text-cyan-300 transition-colors">同学评价 (点击互动)</h5>
              <div className="space-y-3">
                {item.socialRecords?.comments.slice(0, 2).map((comment, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-black text-white mr-2">{comment.user}:</span>
                    <span className="text-slate-400">{comment.content}</span>
                  </div>
                )) || (
                    <p className="text-[10px] text-slate-600 font-bold italic">尚无公开评论，点击发起讨论</p>
                  )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 pb-16 md:pb-20 fade-in-standard">
      {/* Header */}
      <div className="mb-6 md:mb-12 flex flex-col gap-4">
        <div>
          <div className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-[10px] text-purple-300 font-black uppercase tracking-widest mb-3 border border-purple-500/30">
            Portfolio Showcase
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-white italic tracking-tighter">作品会议室</h2>
          <p className="text-slate-400 mt-2 md:mt-3 font-bold text-sm">收录了您 {items.length} 件高光玻璃作品</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4">
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              onChange={handleFileSelect}
            />
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl border border-white/20 flex flex-col items-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
              <span className="text-[10px] md:text-xs text-white/90 font-black uppercase tracking-tighter mb-0.5 md:mb-1">拍摄/上传</span>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
                <span className="text-sm font-black text-white">新作存档</span>
              </div>
            </div>
          </div>
          <div className="bg-black/40 px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-tighter">点赞</span>
            <span className="text-xl font-black text-pink-500">{items.reduce((acc, i) => acc + (i.socialRecords?.likes || 0), 0)}</span>
          </div>
          <div className="bg-black/40 px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-tighter">点评</span>
            <span className="text-xl font-black text-cyan-400">{items.filter(i => i.ownerFeedback).length}</span>
          </div>
        </div>
      </div>

      {/* Expanded Item */}
      {expandedItem && renderExpandedItem(expandedItem)}

      {/* Collapsed Items Grid */}
      {collapsedItems.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-slate-500 rounded-full"></div>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">其他作品</h4>
            <span className="text-xs text-slate-600">点击展开</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collapsedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setExpandedItemId(item.id)}
                className="group cursor-pointer"
              >
                <GlassCard className="p-0 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]" opacity={50}>
                  <div className="aspect-square relative">
                    <GlassImage
                      src={item.userUploadedImageUrl || item.imageUrl}
                      alt={item.recipe.title}
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m10.5 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15m-6 0L3.75 20.25m16.5-16.5L15 9" />
                        </svg>
                        展开
                      </span>
                    </div>
                    {item.ownerFeedback && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-white font-black border border-white/30 shadow-lg">
                        师
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-slate-900/80">
                    <h5 className="text-xs font-black text-white truncate">{item.recipe.title}</h5>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                      <div className="flex items-center gap-1 text-[10px] text-pink-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {item.socialRecords?.likes || 0}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && renderUploadModal()}

      {/* Interaction Modal */}
      <CommunityPostModal
        isOpen={!!modalItem}
        onClose={() => setModalItem(null)}
        post={modalItem ? mapHistoryToPost(modalItem) : null}
        onComment={handleComment}
        onCopyPrompt={() => { }}
      />
    </div>
  );
};

export default PortfolioView;