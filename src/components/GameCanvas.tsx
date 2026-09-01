import React, { useRef, useEffect, useCallback } from 'react';
import { Enemy, Laser, Particle, Star, GameStatus } from '../types';

interface GameCanvasProps {
  status: GameStatus;
  enemies: Enemy[];
  lasers: Laser[];
  particles: Particle[];
  currentInput: string;
  onDamageFlash: boolean;
  activeTargetId: string | null;
  onStartClick: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  status,
  enemies,
  lasers,
  particles,
  currentInput,
  onDamageFlash,
  activeTargetId,
  onStartClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const turretAngleRef = useRef<number>(-Math.PI / 2); // pointing up by default
  const recoilRef = useRef<number>(0);

  // Initialize starfield
  const initStars = useCallback((width: number, height: number) => {
    const starCount = Math.floor((width * height) / 4500);
    const stars: Star[] = [];
    const colors = ['#ffffff', '#a5f3fc', '#e0e7ff', '#fef08a', '#c084fc'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.8 + 0.2,
        alpha: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    starsRef.current = stars;
  }, []);

  // Handle Canvas Resize and DPI
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Set internal pixel buffer size
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Keep stars populated
      if (starsRef.current.length === 0) {
        initStars(rect.width, rect.height);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [initStars]);

  // Main Render Loop
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Draw Space Background
      ctx.fillStyle = '#020617'; // slate-950
      ctx.fillRect(0, 0, width, height);

      // Deep space subtle gradient nebula
      const nebulaGrad = ctx.createRadialGradient(
        width / 2, height * 0.35, 10,
        width / 2, height * 0.35, width * 0.7
      );
      nebulaGrad.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
      nebulaGrad.addColorStop(0.5, 'rgba(8, 28, 60, 0.4)');
      nebulaGrad.addColorStop(1, 'rgba(2, 6, 23, 1)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw & Update Stars
      starsRef.current.forEach((star) => {
        if (status === 'playing') {
          star.y += star.speed;
          if (star.y > height) {
            star.y = 0;
            star.x = Math.random() * width;
          }
        }

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 3. Danger / Defense Line at the bottom
      const defenseLineY = height - 70;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, defenseLineY);
      ctx.lineTo(width, defenseLineY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Defense Line Warning Label
      ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.font = '10px "Chakra Petch", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('SHIELD PERIMETER ⚠️', width - 12, defenseLineY - 6);

      // 4. Calculate Turret Aim
      const turretX = width / 2;
      const turretY = height - 25;
      let targetX = turretX;
      let targetY = 0;

      // If there's an active matching target, aim towards it
      const matchedEnemy = enemies.find(e => e.id === activeTargetId);
      if (matchedEnemy) {
        targetX = matchedEnemy.x;
        targetY = matchedEnemy.y;
      } else if (enemies.length > 0) {
        // Aim at the lowest (closest to bottom) enemy
        const lowestEnemy = enemies.reduce((lowest, current) =>
          current.y > lowest.y ? current : lowest, enemies[0]
        );
        targetX = lowestEnemy.x;
        targetY = lowestEnemy.y;
      }

      const desiredAngle = Math.atan2(targetY - turretY, targetX - turretX);
      // Smoothly rotate turret
      turretAngleRef.current += (desiredAngle - turretAngleRef.current) * 0.15;

      // 5. Draw Lasers
      lasers.forEach(laser => {
        ctx.save();
        ctx.strokeStyle = laser.color;
        ctx.lineWidth = laser.thickness;
        ctx.lineCap = 'round';
        ctx.shadowColor = laser.color;
        ctx.shadowBlur = 15;

        // Beam from source to target
        ctx.beginPath();
        ctx.moveTo(laser.startX, laser.startY);
        ctx.lineTo(laser.targetX, laser.targetY);
        ctx.stroke();

        // Inner hot-white core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, laser.thickness * 0.4);
        ctx.shadowBlur = 4;
        ctx.stroke();

        // Muzzle flare at start
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(laser.startX, laser.startY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 6. Draw Enemies (Alien Ships + Word Badges)
      enemies.forEach((enemy) => {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);

        const isTargeted = currentInput.length > 0 && enemy.word.toLowerCase().startsWith(currentInput.toLowerCase());
        const isExactActive = enemy.id === activeTargetId;

        // Danger highlight if close to bottom
        const distanceRatio = enemy.y / defenseLineY;
        const isCritical = distanceRatio > 0.75;

        // Draw Ship Body based on Type
        ctx.save();
        if (enemy.type === 'scout') {
          // Sleek Arrow UFO
          ctx.fillStyle = enemy.color;
          ctx.shadowColor = enemy.glowColor;
          ctx.shadowBlur = isTargeted ? 20 : 10;

          ctx.beginPath();
          ctx.moveTo(0, 16); // nose pointing down
          ctx.lineTo(-18, -14);
          ctx.lineTo(-6, -8);
          ctx.lineTo(0, -12);
          ctx.lineTo(6, -8);
          ctx.lineTo(18, -14);
          ctx.closePath();
          ctx.fill();

          // Cockpit
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(0, 0, 4, 7, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'drone') {
          // Hexagon Drone
          ctx.fillStyle = enemy.color;
          ctx.shadowColor = enemy.glowColor;
          ctx.shadowBlur = isTargeted ? 22 : 12;

          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = 18 * Math.cos(angle);
            const py = 18 * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();

          // Glowing Core
          ctx.fillStyle = '#f0abfc';
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'cruiser') {
          // Heavy Cruiser
          ctx.fillStyle = enemy.color;
          ctx.shadowColor = enemy.glowColor;
          ctx.shadowBlur = isTargeted ? 24 : 14;

          ctx.beginPath();
          ctx.moveTo(0, 22);
          ctx.lineTo(-24, 6);
          ctx.lineTo(-22, -18);
          ctx.lineTo(-8, -12);
          ctx.lineTo(8, -12);
          ctx.lineTo(22, -18);
          ctx.lineTo(24, 6);
          ctx.closePath();
          ctx.fill();

          // Dual thruster flare
          ctx.fillStyle = '#67e8f9';
          ctx.fillRect(-16, -22, 6, 6);
          ctx.fillRect(10, -22, 6, 6);
        } else {
          // Boss Dreadnought
          ctx.fillStyle = enemy.color;
          ctx.shadowColor = enemy.glowColor;
          ctx.shadowBlur = 25;

          ctx.beginPath();
          ctx.moveTo(0, 28);
          ctx.lineTo(-32, 10);
          ctx.lineTo(-28, -20);
          ctx.lineTo(-12, -14);
          ctx.lineTo(0, -24);
          ctx.lineTo(12, -14);
          ctx.lineTo(28, -20);
          ctx.lineTo(32, 10);
          ctx.closePath();
          ctx.fill();

          // Pulsing boss eye
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(0, 4, 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Engine Thruster Glow
        const thrustGrad = ctx.createLinearGradient(0, -15, 0, -28);
        thrustGrad.addColorStop(0, enemy.glowColor);
        thrustGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = thrustGrad;
        ctx.fillRect(-6, -28, 12, 14);

        ctx.restore(); // restore from ship drawing

        // Draw Word Badge above ship
        const badgeY = -34;
        const wordText = enemy.word;
        ctx.font = 'bold 15px "JetBrains Mono", monospace';
        const textMetrics = ctx.measureText(wordText);
        const textWidth = textMetrics.width;
        const badgePadX = 10;
        const badgePadY = 6;
        const badgeWidth = textWidth + badgePadX * 2;
        const badgeHeight = 26;

        // Badge Container
        ctx.save();
        ctx.fillStyle = isCritical 
          ? 'rgba(69, 10, 10, 0.95)' 
          : isTargeted 
            ? 'rgba(6, 78, 59, 0.95)' 
            : 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = isCritical
          ? '#ef4444'
          : isExactActive
            ? '#38bdf8'
            : isTargeted
              ? '#34d399'
              : 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = isTargeted ? 2 : 1;
        ctx.shadowColor = isTargeted ? '#34d399' : 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = isTargeted ? 12 : 4;

        ctx.beginPath();
        ctx.roundRect(-badgeWidth / 2, badgeY - badgeHeight / 2, badgeWidth, badgeHeight, 6);
        ctx.fill();
        ctx.stroke();

        // Render characters with typing highlight
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        let currentX = -textWidth / 2;

        const typedPrefixLen = isTargeted ? currentInput.length : 0;

        for (let i = 0; i < wordText.length; i++) {
          const char = wordText[i];
          const charWidth = ctx.measureText(char).width;

          if (i < typedPrefixLen) {
            // Already typed characters (Glowing Neon Cyan/Green)
            ctx.fillStyle = '#34d399';
            ctx.shadowColor = '#34d399';
            ctx.shadowBlur = 8;
          } else {
            // Remaining characters (Crisp White/Slate)
            ctx.fillStyle = '#f8fafc';
            ctx.shadowBlur = 0;
          }

          ctx.fillText(char, currentX, badgeY);
          currentX += charWidth;
        }

        ctx.restore(); // restore badge context
        ctx.restore(); // restore enemy translate
      });

      // 7. Draw Particles and Floating Combat Text
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.type === 'ring') {
          // Shockwave explosion ring
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius || 10, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.type === 'text') {
          // Floating Score Text (+10, COMBO x2)
          ctx.font = 'bold 16px "Chakra Petch", sans-serif';
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.textAlign = 'center';
          ctx.fillText(p.text || '', p.x, p.y);
        } else {
          // Spark / debris
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 8. Draw Player Turret / Laser Cannon
      ctx.save();
      ctx.translate(turretX, turretY);

      // Base Energy Dome
      const domeGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 26);
      domeGrad.addColorStop(0, '#38bdf8');
      domeGrad.addColorStop(0.6, '#0369a1');
      domeGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = domeGrad;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI, true);
      ctx.fill();

      // Outer platform ring
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI, true);
      ctx.stroke();

      // Rotating Turret Gun Barrel
      ctx.rotate(turretAngleRef.current + Math.PI / 2);

      // Recoil
      const recoilY = recoilRef.current > 0 ? recoilRef.current : 0;
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;

      // Dual laser barrels
      ctx.fillRect(-6, -28 + recoilY, 4, 24);
      ctx.strokeRect(-6, -28 + recoilY, 4, 24);
      ctx.fillRect(2, -28 + recoilY, 4, 24);
      ctx.strokeRect(2, -28 + recoilY, 4, 24);

      // Glowing tip
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fillRect(-7, -30 + recoilY, 6, 3);
      ctx.fillRect(1, -30 + recoilY, 6, 3);

      ctx.restore();

      // 9. Red Damage Overlay Flash
      if (onDamageFlash) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [status, enemies, lasers, particles, currentInput, onDamageFlash, activeTargetId]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] bg-slate-950 rounded-2xl border-2 border-cyan-900/60 overflow-hidden shadow-2xl shadow-cyan-950/50 select-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Retro Scanline Overlay */}
      <div className="absolute inset-0 retro-scanlines pointer-events-none opacity-60" />

      {/* Corner UI Accents */}
      <div className="absolute top-2 left-2 text-[10px] font-mono-code text-cyan-500/60 pointer-events-none uppercase tracking-wider">
        SYS.ONLINE // RADAR ACTIVE
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-mono-code text-cyan-500/60 pointer-events-none uppercase tracking-wider">
        DEFENSE GRID: NOMINAL
      </div>

      {/* Idle / Start Overlay */}
      {status === 'idle' && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/40 mb-4 animate-bounce">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-arcade text-cyan-300 tracking-wider mb-2">
            SPACE TYPING DEFENDER
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-md mb-6 leading-relaxed">
            พิมพ์คำศัพท์ภาษาอังกฤษบนยานศัตรูให้ถูกต้องเพื่อยิงเลเซอร์ทำลาย อย่าปล่อยให้ยานผ่านแนวป้องกัน!
          </p>
          <button
            id="start-game-canvas-btn"
            onClick={onStartClick}
            className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold font-arcade tracking-wider text-base rounded-xl shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>เริ่มเล่นเกม (START GAME)</span>
            <span className="text-lg">▶</span>
          </button>
        </div>
      )}

      {/* Paused Overlay */}
      {status === 'paused' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
          <div className="text-4xl mb-3">⏸️</div>
          <h2 className="text-2xl font-bold font-arcade text-amber-400 tracking-widest mb-2">
            GAME PAUSED
          </h2>
          <p className="text-sm text-slate-400 mb-5">
            เกมถูกหยุดชั่วคราว กดปุ่มด้านล่างหรือกดปุ่ม Spacebar เพื่อเล่นต่อ
          </p>
          <button
            id="resume-game-canvas-btn"
            onClick={onStartClick}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-arcade rounded-lg shadow-md shadow-amber-500/30 transition-transform active:scale-95"
          >
            เล่นต่อ (RESUME)
          </button>
        </div>
      )}
    </div>
  );
};
