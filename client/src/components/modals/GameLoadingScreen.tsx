import React, { useEffect, useState } from 'react';
import { Skeleton } from '../ui/Skeleton';

export interface GameLoadingScreenProps {
  onFinish: () => void;
  title?: string;
  subtitle?: string;
}

export const GameLoadingScreen: React.FC<GameLoadingScreenProps> = ({
  onFinish,
  title = 'Cờ Tỷ Phú Việt Nam',
  subtitle = 'Bản Đất Vàng · Miền Nam Sài Gòn',
}) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Đang nạp cấu trúc 40 ô bàn cờ Miền Nam...',
    'Khởi tạo ô đất, Nhà & Khách Sạn cao cấp...',
    'Đồng bộ luật chơi chuẩn Quốc tế & Thuế...',
    'Thiết lập hiệu ứng bám sát góc nhìn camera...',
    'Hoàn tất! Sẵn sàng vào ván đấu...',
  ];

  useEffect(() => {
    const startTime = Date.now();
    const minDuration = 800; // Fast & smooth 800ms loading

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let nextProgress = Math.min(100, Math.floor((elapsed / minDuration) * 100));

      setProgress(nextProgress);

      let nextStepIndex = Math.min(
        steps.length - 1,
        Math.floor((nextProgress / 100) * steps.length)
      );

      setStepIndex(nextStepIndex);

      if (nextProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          onFinish();
        }, 120);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [onFinish, steps.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md px-4 select-none">
      {/* Background Decorative Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Background Board Skeleton Preview to give immediate structure */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none p-6">
        <div className="aspect-square w-full max-w-[650px] border-2 border-slate-700/60 rounded-3xl p-3 grid grid-cols-6 grid-rows-6 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-full w-full" />
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full p-7 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl">
        {/* Animated Hamster Wheel */}
        <div className="mb-6">
          <div aria-label="Loading animation" role="img" className="wheel-and-hamster">
            <div className="wheel"></div>
            <div className="hamster">
              <div className="hamster__body">
                <div className="hamster__head">
                  <div className="hamster__ear"></div>
                  <div className="hamster__eye"></div>
                  <div className="hamster__nose"></div>
                </div>
                <div className="hamster__limb hamster__limb--fr"></div>
                <div className="hamster__limb hamster__limb--fl"></div>
                <div className="hamster__limb hamster__limb--br"></div>
                <div className="hamster__limb hamster__limb--bl"></div>
                <div className="hamster__tail"></div>
              </div>
            </div>
            <div className="spoke"></div>
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mb-1 text-center"
          style={{ fontFamily: 'Baloo 2, cursive' }}
        >
          {title}
        </h2>
        <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-5 text-center">
          {subtitle}
        </p>

        {/* Shimmering Skeleton Preview of Seats */}
        <div className="flex items-center gap-2 mb-4 w-full justify-center">
          <Skeleton variant="circle" width={28} height={28} />
          <Skeleton variant="text" width={70} height={14} />
          <Skeleton variant="circle" width={28} height={28} />
          <Skeleton variant="text" width={70} height={14} />
          <Skeleton variant="circle" width={28} height={28} />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 mb-3 relative">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-100 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Status Text */}
        <div className="flex items-center justify-between w-full text-xs font-bold text-slate-300">
          <span className="truncate pr-2">{steps[stepIndex]}</span>
          <span className="font-mono text-amber-400 shrink-0">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
