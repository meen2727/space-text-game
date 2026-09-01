import React, { useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Crosshair, Sparkles } from 'lucide-react';
import { GameStatus, Difficulty } from '../types';

interface ControlsProps {
  status: GameStatus;
  currentInput: string;
  onInputChange: (val: string) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  difficulty: Difficulty;
  onChangeDifficulty: (diff: Difficulty) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  status,
  currentInput,
  onInputChange,
  onStart,
  onPause,
  onReset,
  isMuted,
  onToggleMute,
  difficulty,
  onChangeDifficulty
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when game is playing or resets
  useEffect(() => {
    if (status === 'playing') {
      inputRef.current?.focus();
    }
  }, [status]);

  // Keep input focused when clicking anywhere around the control bar
  const handleContainerClick = () => {
    if (status === 'playing') {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="w-full bg-slate-900/90 border border-cyan-900/60 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md flex flex-col gap-3"
    >
      {/* Primary Input Field with Cyber Aim Reticle */}
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 flex items-center gap-1.5 text-cyan-400 pointer-events-none">
          <Crosshair className="w-5 h-5 animate-spin-slow text-cyan-400" />
          <span className="text-xs font-mono-code font-bold hidden sm:inline text-cyan-500">
            AIM:
          </span>
        </div>

        <input
          ref={inputRef}
          id="typing-input-field"
          type="text"
          value={currentInput}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={status !== 'playing'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder={
            status === 'playing'
              ? 'พิมพ์คำศัพท์ภาษาอังกฤษที่เห็นบนยานศัตรู...'
              : status === 'paused'
                ? 'เกมหยุดชั่วคราว (Paused)'
                : 'กดปุ่ม "เริ่มเกม (Start)" เพื่อเริ่มเล่น...'
          }
          className="w-full h-12 sm:h-14 pl-12 sm:pl-20 pr-10 bg-slate-950/90 border-2 border-cyan-500/60 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 rounded-xl text-lg sm:text-2xl font-mono-code font-bold tracking-wider text-cyan-300 placeholder:text-slate-500 placeholder:text-sm sm:placeholder:text-base outline-none transition-all shadow-inner"
        />

        {/* Input clear button / target indicator */}
        {currentInput && status === 'playing' && (
          <button
            id="clear-input-btn"
            onClick={() => onInputChange('')}
            className="absolute right-3 text-slate-400 hover:text-cyan-300 font-mono-code text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 cursor-pointer"
          >
            ESC
          </button>
        )}
      </div>

      {/* Button Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Main Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Start / Resume */}
          {status !== 'playing' ? (
            <button
              id="start-button"
              onClick={onStart}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-bold font-arcade tracking-wider text-sm rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{status === 'paused' ? 'เล่นต่อ (Resume)' : 'เริ่มเกม (Start)'}</span>
            </button>
          ) : (
            <button
              id="pause-button"
              onClick={onPause}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-slate-950 font-bold font-arcade tracking-wider text-sm rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>หยุดชั่วคราว (Pause)</span>
            </button>
          )}

          {/* Reset Game */}
          <button
            id="reset-button"
            onClick={onReset}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white font-semibold font-arcade text-sm rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>เริ่มใหม่ (Reset)</span>
          </button>

          {/* Audio Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleMute}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-950/50 border-rose-800/60 text-rose-400'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-cyan-300'
            }`}
            title={isMuted ? 'เปิดเสียง (Unmute)' : 'ปิดเสียง (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl">
          <span className="text-[11px] font-arcade text-slate-400 px-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            ระดับ:
          </span>
          {(['easy', 'normal', 'hard'] as Difficulty[]).map((level) => {
            const labelMap = {
              easy: 'ง่าย',
              normal: 'ปานกลาง',
              hard: 'ยาก'
            };
            const isActive = difficulty === level;
            return (
              <button
                key={level}
                onClick={() => onChangeDifficulty(level)}
                disabled={status === 'playing'}
                className={`px-2.5 py-1 text-xs font-arcade font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 disabled:opacity-50'
                }`}
              >
                {labelMap[level]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
