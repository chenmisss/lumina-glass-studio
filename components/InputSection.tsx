import React from 'react';
import GlassCard from './GlassCard';
import { AppState } from '../types';

interface InputSectionProps {
  prompt: string;
  setPrompt: (value: string) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  onGenerate: (prompt: string, image?: string | null) => void;
  appState: AppState;
}

const InputSection: React.FC<InputSectionProps> = ({ prompt, setPrompt, selectedImage, setSelectedImage, onGenerate, appState }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 简单压缩/转换为 Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow submit if there is text OR an image
    if ((prompt.trim() || selectedImage) && (appState === AppState.IDLE || appState === AppState.COMPLETE || appState === AppState.ERROR)) {
      onGenerate(prompt, selectedImage);
    }
  };

  const isLoading = appState === AppState.ANALYZING || appState === AppState.RENDERING;

  return (
    <section className="max-w-4xl mx-auto mb-10 md:mb-16 px-4 fade-in-standard">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tighter">
          构想您的玻璃艺术
        </h2>
        <p className="text-slate-200 text-sm md:text-lg max-w-2xl mx-auto font-medium">
          描述您想制作的玻璃作品，或<span className="text-cyan-400 font-bold">拍摄实物</span>让 AI 解析工艺。Lumina AI 将为您生成视觉概念图和详细制作配方。
        </p>
      </div>

      <GlassCard className="p-1 md:p-1.5 border-white/20" opacity={50}>
        <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-1">
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Camera/Image Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 sm:px-4 text-slate-400 hover:text-white transition-colors border-r border-white/10 ${selectedImage ? 'text-cyan-400' : ''}`}
            title="拍摄或上传图片"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </button>

          {/* Image Preview Thumbnail */}
          {selectedImage && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 z-10 group">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 shadow-lg relative">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder={selectedImage ? "补充描述 (可选)..." : "例如：一个带有蓝色螺旋纹理的穆拉诺风格花瓶..."}
            className={`flex-grow bg-transparent text-white placeholder-slate-400/50 py-4 text-base md:text-lg outline-none border-none font-medium tracking-wide ${selectedImage ? 'pl-16' : 'px-4'}`}
          />
          <button
            type="submit"
            disabled={isLoading || (!prompt.trim() && !selectedImage)}
            className={`
              sm:mr-1 px-8 py-3.5 sm:py-3 rounded-xl font-black transition-all text-sm uppercase tracking-[0.2em] min-w-[140px]
              ${isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]'}
            `}
          >
            {isLoading ? (
              <span className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="animate-pulse">AI 解析中...</span>
              </span>
            ) : selectedImage ? '反向工坊' : '即刻生成'}
          </button>
        </form>
      </GlassCard>

      <div className="flex flex-wrap gap-2 justify-center mt-6">
        {["海洋回响", "琥珀几何", "星云涡流", "磨砂极简"].map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => setPrompt(suggestion)}
            className="px-4 py-2 rounded-full text-[11px] font-bold bg-white/10 border border-white/20 hover:border-cyan-400 hover:text-cyan-400 text-white/80 transition-all uppercase tracking-wider backdrop-blur-sm"
          >
            #{suggestion}
          </button>
        ))}
      </div>
    </section>
  );
};

export default InputSection;