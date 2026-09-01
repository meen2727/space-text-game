import React from 'react';
import { HelpCircle, Crosshair, ShieldAlert, Zap, Keyboard, Award } from 'lucide-react';

export const HowToPlay: React.FC = () => {
  return (
    <section className="w-full bg-slate-900/80 border border-cyan-900/50 rounded-2xl p-4 sm:p-6 shadow-xl text-slate-200">
      {/* Title */}
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-cyan-900/40">
        <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-arcade tracking-wider text-cyan-300">
            วิธีเล่นเกม (HOW TO PLAY)
          </h2>
          <p className="text-xs text-slate-400">
            คู่มือกฎกติกาและกลยุทธ์การเล่นเกมพิมพ์คำศัพท์ยิงยานอวกาศ
          </p>
        </div>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        {/* Step 1 */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-400 font-arcade font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-600 flex items-center justify-center text-xs">
              1
            </span>
            <Crosshair className="w-4 h-4" />
            <span>จับตายานศัตรู</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            ยานศัตรูจะค่อยๆ ลอยลงมาจากด้านบน พร้อมคำศัพท์ภาษาอังกฤษที่ปรากฏอยู่เหนือตัวยาน
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-teal-400 font-arcade font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-teal-950 border border-teal-600 flex items-center justify-center text-xs">
              2
            </span>
            <Keyboard className="w-4 h-4" />
            <span>พิมพ์คำศัพท์</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            พิมพ์ตัวอักษรภาษาอังกฤษผ่านแป้นพิมพ์ หรือแตะปุ่มคีย์บอร์ดบนหน้าจอ ตัวอักษรที่ตรงจะเรืองแสงสีเขียว
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-yellow-400 font-arcade font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-yellow-950 border border-yellow-600 flex items-center justify-center text-xs">
              3
            </span>
            <Zap className="w-4 h-4" />
            <span>ยิงเลเซอร์ทำลาย</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            เมื่อพิมพ์คำศัพท์ได้ครบถ้วน ป้อมปืนจะยิงลำแสงเลเซอร์ทำลายยานทันที ได้รับ 10+ คะแนน และล้างช่องพิมพ์อัตโนมัติ
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-rose-400 font-arcade font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-rose-950 border border-rose-600 flex items-center justify-center text-xs">
              4
            </span>
            <ShieldAlert className="w-4 h-4" />
            <span>ป้องกันแนวรบ</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            เริ่มเกมมี 3 HP หากยานหลุดลงมาถึงขอบล่าง HP จะลดลง 1 หาก HP เหลือ 0 เกมจะสิ้นสุดลง (Game Over)
          </p>
        </div>
      </div>

      {/* Enemy Specs & Tips footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono-code text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-slate-300 font-semibold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" /> ศัตรู:
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Scout (เร็ว)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> Drone (มาตรฐาน)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Cruiser (ถึก)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Boss (ยักษ์)
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-400">ESC</span>
          <span>ล้างคำพิมพ์</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-400 ml-2">SPACE / P</span>
          <span>หยุดชั่วคราว</span>
        </div>
      </div>
    </section>
  );
};
