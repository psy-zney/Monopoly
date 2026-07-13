import React, { useEffect, useState } from 'react';

export interface GameLoadingScreenProps {
  onFinish: () => void;
  title?: string;
  subtitle?: string;
}

export const GameLoadingScreen: React.FC<GameLoadingScreenProps> = ({
  onFinish,
  title = 'Doraemon Monopoly',
  subtitle = 'Bản Miền Nam · Cờ Tỷ Phú Sài Gòn',
}) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Đang tải dữ liệu bàn cờ Miền Nam...',
    'Khởi tạo 40 ô đất, Nhà & Khách Sạn...',
    'Đồng bộ luật chơi chuẩn Hasbro...',
    'Kết nối phòng chơi & Hàng chờ...',
    'Hoàn tất! Sẵn sàng vào ván đấu...',
  ];

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = 1400; // 1.4s smooth loading experience

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
      setProgress(nextProgress);

      const nextStepIndex = Math.min(
        steps.length - 1,
        Math.floor((nextProgress / 100) * steps.length)
      );
      setStepIndex(nextStepIndex);

      if (nextProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          onFinish();
        }, 200);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [onFinish, steps.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md px-4 select-none">
      {/* Background Decorative Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
        {/* Animated Dice Logo Wrapper */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-4xl shadow-lg shadow-red-500/30 animate-bounce">
            🎲
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center text-xs text-white font-black shadow">
            🔔
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-2xl font-black text-white uppercase tracking-wider mb-1 text-center"
          style={{ fontFamily: 'Baloo 2, cursive' }}
        >
          {title}
        </h2>
        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-8 text-center">
          {subtitle}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-100 ease-out shadow-sm"
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
