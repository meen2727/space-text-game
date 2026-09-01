export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type EnemyType = 'scout' | 'drone' | 'cruiser' | 'boss';

export interface Enemy {
  id: string;
  word: string;
  originalWord: string;
  x: number;
  y: number;
  speed: number;
  type: EnemyType;
  width: number;
  height: number;
  color: string;
  glowColor: string;
  hp: number;
  maxHp: number;
  points: number;
  rotation: number;
  wobbleOffset: number;
  wobbleSpeed: number;
}

export interface Laser {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  progress: number; // 0 to 1
  color: string;
  thickness: number;
  duration: number;
  startTime: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type: 'spark' | 'ring' | 'text' | 'debris';
  text?: string;
  radius?: number;
  maxRadius?: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
  color: string;
}

export interface GameStats {
  score: number;
  highScore: number;
  wave: number;
  hp: number;
  maxHp: number;
  wordsDestroyed: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  combo: number;
  maxCombo: number;
}
