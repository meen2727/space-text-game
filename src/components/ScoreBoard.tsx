import React from 'react';
import { Shield, Zap, Flame, Trophy, Activity, Radio } from 'lucide-react';
import { GameStats } from '../types';

interface ScoreBoardProps {
  stats: GameStats;
  difficulty: string;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ stats, difficulty }) => {
  const accuracy = stats.totalKeystrokes > 0
    ? Math.round((stats.correctKeystrokes / stats.totalKeystrokes) * 100)
    : 100;

  return (
    <header className="w-full bg-slate-900/90 border-b border-cyan-900/60 backdrop-blur-md px-3 sm:px-6 py-3 shadow-lg shadow-cyan-950/40 relative z-20">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Title & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/30 ring-1 ring-cyan-400/50">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-arcade tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                TYPING SHOOTER
              </h1>
              <span className="text-[10px] font-mono-code uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/50 text-cyan-400 font-semibold tracking-wider">
                {difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans hidden sm:block">
              เกมพิมพ์คำศัพท์ยิงยานศัตรู
            </p>
          </div>
        </div>

        {/* Vital Stats Group */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-4">
          {/* Health Points (HP) */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
            <div className="flex items-center gap-1 text-xs text-slate-400 font-arcade uppercase mr-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>HP:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: stats.maxHp }).map((_, index) => {
                const isAlive = index < stats.hp;
                return (
                  <div
                    key={index}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isAlive
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-500/40 ring-1 ring-emerald-300 scale-100'
                        : 'bg-slate-800/80 border border-slate-700/50 text-slate-600 opacity-40 scale-90'
                    }`}
                  >
                    <Shield className={`w-3.5 h-3.5 ${isAlive ? 'fill-current' : ''}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Score */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-cyan-900/50 rounded-xl px-3 sm:px-4 py-1.5 shadow-inner">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-bounce" />
            <div>
              <div className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider leading-none">
                SCORE
              </div>
              <div className="text-base sm:text-xl font-extrabold font-mono-code text-cyan-300 leading-tight">
                {stats.score.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Wave / Speed */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-purple-900/50 rounded-xl px-3 py-1.5 shadow-inner">
            <Activity className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider leading-none">
                WAVE
              </div>
              <div className="text-base sm:text-xl font-extrabold font-mono-code text-purple-300 leading-tight">
                {stats.wave}
              </div>
            </div>
          </div>

          {/* Combo Multiplier */}
          {stats.combo > 1 && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/90 to-orange-950/90 border border-amber-500/50 rounded-xl px-2.5 py-1.5 shadow-md shadow-amber-500/20 animate-pulse">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <div className="text-xs sm:text-sm font-black font-mono-code text-amber-300">
                {stats.combo}x
              </div>
            </div>
          )}

          {/* High Score & Accuracy Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 pl-2 border-l border-slate-800 text-xs font-mono-code text-slate-400">
            <div className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-500">HI:</span>
              <span className="text-amber-300 font-semibold">{stats.highScore}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">ACC:</span>
              <span className="text-teal-300 font-semibold">{accuracy}%</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
