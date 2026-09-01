import React from 'react';
import { RotateCcw, Trophy, Zap, Target, Flame, Activity } from 'lucide-react';
import { GameStats } from '../types';

interface GameOverModalProps {
  stats: GameStats;
  isNewHighScore: boolean;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  isNewHighScore,
  onRestart
}) => {
  const accuracy = stats.totalKeystrokes > 0
    ? Math.round((stats.correctKeystrokes / stats.totalKeystrokes) * 100)
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-2 border-rose-600/70 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/80 text-center relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="mb-4">
          <div className="inline-block px-3 py-1 rounded-full bg-rose-950/90 border border-rose-600/60 text-rose-400 font-mono-code text-xs font-bold tracking-widest uppercase mb-2 animate-pulse">
            MISSION FAILED
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-arcade tracking-wider text-transparent bg-gradient-to-r from-rose-400 via-red-500 to-amber-400 bg-clip-text">
            GAME OVER
          </h2>
          <p className="text-sm text-slate-400 font-sans mt-1">
            แนวป้องกันของคุณถูกทำลายแล้ว!
          </p>
        </div>

        {/* New High Score Callout */}
        {isNewHighScore && (
          <div className="mb-5 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/60 flex items-center justify-center gap-2 text-amber-300 font-arcade text-sm font-bold animate-bounce">
            <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>🎉 ทำลายสถิติสูงสุดใหม่! (NEW HIGH SCORE)</span>
          </div>
        )}

        {/* Score Display Card */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-inner">
          <div className="text-xs text-slate-400 font-arcade uppercase tracking-widest mb-1">
            FINAL SCORE (คะแนนรวม)
          </div>
          <div className="text-4xl sm:text-5xl font-black font-mono-code text-cyan-300 tracking-tight">
            {stats.score.toLocaleString()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-arcade uppercase mb-0.5">
              <Target className="w-3.5 h-3.5 text-teal-400" />
              <span>ยานที่ทำลาย</span>
            </div>
            <div className="text-lg font-bold font-mono-code text-teal-300">
              {stats.wordsDestroyed} ลำ
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-arcade uppercase mb-0.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Wave สูงสุด</span>
            </div>
            <div className="text-lg font-bold font-mono-code text-purple-300">
              Wave {stats.wave}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-arcade uppercase mb-0.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>ความแม่นยำ</span>
            </div>
            <div className="text-lg font-bold font-mono-code text-cyan-300">
              {accuracy}%
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-arcade uppercase mb-0.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Max Combo</span>
            </div>
            <div className="text-lg font-bold font-mono-code text-amber-300">
              {stats.maxCombo}x
            </div>
          </div>
        </div>

        {/* Restart Button */}
        <button
          id="restart-game-over-btn"
          onClick={onRestart}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 active:scale-98 text-slate-950 font-extrabold font-arcade text-base sm:text-lg tracking-wider rounded-2xl shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span>เล่นใหม่อีกครั้ง (RESTART GAME)</span>
        </button>
      </div>
    </div>
  );
};
