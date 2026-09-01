import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStatus, Difficulty, Enemy, Laser, Particle, GameStats, EnemyType } from './types';
import { ScoreBoard } from './components/ScoreBoard';
import { GameCanvas } from './components/GameCanvas';
import { Controls } from './components/Controls';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { HowToPlay } from './components/HowToPlay';
import { GameOverModal } from './components/GameOverModal';
import { soundManager } from './utils/audio';
import { getRandomWord, ENEMY_CONFIGS } from './utils/words';

const STORAGE_KEY_HIGH_SCORE = 'typing_shooter_highscore_v1';

export default function App() {
  // Game Status
  const [status, setStatus] = useState<GameStatus>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVirtualKeyboardOpen, setIsVirtualKeyboardOpen] = useState<boolean>(false);
  const [damageFlash, setDamageFlash] = useState<boolean>(false);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    wave: 1,
    hp: 3,
    maxHp: 3,
    wordsDestroyed: 0,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    combo: 0,
    maxCombo: 0
  });

  // Game Loop Entity State (kept in refs for high-performance 60fps RAF loop + state for render)
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [lasers, setLasers] = useState<Laser[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  const enemiesRef = useRef<Enemy[]>([]);
  const lasersRef = useRef<Laser[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const statsRef = useRef<GameStats>(stats);
  const statusRef = useRef<GameStatus>(status);
  const currentInputRef = useRef<string>(currentInput);
  const difficultyRef = useRef<Difficulty>(difficulty);

  // Sync refs with state
  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);

  useEffect(() => {
    lasersRef.current = lasers;
  }, [lasers]);

  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    currentInputRef.current = currentInput;
  }, [currentInput]);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  // Load High Score on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HIGH_SCORE);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) {
        setStats(prev => ({ ...prev, highScore: parsed }));
      }
    }
  }, []);

  // Check and spawn enemies
  const lastSpawnTimeRef = useRef<number>(0);

  const getSpawnInterval = useCallback((wave: number, diff: Difficulty) => {
    const base = diff === 'easy' ? 3200 : diff === 'hard' ? 2000 : 2500;
    const reduction = Math.min(1300, (wave - 1) * 160);
    return Math.max(900, base - reduction);
  }, []);

  const spawnEnemy = useCallback(() => {
    const wave = statsRef.current.wave;
    const diff = difficultyRef.current;
    const existingWords = enemiesRef.current.map(e => e.word);

    // Pick Enemy Type based on Wave
    let type: EnemyType = 'scout';
    const rand = Math.random();
    if (wave >= 6 && rand < 0.2) {
      type = 'boss';
    } else if (wave >= 4 && rand < 0.45) {
      type = 'cruiser';
    } else if (wave >= 2 && rand < 0.65) {
      type = 'drone';
    }

    const config = ENEMY_CONFIGS[type];
    const word = getRandomWord(wave, existingWords);

    // Canvas estimated dimensions (width approx 800 for bounds)
    const spawnMargin = 60;
    const approxWidth = 700;
    const randomX = spawnMargin + Math.random() * (approxWidth - spawnMargin * 2);

    // Calculate speed based on wave & difficulty
    const diffMultiplier = diff === 'easy' ? 0.75 : diff === 'hard' ? 1.3 : 1.0;
    const baseSpeed = 0.55 + (wave * 0.08);
    const speed = baseSpeed * config.speedMultiplier * diffMultiplier;

    const newEnemy: Enemy = {
      id: 'enemy_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      word: word,
      originalWord: word,
      x: randomX,
      y: -30,
      speed: speed,
      type: type,
      width: config.width,
      height: config.height,
      color: config.color,
      glowColor: config.glowColor,
      hp: config.hp,
      maxHp: config.hp,
      points: config.points,
      rotation: 0,
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.03 + Math.random() * 0.03
    };

    enemiesRef.current = [...enemiesRef.current, newEnemy];
    setEnemies(enemiesRef.current);
  }, []);

  // Particle Spawner
  const createExplosion = useCallback((x: number, y: number, color: string, points: number, comboText?: string) => {
    const newParticles: Particle[] = [];

    // 1. Shockwave Ring
    newParticles.push({
      id: 'p_ring_' + Math.random(),
      x,
      y,
      vx: 0,
      vy: 0,
      size: 2,
      color: color,
      alpha: 1.0,
      decay: 0.04,
      type: 'ring',
      radius: 5,
      maxRadius: 45
    });

    // 2. Floating Point Text
    newParticles.push({
      id: 'p_text_' + Math.random(),
      x,
      y: y - 10,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -1.8,
      size: 16,
      color: '#38bdf8',
      alpha: 1.0,
      decay: 0.02,
      type: 'text',
      text: `+${points}`
    });

    // 3. Combo Badge Floating Text
    if (comboText) {
      newParticles.push({
        id: 'p_combo_' + Math.random(),
        x,
        y: y - 28,
        vx: 0,
        vy: -1.4,
        size: 14,
        color: '#f59e0b',
        alpha: 1.0,
        decay: 0.018,
        type: 'text',
        text: comboText
      });
    }

    // 4. Spark Debris
    const sparkCount = 18;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      newParticles.push({
        id: 'p_spark_' + Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        color: Math.random() < 0.6 ? color : '#ffffff',
        alpha: 1.0,
        decay: Math.random() * 0.035 + 0.02,
        type: 'spark'
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
    setParticles(particlesRef.current);
  }, []);

  // Trigger Laser Beam from player turret
  const fireLaser = useCallback((targetX: number, targetY: number, color: string) => {
    // Laser originates at turret center
    const startX = 400; // Will be scaled by canvas width / 2 in component
    const startY = 460;

    const newLaser: Laser = {
      id: 'laser_' + Date.now() + '_' + Math.random(),
      startX,
      startY,
      targetX,
      targetY,
      currentX: startX,
      currentY: startY,
      progress: 0,
      color: color || '#38bdf8',
      thickness: 4,
      duration: 180, // ms
      startTime: performance.now()
    };

    lasersRef.current = [...lasersRef.current, newLaser];
    setLasers(lasersRef.current);
  }, []);

  // Main RAF Game Physics & Logic Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (statusRef.current === 'playing') {
        // 1. Spawning
        const interval = getSpawnInterval(statsRef.current.wave, difficultyRef.current);
        if (currentTime - lastSpawnTimeRef.current > interval) {
          spawnEnemy();
          lastSpawnTimeRef.current = currentTime;
        }

        // 2. Update Enemies Position
        let hpLoss = 0;
        const remainingEnemies: Enemy[] = [];
        const defenseLineThreshold = 380; // approximate defense line y

        enemiesRef.current.forEach((enemy) => {
          enemy.y += enemy.speed;
          enemy.wobbleOffset += enemy.wobbleSpeed;
          enemy.x += Math.sin(enemy.wobbleOffset) * 0.35;

          // Check if enemy crossed defense line (bottom of canvas)
          if (enemy.y >= defenseLineThreshold) {
            hpLoss += 1;
            // Spawn danger burst at line
            createExplosion(enemy.x, defenseLineThreshold, '#ef4444', 0, 'BREACH!');
          } else {
            remainingEnemies.push(enemy);
          }
        });

        enemiesRef.current = remainingEnemies;
        setEnemies(remainingEnemies);

        // Handle HP loss
        if (hpLoss > 0) {
          soundManager.playDamage();
          setDamageFlash(true);
          setTimeout(() => setDamageFlash(false), 240);

          setStats((prev) => {
            const nextHp = Math.max(0, prev.hp - hpLoss);
            const isDead = nextHp <= 0;

            if (isDead) {
              setStatus('gameover');
              statusRef.current = 'gameover';
              soundManager.playGameOver();

              // Save High Score
              if (prev.score > prev.highScore) {
                localStorage.setItem(STORAGE_KEY_HIGH_SCORE, prev.score.toString());
                return {
                  ...prev,
                  hp: 0,
                  combo: 0,
                  highScore: prev.score
                };
              }

              return { ...prev, hp: 0, combo: 0 };
            }

            return {
              ...prev,
              hp: nextHp,
              combo: 0 // break combo on breach
            };
          });
        }

        // 3. Update Lasers
        const activeLasers = lasersRef.current.filter((laser) => {
          const elapsed = currentTime - laser.startTime;
          return elapsed < laser.duration;
        });
        lasersRef.current = activeLasers;
        setLasers(activeLasers);

        // 4. Update Particles
        const activeParticles: Particle[] = [];
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.type === 'ring' && p.radius !== undefined) {
            p.radius += 2.2;
          }

          if (p.alpha > 0) {
            activeParticles.push(p);
          }
        });
        particlesRef.current = activeParticles;
        setParticles(activeParticles);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [getSpawnInterval, spawnEnemy, createExplosion]);

  // Handle Input Changes & Exact Word Matching
  const handleInputChange = useCallback((value: string) => {
    const cleanVal = value.trim().toLowerCase();
    setCurrentInput(cleanVal);
    soundManager.playKeyType();

    if (!cleanVal || statusRef.current !== 'playing') {
      setActiveTargetId(null);
      return;
    }

    // Update keystrokes stats
    setStats(prev => ({ ...prev, totalKeystrokes: prev.totalKeystrokes + 1 }));

    // Find any enemies that start with this input
    const matchingPrefixEnemies = enemiesRef.current.filter(e =>
      e.word.toLowerCase().startsWith(cleanVal)
    );

    if (matchingPrefixEnemies.length > 0) {
      setStats(prev => ({ ...prev, correctKeystrokes: prev.correctKeystrokes + 1 }));
      // Set active target as lowest on screen
      const lowestMatch = matchingPrefixEnemies.reduce((lowest, curr) =>
        curr.y > lowest.y ? curr : lowest, matchingPrefixEnemies[0]
      );
      setActiveTargetId(lowestMatch.id);
    } else {
      setActiveTargetId(null);
    }

    // Check for Exact Match
    const exactMatch = enemiesRef.current.find(e =>
      e.word.toLowerCase() === cleanVal
    );

    if (exactMatch) {
      // 1. Play Laser Sound and Explosion
      soundManager.playLaser();
      soundManager.playExplosion();

      // 2. Calculate Score and Combo
      const currentCombo = statsRef.current.combo + 1;
      const comboMultiplier = 1 + Math.floor(currentCombo * 0.15);
      const points = exactMatch.points * comboMultiplier;

      if (currentCombo >= 3) {
        soundManager.playCombo(currentCombo);
      }

      // 3. Fire Laser Beam
      fireLaser(exactMatch.x, exactMatch.y, exactMatch.glowColor);

      // 4. Create Explosion Particles & Popups
      const comboText = currentCombo > 1 ? `COMBO x${currentCombo}` : undefined;
      createExplosion(exactMatch.x, exactMatch.y, exactMatch.glowColor, points, comboText);

      // 5. Remove Enemy from List
      enemiesRef.current = enemiesRef.current.filter(e => e.id !== exactMatch.id);
      setEnemies(enemiesRef.current);

      // 6. Clear Input immediately
      setCurrentInput('');
      setActiveTargetId(null);

      // 7. Update Stats & Waves
      setStats((prev) => {
        const nextScore = prev.score + points;
        const nextWords = prev.wordsDestroyed + 1;
        const nextWave = Math.floor(nextWords / 5) + 1; // Wave increases every 5 words
        const isWaveUp = nextWave > prev.wave;

        if (isWaveUp) {
          soundManager.playWaveUp();
        }

        const nextHighScore = Math.max(prev.highScore, nextScore);
        if (nextScore > prev.highScore) {
          localStorage.setItem(STORAGE_KEY_HIGH_SCORE, nextScore.toString());
        }

        return {
          ...prev,
          score: nextScore,
          highScore: nextHighScore,
          wordsDestroyed: nextWords,
          wave: nextWave,
          combo: currentCombo,
          maxCombo: Math.max(prev.maxCombo, currentCombo)
        };
      });
    }
  }, [createExplosion, fireLaser]);

  // Handle Virtual Keyboard Key Press
  const handleVirtualKeyPress = useCallback((char: string) => {
    handleInputChange(currentInput + char);
  }, [currentInput, handleInputChange]);

  const handleVirtualBackspace = useCallback(() => {
    if (currentInput.length > 0) {
      handleInputChange(currentInput.slice(0, -1));
    }
  }, [currentInput, handleInputChange]);

  const handleVirtualClear = useCallback(() => {
    handleInputChange('');
  }, [handleInputChange]);

  // Handle Quick Target Word click on Mobile
  const handleWordQuickTarget = useCallback((word: string) => {
    if (statusRef.current === 'playing') {
      handleInputChange(word);
    }
  }, [handleInputChange]);

  // Global Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to clear input or pause
      if (e.key === 'Escape') {
        if (currentInputRef.current) {
          handleInputChange('');
        } else if (statusRef.current === 'playing') {
          setStatus('paused');
        } else if (statusRef.current === 'paused') {
          setStatus('playing');
        }
        return;
      }

      // Spacebar when input is empty -> Pause / Resume
      if (e.key === ' ' && currentInputRef.current === '') {
        if (statusRef.current === 'playing') {
          e.preventDefault();
          setStatus('paused');
        } else if (statusRef.current === 'paused') {
          e.preventDefault();
          setStatus('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInputChange]);

  // Controls Handlers
  const handleStartGame = useCallback(() => {
    setStatus('playing');
    lastSpawnTimeRef.current = performance.now();
    // Spawn initial enemy
    if (enemiesRef.current.length === 0) {
      spawnEnemy();
    }
  }, [spawnEnemy]);

  const handlePauseGame = useCallback(() => {
    setStatus('paused');
  }, []);

  const handleResetGame = useCallback(() => {
    enemiesRef.current = [];
    lasersRef.current = [];
    particlesRef.current = [];
    setEnemies([]);
    setLasers([]);
    setParticles([]);
    setCurrentInput('');
    setActiveTargetId(null);
    setStatus('idle');

    setStats(prev => ({
      score: 0,
      highScore: prev.highScore,
      wave: 1,
      hp: 3,
      maxHp: 3,
      wordsDestroyed: 0,
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      combo: 0,
      maxCombo: 0
    }));
  }, []);

  const handleToggleMute = useCallback(() => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleChangeDifficulty = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
  }, []);

  const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center selection:bg-cyan-500 selection:text-black">
      {/* Top Arcade HUD Scoreboard */}
      <ScoreBoard stats={stats} difficulty={difficulty} />

      {/* Main Container */}
      <main className="w-full max-w-5xl px-3 sm:px-6 py-4 flex flex-col gap-4 flex-1">
        {/* Play Area: HTML5 Canvas */}
        <GameCanvas
          status={status}
          enemies={enemies}
          lasers={lasers}
          particles={particles}
          currentInput={currentInput}
          onDamageFlash={damageFlash}
          activeTargetId={activeTargetId}
          onStartClick={handleStartGame}
        />

        {/* Bottom Control Bar & Input */}
        <Controls
          status={status}
          currentInput={currentInput}
          onInputChange={handleInputChange}
          onStart={handleStartGame}
          onPause={handlePauseGame}
          onReset={handleResetGame}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          difficulty={difficulty}
          onChangeDifficulty={handleChangeDifficulty}
        />

        {/* Mobile / Responsive On-Screen Virtual Keyboard */}
        <VirtualKeyboard
          onKeyPress={handleVirtualKeyPress}
          onBackspace={handleVirtualBackspace}
          onClear={handleVirtualClear}
          visibleEnemies={enemies}
          currentInput={currentInput}
          onWordClick={handleWordQuickTarget}
          isOpen={isVirtualKeyboardOpen}
          onToggle={() => setIsVirtualKeyboardOpen(!isVirtualKeyboardOpen)}
        />

        {/* Instructions / How to Play Card */}
        <HowToPlay />
      </main>

      {/* Game Over Modal Overlay */}
      {status === 'gameover' && (
        <GameOverModal
          stats={stats}
          isNewHighScore={isNewHighScore}
          onRestart={() => {
            handleResetGame();
            handleStartGame();
          }}
        />
      )}
    </div>
  );
}
