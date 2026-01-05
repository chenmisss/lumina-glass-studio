import React, { useState } from 'react';
import CommunityGallery from './CommunityGallery';
import InputSection from './InputSection';
import ResultView from './ResultView';
import GlassCard from './GlassCard';
import { AppState, GeneratedDesign, User } from '../types';

interface HobbyistDashboardProps {
  user: User;
  appState: AppState;
  data: GeneratedDesign | null;
  error: string | null;
  onGenerate: (prompt: string, image?: string | null) => void;
}

const HobbyistDashboard: React.FC<HobbyistDashboardProps> = ({
  user, appState, data, error, onGenerate
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCopyPrompt = (newPrompt: string) => {
    setPrompt(newPrompt);
    const inputElement = document.querySelector('input[type="text"]');
    if (inputElement) {
      inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (inputElement as HTMLInputElement).focus();
    }
  };

  return (
    <div className="max-w-7xl mx-auto fade-in-standard">
      {/* 社区灵感 */}
      <CommunityGallery onCopyPrompt={handleCopyPrompt} />

      {/* 主创作区 */}
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-center mb-10">
          <GlassCard
            className="px-5 py-2.5 flex items-center gap-3 border-cyan-500/20 cursor-pointer hover:bg-cyan-500/10 transition-colors group"
            opacity={30}
          >
            <div className="relative" onClick={() => handleCopyPrompt('吹制拉丝玻璃工艺')}>
              <span className="block w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform"></span>
              <span className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
            <span className="text-cyan-100 text-[11px] md:text-xs font-bold tracking-wider" onClick={() => handleCopyPrompt('吹制拉丝玻璃工艺')}>
              大师建议：您当前的 {user.level} 技艺已趋成熟，建议尝试 <span className="text-white underline underline-offset-4 decoration-cyan-500/50 group-hover:text-cyan-300">吹制拉丝</span> 进阶挑战。
            </span>
          </GlassCard>
        </div>

        <InputSection
          prompt={prompt}
          setPrompt={setPrompt}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          onGenerate={onGenerate}
          appState={appState}
        />

        {appState === AppState.ERROR && (
          <div className="max-w-2xl mx-auto mt-8">
            <GlassCard className="p-5 border-red-500/30 bg-red-900/10">
              <div className="flex items-center gap-4 text-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div>
                  <h3 className="font-bold text-sm">生成失败</h3>
                  <p className="text-xs text-red-300/80">{error}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {data && (appState === AppState.COMPLETE) && (
          <ResultView data={data} />
        )}

        {(appState === AppState.ANALYZING || appState === AppState.RENDERING) && !data && (
          <div className="max-w-4xl mx-auto mt-12 md:mt-20 text-center">
            <div className="inline-block relative">
              <div className="w-20 h-20 md:w-28 md:h-28 border-[3px] border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"></div>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-black text-white mt-8 tracking-widest animate-pulse">
              {appState === AppState.ANALYZING ? "AI 正在调制设计参数..." : "正在从 3D 熔炉中渲染成品图..."}
            </h3>
            <p className="text-slate-500 text-xs mt-3 font-medium uppercase tracking-[0.3em]">正在为您量身定制配方</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HobbyistDashboard;