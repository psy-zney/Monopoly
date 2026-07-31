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
  const [serverReady, setServerReady] = useState(false);

  const steps = [
    'Đang tải dữ liệu bàn cờ Miền Nam...',
    'Khởi tạo 40 ô đất, Nhà & Khách Sạn...',
    'Đồng bộ luật chơi chuẩn Hasbro...',
    'Đang kết nối & đánh thức máy chủ (Server)...',
    'Đang kết nối & đánh thức máy chủ (Server)...', // Duplicate to hold at this step if waiting
    'Hoàn tất! Sẵn sàng vào ván đấu...',
  ];

  // Ping backend to wake it up
  useEffect(() => {
    let isMounted = true;
    const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    
    const pingServer = async () => {
      try {
        const response = await fetch(`${url}/health`);
        if (response.ok && isMounted) {
          setServerReady(true);
        } else {
          if (isMounted) setTimeout(pingServer, 2000);
        }
      } catch (error) {
        // Server might be asleep, try again in 2 seconds
        if (isMounted) setTimeout(pingServer, 2000);
      }
    };
    
    pingServer();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const minDuration = 1500; // minimum loading time

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let nextProgress = Math.floor((elapsed / minDuration) * 100);
      
      // If server isn't ready yet, hold progress at 85% maximum
      if (!serverReady && nextProgress > 85) {
        nextProgress = 85;
      }
      
      if (nextProgress > 100) nextProgress = 100;
      
      setProgress(nextProgress);

      let nextStepIndex = Math.min(
        steps.length - 1,
        Math.floor((nextProgress / 100) * steps.length)
      );
      
      // Force step text to "Connecting" if waiting for server
      if (!serverReady && nextProgress === 85) {
        nextStepIndex = 3;
      }
      
      setStepIndex(nextStepIndex);

      if (nextProgress >= 100 && serverReady) {
        clearInterval(timer);
        setTimeout(() => {
          onFinish();
        }, 300);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [onFinish, steps.length, serverReady]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md px-4 select-none">
      {/* Background Decorative Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
        {/* Hamster Loading Animation */}
        <div className="mb-8">
          <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
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
          className="text-2xl font-black text-white uppercase tracking-wider mb-1 text-center"
          style={{ fontFamily: 'Baloo 2, cursive' }}
        >
          {title}
        </h2>
        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-8 text-center">
          {subtitle}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 mb-4 relative">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-100 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
          {/* Waiting for server pulse effect */}
          {!serverReady && progress === 85 && (
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          )}
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

