export const WORD_COLLECTIONS = {
  easy: [
    // 3-4 letters
    'code', 'hack', 'loop', 'data', 'byte', 'node', 'flux', 'grid', 'core', 'cpu',
    'git', 'dev', 'run', 'web', 'app', 'bug', 'ram', 'net', 'bit', 'key',
    'link', 'port', 'sync', 'test', 'user', 'null', 'void', 'path', 'ping', 'host',
    'root', 'echo', 'pipe', 'hash', 'push', 'pull', 'font', 'chip', 'icon', 'card',
    'view', 'load', 'save', 'file', 'read', 'math', 'text', 'send', 'drop', 'boot'
  ],
  medium: [
    // 5-6 letters
    'react', 'array', 'async', 'fetch', 'stack', 'cyber', 'robot', 'laser', 'pixel', 'cloud',
    'server', 'matrix', 'script', 'cache', 'stream', 'socket', 'engine', 'plasma', 'shield', 'galaxy',
    'system', 'vector', 'buffer', 'router', 'docker', 'github', 'commit', 'branch', 'client', 'memory',
    'thread', 'binary', 'crypto', 'sensor', 'widget', 'module', 'packet', 'portal', 'beacon', 'syntax',
    'render', 'deploy', 'action', 'state', 'props', 'filter', 'cursor', 'player', 'target', 'energy'
  ],
  hard: [
    // 7+ letters
    'function', 'terminal', 'compiler', 'variable', 'database', 'frontend', 'backend', 'security',
    'firewall', 'protocol', 'quantum', 'asteroid', 'satellite', 'algorithm', 'encryption', 'interface',
    'developer', 'supernova', 'hyperdrive', 'framework', 'middleware', 'blockchain', 'javascript',
    'typescript', 'component', 'responsive', 'performance', 'artificial', 'intelligence', 'connection',
    'repository', 'expression', 'automation', 'controller', 'executable', 'simulation'
  ]
};

export const ENEMY_CONFIGS = {
  scout: {
    color: '#06b6d4', // Cyan
    glowColor: 'rgba(6, 182, 212, 0.8)',
    width: 44,
    height: 36,
    speedMultiplier: 1.1,
    points: 10,
    hp: 1
  },
  drone: {
    color: '#a855f7', // Purple
    glowColor: 'rgba(168, 85, 247, 0.8)',
    width: 50,
    height: 40,
    speedMultiplier: 0.95,
    points: 15,
    hp: 1
  },
  cruiser: {
    color: '#f59e0b', // Amber / Gold
    glowColor: 'rgba(245, 158, 11, 0.8)',
    width: 60,
    height: 48,
    speedMultiplier: 0.75,
    points: 20,
    hp: 1
  },
  boss: {
    color: '#ef4444', // Red
    glowColor: 'rgba(239, 68, 68, 0.9)',
    width: 76,
    height: 58,
    speedMultiplier: 0.55,
    points: 50,
    hp: 1
  }
};

/**
 * Returns a random word based on wave number and difficulty
 */
export function getRandomWord(wave: number, existingWords: string[]): string {
  let pool: string[];

  if (wave <= 2) {
    pool = WORD_COLLECTIONS.easy;
  } else if (wave <= 5) {
    // 60% easy, 40% medium
    pool = Math.random() < 0.6 ? WORD_COLLECTIONS.easy : WORD_COLLECTIONS.medium;
  } else if (wave <= 8) {
    // 30% easy, 50% medium, 20% hard
    const rand = Math.random();
    if (rand < 0.3) pool = WORD_COLLECTIONS.easy;
    else if (rand < 0.8) pool = WORD_COLLECTIONS.medium;
    else pool = WORD_COLLECTIONS.hard;
  } else {
    // Wave 9+: mostly medium & hard
    pool = Math.random() < 0.4 ? WORD_COLLECTIONS.medium : WORD_COLLECTIONS.hard;
  }

  // Filter out words currently on screen to prevent duplicates with identical prefixes
  const available = pool.filter(w => !existingWords.includes(w));
  const finalPool = available.length > 0 ? available : pool;

  return finalPool[Math.floor(Math.random() * finalPool.length)];
}
