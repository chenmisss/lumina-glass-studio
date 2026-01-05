import React, { useState } from 'react';

interface GlassImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

const GlassImage: React.FC<GlassImageProps> = ({ src, alt, className = '', containerClassName = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 备用稳定图片 - 使用本地 Mock 图片作为保底，确保不会出现 broken image
  const fallbackSrc = '/images/mock/glass-masterpiece.png';

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* 骨架屏占位符 */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/10 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* 错误占位图或备用图 */}
      {hasError && (
        <div className="absolute inset-0 z-10 bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
          <img
            src={fallbackSrc}
            alt="fallback"
            className={`absolute inset-0 w-full h-full object-cover opacity-60 grayscale mix-blend-overlay`}
          />
          <div className="relative z-20 flex flex-col items-center">
            {/* 既然有 Fallback 图片，就不显示文字了，或者显示更友好的提示 */}
          </div>
        </div>
      )}

      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`
          ${className}
          transition-all duration-700 ease-out
          ${isLoaded && !hasError ? 'opacity-100 scale-100' : 'opacity-0 scale-105 blur-lg'}
        `}
      />
    </div>
  );
};

export default GlassImage;