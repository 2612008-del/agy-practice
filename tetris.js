/**
 * TETRIS NEO - Pure JavaScript Implementation
 * Features: 7-Bag Randomizer, SRS Wall Kicks, Ghost Piece, Hold, Next Queue,
 * Web Audio API Sound Effects & BGM, Responsive Touch Controls
 */

// ==========================================
// 1. Audio System (Web Audio API)
// ==========================================
class SoundController {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.bgmEnabled = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.init();
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleBGM() {
    this.init();
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.bgmEnabled;
  }

  playMove() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playRotate() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  playHold() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(450, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playHardDrop() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playLock() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playLineClear(lines = 1) {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (lines >= 4) {
        // Tetris fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.12, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.25);
        });
      } else {
        // 1-3 lines arpeggio
        const baseFreq = 440;
        for (let i = 0; i < lines; i++) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(baseFreq * Math.pow(1.25, i), now + i * 0.06);
          gain.gain.setValueAtTime(0.12, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.16);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.16);
        }
      }
    } catch (e) {}
  }

  playLevelUp() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [330, 440, 550, 660, 880];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);
        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.2);
      });
    } catch (e) {}
  }

  playGameOver() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [420, 360, 310, 260, 180, 120];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + idx * 0.1);
        gain.gain.setValueAtTime(0.12, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.22);
      });
    } catch (e) {}
  }

  startBGM() {
    if (this.bgmTimer) return;
    this.bgmStep = 0;
    
    // Korobeiniki theme 16th-note sequence
    const E5 = 659.25, B4 = 493.88, C5 = 523.25, D5 = 587.33, A4 = 440.00;
    const G4 = 392.00, F4 = 349.23, E4 = 329.63, Gs4 = 415.30;
    
    const melody = [
      [E5, 4], [B4, 2], [C5, 2], [D5, 4], [C5, 2], [B4, 2],
      [A4, 4], [A4, 2], [C5, 2], [E5, 4], [D5, 2], [C5, 2],
      [B4, 6], [C5, 2], [D5, 4], [E5, 4],
      [C5, 4], [A4, 4], [A4, 6], [0, 2],
      
      [D5, 4], [F4 * 2, 2], [A4 * 2, 4], [G4 * 2, 2], [F4 * 2, 2],
      [E5, 6], [C5, 2], [E5, 4], [D5, 2], [C5, 2],
      [B4, 4], [B4, 2], [C5, 2], [D5, 4], [E5, 4],
      [C5, 4], [A4, 4], [A4, 6], [0, 2]
    ];

    const bass = [
      [E4/2, 2], [B4/2, 2], [E4/2, 2], [B4/2, 2],
      [A4/2, 2], [E4/2, 2], [A4/2, 2], [E4/2, 2],
      [Gs4/2, 2], [E4/2, 2], [Gs4/2, 2], [E4/2, 2],
      [A4/2, 2], [E4/2, 2], [A4/2, 2], [E4/2, 2],

      [D5/2, 2], [A4/2, 2], [D5/2, 2], [A4/2, 2],
      [C5/2, 2], [G4/2, 2], [C5/2, 2], [G4/2, 2],
      [B4/2, 2], [Gs4/2, 2], [B4/2, 2], [E4/2, 2],
      [A4/2, 2], [E4/2, 2], [A4/2, 2], [E4/2, 2]
    ];

    const melodySteps = [];
    melody.forEach(([freq, dur]) => {
      melodySteps.push(freq);
      for (let i = 1; i < dur; i++) melodySteps.push(-1);
    });

    const bassSteps = [];
    bass.forEach(([freq, dur]) => {
      bassSteps.push(freq);
      for (let i = 1; i < dur; i++) bassSteps.push(-1);
    });

    const tempoMs = 140;
    this.bgmTimer = setInterval(() => {
      if (!this.bgmEnabled || !this.ctx) return;
      
      const step = this.bgmStep % melodySteps.length;
      const bStep = this.bgmStep % bassSteps.length;
      const now = this.ctx.currentTime;

      const mFreq = melodySteps[step];
      if (mFreq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(mFreq, now);
        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (tempoMs / 1000) * 1.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + (tempoMs / 1000) * 1.8);
      }

      const bFreq = bassSteps[bStep];
      if (bFreq > 0) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bFreq, now);
        bGain.gain.setValueAtTime(0.05, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + (tempoMs / 1000) * 1.5);
        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);
        bOsc.start(now);
        bOsc.stop(now + (tempoMs / 1000) * 1.5);
      }

      this.bgmStep++;
    }, tempoMs);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

const sounds = new SoundController();

// ==========================================
// 2. Tetrominoes & Constants
// ==========================================
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30; // 300x600 canvas

const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#7ED6DF', // パステルミントアクア
    glow: 'rgba(126, 214, 223, 0.45)'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#94B3FD', // パステルスカイブルー
    glow: 'rgba(148, 179, 253, 0.45)'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#FFB385', // パステルアプリコットオレンジ
    glow: 'rgba(255, 179, 133, 0.45)'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#FFEAA7', // パステルカスタードイエロー
    glow: 'rgba(255, 234, 167, 0.45)'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#B5EAD7', // パステルミントグリーン
    glow: 'rgba(181, 234, 215, 0.45)'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#DFCCF1', // パステルラベンダー
    glow: 'rgba(223, 204, 241, 0.45)'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#FFB7B2', // パステルストロベリーピンク
    glow: 'rgba(255, 183, 178, 0.45)'
  }
};

// Standard Wall Kick Tests (JLSTZ)
const WALL_KICKS = {
  normal: [
    [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], // 0->1
    [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],    // 1->2
    [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],    // 2->3
    [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]   // 3->0
  ],
  iPiece: [
    [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
    [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]
  ]
};

// ==========================================
// 3. Game State & Logic
// ==========================================
class TetrisGame {
  constructor() {
    this.boardCanvas = document.getElementById('board-canvas');
    this.boardCtx = this.boardCanvas.getContext('2d');
    
    this.holdCanvas = document.getElementById('hold-canvas');
    this.holdCtx = this.holdCanvas.getContext('2d');
    
    this.nextCanvas = document.getElementById('next-canvas');
    this.nextCtx = this.nextCanvas.getContext('2d');
    
    // UI Elements
    this.scoreDisplay = document.getElementById('score-display');
    this.highScoreDisplay = document.getElementById('high-score-display');
    this.levelDisplay = document.getElementById('level-display');
    this.linesDisplay = document.getElementById('lines-display');
    
    this.startOverlay = document.getElementById('start-overlay');
    this.pauseOverlay = document.getElementById('pause-overlay');
    this.gameoverOverlay = document.getElementById('gameover-overlay');
    this.finalScore = document.getElementById('final-score');
    this.finalLines = document.getElementById('final-lines');
    this.finalLevel = document.getElementById('final-level');
    
    this.soundBtn = document.getElementById('sound-btn');
    this.soundIcon = document.getElementById('sound-icon');
    this.bgmBtn = document.getElementById('bgm-btn');
    this.bgmIcon = document.getElementById('bgm-icon');
    this.pauseBtn = document.getElementById('pause-btn');

    // Game variables
    this.board = this.createBoard();
    this.bag = [];
    this.nextQueue = [];
    this.currentPiece = null;
    this.holdPiece = null;
    this.canHold = true;
    
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('tetris_neo_high') || '0', 10);
    this.level = 1;
    this.lines = 0;
    
    this.isPlaying = false;
    this.isPaused = false;
    this.dropCounter = 0;
    this.lastTime = 0;
    this.animId = null;
    
    // Lock delay
    this.lockDelay = 500; // ms
    this.lockTimer = null;
    this.isLocking = false;

    // Line clear animation
    this.clearingLines = [];
    this.clearAnimTime = 0;

    this.highScoreDisplay.textContent = this.highScore;
    
    this.bindEvents();
    this.render();
  }

  createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  getDropInterval() {
    // Speeds up per level (ms)
    return Math.max(80, 800 - (this.level - 1) * 70);
  }

  // 7-Bag Randomizer
  refillBag() {
    const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    this.bag = pieces;
  }

  getNextPieceType() {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    return this.bag.pop();
  }

  spawnPiece(type = null) {
    while (this.nextQueue.length < 4) {
      this.nextQueue.push(this.getNextPieceType());
    }
    const pieceType = type || this.nextQueue.shift();
    const proto = TETROMINOES[pieceType];
    
    const matrix = proto.shape.map(row => [...row]);
    const x = Math.floor((COLS - matrix[0].length) / 2);
    const y = 0;

    this.currentPiece = {
      type: pieceType,
      matrix: matrix,
      x: x,
      y: y,
      color: proto.color,
      glow: proto.glow,
      rotation: 0
    };

    this.canHold = true;
    this.isLocking = false;
    clearTimeout(this.lockTimer);

    // Collision immediately upon spawn => Game Over
    if (this.checkCollision(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y)) {
      this.gameOver();
    }
  }

  checkCollision(matrix, px, py) {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 0) {
          const newX = px + c;
          const newY = py + r;
          if (newX < 0 || newX >= COLS || newY >= ROWS) {
            return true;
          }
          if (newY >= 0 && this.board[newY][newX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  moveLeft() {
    if (!this.isPlaying || this.isPaused || !this.currentPiece) return;
    if (!this.checkCollision(this.currentPiece.matrix, this.currentPiece.x - 1, this.currentPiece.y)) {
      this.currentPiece.x--;
      sounds.playMove();
      this.resetLockDelay();
    }
  }

  moveRight() {
    if (!this.isPlaying || this.isPaused || !this.currentPiece) return;
    if (!this.checkCollision(this.currentPiece.matrix, this.currentPiece.x + 1, this.currentPiece.y)) {
      this.currentPiece.x++;
      sounds.playMove();
      this.resetLockDelay();
    }
  }

  rotate(clockwise = true) {
    if (!this.isPlaying || this.isPaused || !this.currentPiece) return;
    if (this.currentPiece.type === 'O') return;

    const m = this.currentPiece.matrix;
    const N = m.length;
    const rotated = Array.from({ length: N }, () => Array(N).fill(0));

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (clockwise) {
          rotated[c][N - 1 - r] = m[r][c];
        } else {
          rotated[N - 1 - c][r] = m[r][c];
        }
      }
    }

    const currentRot = this.currentPiece.rotation;
    const nextRot = clockwise ? (currentRot + 1) % 4 : (currentRot + 3) % 4;

    // Wall kicks
    const kicks = (this.currentPiece.type === 'I') ? WALL_KICKS.iPiece[currentRot] : WALL_KICKS.normal[currentRot];

    let kicked = false;
    for (const [kx, ky] of kicks) {
      const testX = this.currentPiece.x + (clockwise ? kx : -kx);
      const testY = this.currentPiece.y - (clockwise ? ky : -ky);
      if (!this.checkCollision(rotated, testX, testY)) {
        this.currentPiece.matrix = rotated;
        this.currentPiece.x = testX;
        this.currentPiece.y = testY;
        this.currentPiece.rotation = nextRot;
        kicked = true;
        sounds.playRotate();
        this.resetLockDelay();
        break;
      }
    }

    // Basic fallback if kicks failed
    if (!kicked && !this.checkCollision(rotated, this.currentPiece.x, this.currentPiece.y)) {
      this.currentPiece.matrix = rotated;
      this.currentPiece.rotation = nextRot;
      sounds.playRotate();
      this.resetLockDelay();
    }
  }

  softDrop() {
    if (!this.isPlaying || this.isPaused || !this.currentPiece) return;
    if (!this.checkCollision(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y + 1)) {
      this.currentPiece.y++;
      this.score += 1;
      this.updateStats();
      this.dropCounter = 0;
    } else {
      // 接地中に下キーを押した場合は即座に固定して消去
      this.lockPiece(true);
    }
  }

  hardDrop() {
    if (!this.isPlaying || this.isPaused || !this.currentPiece) return;
    let dropDist = 0;
    while (!this.checkCollision(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y + 1)) {
      this.currentPiece.y++;
      dropDist++;
    }
    this.score += dropDist * 2;
    this.updateStats();
    sounds.playHardDrop();
    this.lockPiece(true);
  }

  hold() {
    if (!this.isPlaying || this.isPaused || !this.currentPiece || !this.canHold) return;
    sounds.playHold();
    
    const currType = this.currentPiece.type;
    if (!this.holdPiece) {
      this.holdPiece = currType;
      this.spawnPiece();
    } else {
      const swapType = this.holdPiece;
      this.holdPiece = currType;
      this.spawnPiece(swapType);
    }
    this.canHold = false;
  }

  resetLockDelay() {
    if (this.isLocking) {
      clearTimeout(this.lockTimer);
      this.isLocking = false;
    }
  }

  lockPiece(immediate = false) {
    if (immediate) {
      this.solidifyPiece();
      return;
    }
    if (!this.isLocking) {
      this.isLocking = true;
      this.lockTimer = setTimeout(() => {
        if (this.isPlaying && !this.isPaused && this.currentPiece && this.checkCollision(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y + 1)) {
          this.solidifyPiece();
        }
        this.isLocking = false;
      }, 350);
    }
  }

  solidifyPiece() {
    clearTimeout(this.lockTimer);
    this.isLocking = false;
    sounds.playLock();

    const m = this.currentPiece.matrix;
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c < m[r].length; c++) {
        if (m[r][c] !== 0) {
          const by = this.currentPiece.y + r;
          const bx = this.currentPiece.x + c;
          if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
            this.board[by][bx] = {
              color: this.currentPiece.color,
              glow: this.currentPiece.glow
            };
          }
        }
      }
    }

    this.currentPiece = null;
    this.checkLines();
  }

  checkLines() {
    // 揃っていない行だけを抽出（インデックスズレを100%防止）
    const survivingRows = this.board.filter(row => row.some(cell => cell === 0));
    const linesCleared = ROWS - survivingRows.length;

    if (linesCleared > 0) {
      // 空行を上部に追加して新しいボードを生成
      const emptyRows = Array.from({ length: linesCleared }, () => Array(COLS).fill(0));
      this.board = [...emptyRows, ...survivingRows];

      // ラグなしで効果音とスコア加算
      sounds.playLineClear(linesCleared);

      const basePoints = [0, 100, 300, 500, 800];
      const points = (basePoints[linesCleared] || 800) * this.level;
      this.score += points;
      this.lines += linesCleared;

      const nextLevel = Math.floor(this.lines / 10) + 1;
      if (nextLevel > this.level) {
        this.level = nextLevel;
        sounds.playLevelUp();
      }

      this.updateStats();
    }

    // ラグなし（0ms）で即座に次のピースをスポーン
    this.spawnPiece();
  }

  getGhostPosition() {
    if (!this.currentPiece) return null;
    let gy = this.currentPiece.y;
    while (!this.checkCollision(this.currentPiece.matrix, this.currentPiece.x, gy + 1)) {
      gy++;
    }
    return { x: this.currentPiece.x, y: gy };
  }

  updateStats() {
    this.scoreDisplay.textContent = this.score;
    this.levelDisplay.textContent = this.level;
    this.linesDisplay.textContent = this.lines;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.highScoreDisplay.textContent = this.highScore;
      localStorage.setItem('tetris_neo_high', this.highScore.toString());
    }
  }

  startGame() {
    sounds.init();
    this.board = this.createBoard();
    this.bag = [];
    this.nextQueue = [];
    this.holdPiece = null;
    this.canHold = true;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.isPaused = false;
    this.isPlaying = true;
    this.clearingLines = [];

    this.updateStats();
    this.spawnPiece();

    this.startOverlay.classList.add('hidden');
    this.pauseOverlay.classList.add('hidden');
    this.gameoverOverlay.classList.add('hidden');

    this.lastTime = performance.now();
    cancelAnimationFrame(this.animId);
    this.loop();
  }

  togglePause() {
    if (!this.isPlaying) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pauseOverlay.classList.remove('hidden');
      this.pauseIcon.textContent = '▶️';
    } else {
      this.pauseOverlay.classList.add('hidden');
      this.pauseIcon.textContent = '⏸️';
      this.lastTime = performance.now();
      this.loop();
    }
  }

  gameOver() {
    this.isPlaying = false;
    sounds.playGameOver();
    cancelAnimationFrame(this.animId);

    this.finalScore.textContent = this.score;
    this.finalLines.textContent = this.lines;
    this.finalLevel.textContent = this.level;
    this.gameoverOverlay.classList.remove('hidden');
  }

  loop(currentTime = performance.now()) {
    if (!this.isPlaying || this.isPaused) return;

    const dt = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.dropCounter += dt;
    if (this.dropCounter > this.getDropInterval()) {
      if (this.currentPiece && !this.checkCollision(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y + 1)) {
        this.currentPiece.y++;
        this.resetLockDelay();
      } else if (this.currentPiece) {
        this.lockPiece();
      }
      this.dropCounter = 0;
    }

    this.render();
    this.animId = requestAnimationFrame(t => this.loop(t));
  }

  // ==========================================
  // 4. Rendering Methods
  // ==========================================
  drawBlock(ctx, x, y, color, glow, isGhost = false, isFlash = false) {
    const px = x * BLOCK_SIZE;
    const py = y * BLOCK_SIZE;
    const size = BLOCK_SIZE;
    const pad = 2;
    const r = 5; // 角丸半径
    const bx = px + pad;
    const by = py + pad;
    const bw = size - pad * 2;
    const bh = size - pad * 2;

    const drawRoundRectPath = (rx, ry, rw, rh, radius) => {
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(rx, ry, rw, rh, radius);
      } else {
        ctx.beginPath();
        ctx.moveTo(rx + radius, ry);
        ctx.lineTo(rx + rw - radius, ry);
        ctx.arcTo(rx + rw, ry, rx + rw, ry + radius, radius);
        ctx.lineTo(rx + rw, ry + rh - radius);
        ctx.arcTo(rx + rw, ry + rh, rx + rw - radius, ry + rh, radius);
        ctx.lineTo(rx + radius, ry + rh);
        ctx.arcTo(rx, ry + rh, rx, ry + rh - radius, radius);
        ctx.lineTo(rx, ry + radius);
        ctx.arcTo(rx, ry, rx + radius, ry, radius);
        ctx.closePath();
      }
    };

    ctx.save();
    if (isFlash) {
      drawRoundRectPath(bx, by, bw, bh, r);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
      return;
    }

    if (isGhost) {
      drawRoundRectPath(bx, by, bw, bh, r);
      ctx.strokeStyle = color;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      return;
    }

    // パステルブロック本体
    drawRoundRectPath(bx, by, bw, bh, r);
    ctx.shadowColor = glow || color;
    ctx.shadowBlur = 4;
    ctx.fillStyle = color;
    ctx.fill();

    // ぷっくりした光沢ハイライト（上部）
    drawRoundRectPath(bx + 1.5, by + 1.5, bw - 3, (bh - 3) * 0.45, Math.max(1, r - 2));
    const highlightGrad = ctx.createLinearGradient(bx, by, bx, by + bh * 0.45);
    highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
    ctx.fillStyle = highlightGrad;
    ctx.fill();

    // 下部のやわらかい陰影
    drawRoundRectPath(bx + 2, by + bh - 5, bw - 4, 3.5, 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fill();

    ctx.restore();
  }

  drawGrid(ctx) {
    ctx.strokeStyle = 'rgba(180, 170, 210, 0.15)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * BLOCK_SIZE, 0);
      ctx.lineTo(c * BLOCK_SIZE, ROWS * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * BLOCK_SIZE);
      ctx.lineTo(COLS * BLOCK_SIZE, r * BLOCK_SIZE);
      ctx.stroke();
    }
  }

  render() {
    // Clear Main Board
    this.boardCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
    this.drawGrid(this.boardCtx);

    // Render locked pieces
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = this.board[r][c];
        if (cell !== 0) {
          this.drawBlock(this.boardCtx, c, r, cell.color, cell.glow, false);
        }
      }
    }

    // Render ghost piece
    if (this.currentPiece) {
      const ghost = this.getGhostPosition();
      if (ghost) {
        const m = this.currentPiece.matrix;
        for (let r = 0; r < m.length; r++) {
          for (let c = 0; c < m[r].length; c++) {
            if (m[r][c] !== 0) {
              this.drawBlock(this.boardCtx, ghost.x + c, ghost.y + r, this.currentPiece.color, null, true);
            }
          }
        }
      }

      // Render active falling piece
      const m = this.currentPiece.matrix;
      for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m[r].length; c++) {
          if (m[r][c] !== 0) {
            this.drawBlock(this.boardCtx, this.currentPiece.x + c, this.currentPiece.y + r, this.currentPiece.color, this.currentPiece.glow);
          }
        }
      }
    }

    // Render HOLD Box
    this.renderPreview(this.holdCtx, this.holdCanvas, this.holdPiece ? [this.holdPiece] : [], 1);

    // Render NEXT Box (show top 3)
    this.renderPreview(this.nextCtx, this.nextCanvas, this.nextQueue.slice(0, 3), 3);
  }

  renderPreview(ctx, canvas, pieces, maxPieces) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!pieces || pieces.length === 0) return;

    const slotHeight = canvas.height / maxPieces;
    const miniBlockSize = 22;
    const r = 4;

    const drawRoundRectPath = (rx, ry, rw, rh, radius) => {
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(rx, ry, rw, rh, radius);
      } else {
        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh);
      }
    };

    pieces.forEach((pType, idx) => {
      const proto = TETROMINOES[pType];
      const m = proto.shape;
      const pieceW = m[0].length * miniBlockSize;
      const pieceH = m.length * miniBlockSize;

      const offsetX = (canvas.width - pieceW) / 2;
      const offsetY = idx * slotHeight + (slotHeight - pieceH) / 2;

      for (let row = 0; row < m.length; row++) {
        for (let col = 0; col < m[row].length; col++) {
          if (m[row][col] !== 0) {
            const px = offsetX + col * miniBlockSize;
            const py = offsetY + row * miniBlockSize;
            const pad = 1.5;
            const bx = px + pad;
            const by = py + pad;
            const bw = miniBlockSize - pad * 2;
            const bh = miniBlockSize - pad * 2;

            ctx.save();
            drawRoundRectPath(bx, by, bw, bh, r);
            ctx.fillStyle = proto.color;
            ctx.shadowColor = proto.glow;
            ctx.shadowBlur = 3;
            ctx.fill();

            // 光沢ハイライト
            ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            ctx.fillRect(bx + 1, by + 1, bw - 2, 2.5);
            ctx.restore();
          }
        }
      }
    });
  }

  // ==========================================
  // 5. Input Controls & Event Handlers
  // ==========================================
  bindEvents() {
    // Keyboard Controls
    window.addEventListener('keydown', e => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (!this.isPlaying && (e.code === 'Space' || e.code === 'Enter')) {
        this.startGame();
        return;
      }

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft();
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.moveRight();
          break;
        case 'ArrowUp':
        case 'KeyX':
          this.rotate(true);
          break;
        case 'KeyZ':
          this.rotate(false);
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.softDrop();
          break;
        case 'Space':
          this.hardDrop();
          break;
        case 'KeyC':
        case 'ShiftLeft':
        case 'ShiftRight':
          this.hold();
          break;
        case 'KeyP':
        case 'Escape':
          this.togglePause();
          break;
      }
    });

    // UI Buttons
    document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
    document.getElementById('resume-btn').addEventListener('click', () => this.togglePause());
    document.getElementById('restart-from-pause-btn').addEventListener('click', () => this.startGame());
    
    this.pauseBtn.addEventListener('click', () => this.togglePause());

    this.soundBtn.addEventListener('click', () => {
      const enabled = sounds.toggleSound();
      this.soundIcon.textContent = enabled ? '🔊' : '🔇';
    });

    this.bgmBtn.addEventListener('click', () => {
      const enabled = sounds.toggleBGM();
      this.bgmIcon.textContent = enabled ? '🎵' : '🎶';
    });

    // Mobile / Touch Button Bindings
    const bindTouchAction = (btnId, action, repeat = false) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      let intervalId = null;

      const start = (e) => {
        e.preventDefault();
        sounds.init();
        action();
        if (repeat) {
          intervalId = setInterval(action, 90);
        }
      };

      const end = (e) => {
        e.preventDefault();
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };

      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end, { passive: false });
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
    };

    bindTouchAction('btn-left', () => this.moveLeft(), true);
    bindTouchAction('btn-right', () => this.moveRight(), true);
    bindTouchAction('btn-down', () => this.softDrop(), true);
    bindTouchAction('btn-rot-cw', () => this.rotate(true));
    bindTouchAction('btn-rot-ccw', () => this.rotate(false));
    bindTouchAction('btn-hard-drop', () => this.hardDrop());
    bindTouchAction('btn-hold', () => this.hold());
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new TetrisGame();
});
