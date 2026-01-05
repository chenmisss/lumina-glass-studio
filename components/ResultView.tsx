import React, { useState, useRef } from 'react';
import GlassCard from './GlassCard';
import GlassImage from './GlassImage';
import { GeneratedDesign, ComparisonResult } from '../types';
import { compareDesigns } from '../services/geminiService';

interface ResultViewProps {
  data: GeneratedDesign;
}

const difficultyMap: Record<string, string> = {
  'Beginner': '入门',
  'Intermediate': '进阶',
  'Advanced': '高级',
  'Master': '大师级'
};

const ResultView: React.FC<ResultViewProps> = ({ data }) => {
  const { imageUrl, recipe } = data;
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setComparisonResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompare = async () => {
    if (!userImage) return;

    setIsComparing(true);
    try {
      const result = await compareDesigns(imageUrl, userImage);
      setComparisonResult(result);
    } catch (error) {
      console.error("Comparison failed", error);
      alert("对比分析失败，请稍后重试。");
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 space-y-8 md:space-y-12 fade-in-standard">

      {/* 顶部：设计与配方 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* 左侧：视觉效果 */}
        <div className="space-y-4 md:space-y-6">
          <GlassCard className="group overflow-hidden relative aspect-square md:aspect-[4/3] flex items-center justify-center bg-black/50" opacity={30}>
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"></div>

            <GlassImage
              src={imageUrl}
              alt={recipe.title}
              className="relative z-10 w-full h-full object-contain p-4 drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
              containerClassName="w-full h-full"
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent z-20">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{recipe.title}</h3>
              <p className="text-slate-300 text-xs md:text-sm line-clamp-2">{recipe.description}</p>
            </div>
          </GlassCard>

          {/* 指标卡片 */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <GlassCard className="p-3 md:p-4 flex flex-col items-center justify-center text-center" opacity={40}>
              <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest mb-1">难度等级</span>
              <span className={`text-base md:text-lg font-bold ${recipe.difficulty === 'Beginner' ? 'text-green-400' :
                  recipe.difficulty === 'Intermediate' ? 'text-yellow-400' :
                    recipe.difficulty === 'Advanced' ? 'text-orange-400' : 'text-red-500'
                }`}>
                {difficultyMap[recipe.difficulty] || recipe.difficulty}
              </span>
            </GlassCard>
            <GlassCard className="p-3 md:p-4 flex flex-col items-center justify-center text-center" opacity={40}>
              <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest mb-1">预计耗时</span>
              <span className="text-base md:text-lg font-bold text-white">{recipe.estimatedTime}</span>
            </GlassCard>
          </div>
        </div>

        {/* 右侧：详细配方 */}
        <div className="space-y-6">
          <GlassCard className="h-full p-5 md:p-8 overflow-y-auto max-h-[800px]" opacity={80}>
            <div className="border-b border-white/10 pb-5 md:pb-6 mb-5 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">制作指南</h2>

              <div className="mb-4">
                <h4 className="text-xs md:text-sm font-semibold text-cyan-300 uppercase tracking-wide mb-2">所需技法</h4>
                <div className="flex flex-wrap gap-2">
                  {recipe.techniques.map((tech, i) => (
                    <span key={i} className="px-2 py-1 md:px-3 md:py-1 bg-white/10 rounded-md text-xs md:text-sm border border-white/5 text-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs md:text-sm font-semibold text-cyan-300 uppercase tracking-wide mb-2">原材料</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recipe.materials.map((mat, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-cyan-500 mt-1">•</span> {mat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <h3 className="text-lg md:text-xl font-bold text-white">工艺步骤</h3>
              {recipe.steps.map((step) => (
                <div key={step.stepNumber} className="relative pl-6 md:pl-8 border-l border-white/10 group">
                  <span className="absolute -left-[9px] top-0 w-[18px] h-[18px] rounded-full bg-slate-800 border-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors"></span>
                  <h5 className="text-cyan-200 font-bold mb-1 text-sm md:text-base">第 {step.stepNumber} 步</h5>
                  <p className="text-slate-200 mb-2 leading-relaxed text-sm md:text-base">{step.instruction}</p>
                  {step.tip && (
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-3 text-sm text-cyan-100 flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0 text-cyan-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-11.532 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                      <span><strong>大师提醒：</strong> {step.tip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 对比区块分割线 */}
      <div id="comparison-section" className="relative py-4 scroll-mt-24">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#0f172a] px-3 py-1 md:px-4 text-cyan-200 font-black tracking-[0.3em] uppercase text-xs md:text-sm">工艺对比与 AI 评定</span>
        </div>
      </div>

      {/* 对比界面 */}
      <GlassCard className="p-5 md:p-8" opacity={40}>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 md:mb-6 text-center italic">
            实作对比验收
          </h2>

          {!userImage ? (
            <div className="w-full max-w-md">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[2/1] border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400 hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="p-3 md:p-4 rounded-full bg-white/5 group-hover:scale-110 transition-transform mb-2 md:mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-cyan-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                </div>
                <span className="font-black text-sm md:text-base tracking-widest">上传您的成品实拍图</span>
                <span className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest opacity-60">获取大师级 AI 指导意见</span>
              </button>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center mb-6 md:mb-8">
                {/* 原型 */}
                <div className="flex-1 w-full max-w-sm">
                  <p className="text-center text-[10px] text-cyan-300 mb-3 uppercase tracking-[0.3em] font-black">AI 生成原型</p>
                  <div className="rounded-xl overflow-hidden border border-white/20 aspect-square bg-black/40">
                    <GlassImage src={imageUrl} containerClassName="w-full h-full" className="w-full h-full object-contain" alt="Original" />
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white/5 font-black text-white/20 text-xl border border-white/10">
                  VS
                </div>

                {/* 实拍 */}
                <div className="flex-1 w-full max-w-sm">
                  <p className="text-center text-[10px] text-cyan-300 mb-3 uppercase tracking-[0.3em] font-black">您的实作作品</p>
                  <div className="rounded-xl overflow-hidden border border-white/20 aspect-square bg-black/40 relative group">
                    <GlassImage src={userImage} containerClassName="w-full h-full" className="w-full h-full object-cover" alt="User" />
                    <button
                      onClick={() => setUserImage(null)}
                      className="absolute top-2 right-2 p-2 bg-black/60 rounded-full hover:bg-red-500/80 text-white transition-colors border border-white/10 z-20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {!comparisonResult ? (
                <div className="flex justify-center">
                  <button
                    onClick={handleCompare}
                    disabled={isComparing}
                    className={`
                      px-8 py-3.5 rounded-full font-black text-sm md:text-base shadow-lg shadow-cyan-500/30 w-full md:w-auto uppercase tracking-widest
                      ${isComparing
                        ? 'bg-slate-800 text-slate-500 cursor-wait'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 active:scale-95 transition-all'}
                    `}
                  >
                    {isComparing ? '正在通过深度视觉算法分析工艺细节...' : '提交对比评估'}
                  </button>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-4 md:p-8 fade-in-standard">
                  {/* 对比评分内容保持不变 */}
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    <div className="shrink-0 mx-auto md:mx-0 relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                      {/* Glow effect */}
                      <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${comparisonResult.score >= 80 ? 'bg-green-400' :
                          comparisonResult.score >= 60 ? 'bg-yellow-400' : 'bg-orange-400'
                        }`}></div>

                      <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        <circle cx="50%" cy="50%" r="45%" className="stroke-white/10 fill-none" strokeWidth="8" />
                        <circle
                          cx="50%" cy="50%" r="45%"
                          className={`fill-none transition-all duration-1000 ease-out ${comparisonResult.score >= 80 ? 'stroke-green-400' :
                              comparisonResult.score >= 60 ? 'stroke-yellow-400' : 'stroke-orange-400'
                            }`}
                          strokeWidth="8"
                          pathLength={100}
                          strokeDashoffset={100 - comparisonResult.score}
                          strokeDasharray={100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl md:text-4xl font-black text-white drop-shadow-md">{comparisonResult.score}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Score</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                      <div>
                        <h4 className="text-base font-black text-cyan-200 mb-2 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-cyan-400 rounded-full"></span> 综合工艺评价
                        </h4>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium bg-white/5 p-4 rounded-xl border border-white/10">
                          "{comparisonResult.comment}"
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-3 md:p-4">
                          <h5 className="flex items-center gap-2 font-black text-green-300 mb-2 text-xs uppercase tracking-widest">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            工艺亮点
                          </h5>
                          <ul className="text-xs text-slate-300 space-y-2 font-medium">
                            {comparisonResult.strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-green-400 rounded-full mt-1.5 opacity-60"></span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-3 md:p-4">
                          <h5 className="flex items-center gap-2 font-black text-orange-300 mb-2 text-xs uppercase tracking-widest">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                            大师建议
                          </h5>
                          <ul className="text-xs text-slate-300 space-y-2 font-medium">
                            {comparisonResult.improvements.map((s, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-orange-400 rounded-full mt-1.5 opacity-60"></span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default ResultView;