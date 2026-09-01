import React from 'react';
import { Delete, XCircle, Keyboard } from 'lucide-react';
import { Enemy } from '../types';

interface VirtualKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  visibleEnemies: Enemy[];
  currentInput: string;
  onWordClick: (word: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onClear,
  visibleEnemies,
  currentInput,
  onWordClick,
  isOpen,
  onToggle
}) => {
  return (
    <div className="w-full bg-slate-900/95 border border-cyan-900/50 rounded-2xl p-2.5 sm:p-3 shadow-xl mt-2 select-none">
      {/* Header with Quick Words & Toggle */}
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-2 text-xs font-arcade text-cyan-400">
          <Keyboard className="w-3.5 h-3.5" />
          <span>VIRTUAL KEYBOARD / MOBILE CONTROLS</span>
        </div>

        <button
          id="toggle-virtual-keyboard-btn"
          onClick={onToggle}
          className="text-xs text-slate-400 hover:text-cyan-300 font-mono-code px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition-colors"
        >
          {isOpen ? 'ซ่อนคีย์บอร์ด (Hide)' : 'แสดงคีย์บอร์ด (Show)'}
        </button>
      </div>

      {/* Quick Target Words Bar (For fast mobile tapping or targeting) */}
      {visibleEnemies.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-800">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase whitespace-nowrap pl-1">
            เป้าหมาย:
          </span>
          {visibleEnemies.slice(0, 5).map((enemy) => {
            const isMatch = currentInput && enemy.word.startsWith(currentInput.toLowerCase());
            return (
              <button
                key={enemy.id}
                onClick={() => onWordClick(enemy.word)}
                className={`text-xs font-mono-code px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                  isMatch
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/30'
                    : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-cyan-500/50'
                }`}
              >
                {enemy.word}
              </button>
            );
          })}
        </div>
      )}

      {/* Virtual Keys Grid */}
      {isOpen && (
        <div className="flex flex-col gap-1.5 pt-1">
          {/* Row 1 */}
          <div className="flex justify-center gap-1 sm:gap-1.5">
            {KEYBOARD_ROWS[0].map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key.toLowerCase())}
                className="flex-1 max-w-[42px] h-10 sm:h-11 bg-slate-800 hover:bg-cyan-900/60 active:bg-cyan-600 active:scale-95 text-slate-100 hover:text-cyan-200 font-mono-code font-bold text-sm sm:text-base rounded-lg border border-slate-700 hover:border-cyan-500/60 transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                {key}
              </button>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex justify-center gap-1 sm:gap-1.5 px-2">
            {KEYBOARD_ROWS[1].map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key.toLowerCase())}
                className="flex-1 max-w-[42px] h-10 sm:h-11 bg-slate-800 hover:bg-cyan-900/60 active:bg-cyan-600 active:scale-95 text-slate-100 hover:text-cyan-200 font-mono-code font-bold text-sm sm:text-base rounded-lg border border-slate-700 hover:border-cyan-500/60 transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                {key}
              </button>
            ))}
          </div>

          {/* Row 3 with Backspace and Clear */}
          <div className="flex justify-center gap-1 sm:gap-1.5">
            <button
              id="vk-clear-btn"
              onClick={onClear}
              className="px-2.5 h-10 sm:h-11 bg-rose-950/60 hover:bg-rose-900/80 active:bg-rose-600 text-rose-300 font-mono-code text-xs font-semibold rounded-lg border border-rose-800/60 transition-all flex items-center justify-center gap-1 cursor-pointer"
              title="Clear text"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>CLR</span>
            </button>

            {KEYBOARD_ROWS[2].map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key.toLowerCase())}
                className="flex-1 max-w-[42px] h-10 sm:h-11 bg-slate-800 hover:bg-cyan-900/60 active:bg-cyan-600 active:scale-95 text-slate-100 hover:text-cyan-200 font-mono-code font-bold text-sm sm:text-base rounded-lg border border-slate-700 hover:border-cyan-500/60 transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                {key}
              </button>
            ))}

            <button
              id="vk-backspace-btn"
              onClick={onBackspace}
              className="px-2.5 h-10 sm:h-11 bg-amber-950/60 hover:bg-amber-900/80 active:bg-amber-600 text-amber-300 font-mono-code text-xs font-semibold rounded-lg border border-amber-800/60 transition-all flex items-center justify-center gap-1 cursor-pointer"
              title="Backspace"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
