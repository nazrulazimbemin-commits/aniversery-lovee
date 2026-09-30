/* ============================================================
 * USER CONFIGURATION
 * ============================================================ */
const CONFIG = {
  passcode: "070710",
  coupleNames: "A & O",
  anniversaryDate: "07.07.2010",
  anniversaryTitle: "HAPPY ANNIVERSARY MY LOVE",
  musicUrl: "asset/lagu/lagu_kita.mp3",
  puzzleImageUrl: "asset/gambar_puzzle/gambar_puzzle.jpg",
  videoUrl: "asset/vidio/hadiah.mp4",
  galleryPhotos: [
    {
      title: "The Day We Met",
      desc: "The beautiful day that changed my destiny forever... ❤️",
      url: "asset/gambar/foto1.jpg.jpg"
    },
    {
      title: "Our First Date",
      desc: "Butterflies in my stomach seeing your captivating smile.",
      url: "asset/gambar/foto2.jpg.jpg"
    },
    {
      title: "Sweet Laughter",
      desc: "My peaceful haven is hearing your joy and laughter.",
      url: "asset/gambar/foto3.jpg.jpg"
    },
    {
      title: "Dream Vacation",
      desc: "Exploring the beauty of the world hand-in-hand with you.",
      url: "asset/gambar/foto4.jpg.jpg"
    },
    {
      title: "Holding Hands",
      desc: "A gentle touch that promised to never let go.",
      url: "asset/gambar/foto5.jpg.jpg"
    },
    {
      title: "Anniversary Joy",
      desc: "With each passing year, my devotion grows deeper.",
      url: "asset/gambar/foto6.jpg.jpg"
    },
    {
      title: "Cozy Moments",
      desc: "Just the two of us, creating our own little paradise.",
      url: "asset/gambar/foto7.jpg.jpg"
    },
    {
      title: "Your Sweetest Smile",
      desc: "The light that brightens up even my darkest days.",
      url: "asset/gambar/foto8.jpg.jpg"
    },
    {
      title: "Dreaming Together",
      desc: "Building our dreams and future side by side.",
      url: "asset/gambar/foto9.jpg.jpg"
    },
    {
      title: "Forever & Always",
      desc: "From 07.07.10 to eternity. I love you endlessly! 💖",
      url: "asset/gambar/foto10.jpg.jpg"
    }
  ]
};

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.melodyTimeout = null;
    this.noteIndex = 0;
    this.melody = [
      { f: 523.25, d: 0.4 }, { f: 659.25, d: 0.4 }, { f: 783.99, d: 0.4 }, { f: 1046.50, d: 0.8 },
      { f: 880.00, d: 0.4 }, { f: 783.99, d: 0.4 }, { f: 659.25, d: 0.8 },
      { f: 587.33, d: 0.4 }, { f: 698.46, d: 0.4 }, { f: 880.00, d: 0.4 }, { f: 987.77, d: 0.8 },
      { f: 783.99, d: 0.4 }, { f: 659.25, d: 0.4 }, { f: 523.25, d: 0.8 },
      { f: 659.25, d: 0.3 }, { f: 783.99, d: 0.3 }, { f: 880.00, d: 0.6 },
      { f: 1046.50, d: 0.4 }, { f: 1174.66, d: 0.4 }, { f: 1318.51, d: 1.0 },
      { f: 1046.50, d: 0.4 }, { f: 880.00, d: 0.4 }, { f: 783.99, d: 0.6 },
      { f: 659.25, d: 0.4 }, { f: 587.33, d: 0.4 }, { f: 523.25, d: 1.2 }
    ];
    this.bassNotes = [261.63, 196.00, 220.00, 164.81, 174.61, 130.81, 174.61, 196.00];
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, duration, type = 'triangle', gainVal = 0.08) {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio note error:', e);
    }
  }

  playSfx(type) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.05);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 0.22, 'triangle', 0.1), i * 85);
      });
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.18);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  }

  startMusic() {
    this.initContext();
    this.isPlaying = true;
    this.stepMelody();
  }

  stepMelody() {
    if (!this.isPlaying) return;
    const currentNote = this.melody[this.noteIndex];
    this.playTone(currentNote.f, currentNote.d, 'triangle', 0.08);
    const bassFreq = this.bassNotes[Math.floor(this.noteIndex / 3) % this.bassNotes.length];
    this.playTone(bassFreq, currentNote.d * 1.4, 'sine', 0.05);
    this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    const delay = currentNote.d * 1000 * 0.9;
    this.melodyTimeout = setTimeout(() => this.stepMelody(), delay);
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.melodyTimeout) {
      clearTimeout(this.melodyTimeout);
      this.melodyTimeout = null;
    }
  }
}

const soundEngine = new RetroAudioEngine();
const musicToggleBtn = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');
const musicLabel = document.getElementById('music-label');
const customAudioElement = document.getElementById('bg-audio');
let isMusicActive = false;

function startBackgroundAudio() {
  isMusicActive = true;
  musicToggleBtn.classList.add('playing');
  musicIcon.textContent = '🎵';
  musicLabel.textContent = 'MUSIC: ON';

  if (CONFIG.musicUrl && CONFIG.musicUrl.trim() !== '') {
    const targetSrc = CONFIG.musicUrl.trim();
    if (!customAudioElement.src || !customAudioElement.src.includes(encodeURI(targetSrc))) {
      customAudioElement.src = targetSrc;
    }
    customAudioElement.play().catch(() => {
      console.log('Audio file auto-play waiting for user interaction');
    });
  } else {
    soundEngine.startMusic();
  }
}

function stopBackgroundAudio() {
  isMusicActive = false;
  musicToggleBtn.classList.remove('playing');
  musicIcon.textContent = '🔇';
  musicLabel.textContent = 'MUSIC: OFF';

  if (customAudioElement && !customAudioElement.paused) {
    customAudioElement.pause();
  }
  soundEngine.stopMusic();
}

musicToggleBtn.addEventListener('click', () => {
  soundEngine.playSfx('click');
  if (isMusicActive) {
    stopBackgroundAudio();
  } else {
    startBackgroundAudio();
  }
});

const triggerAudioOnGesture = () => {
  if (!isMusicActive && CONFIG.musicUrl) {
    startBackgroundAudio();
  }
  window.removeEventListener('click', triggerAudioOnGesture);
  window.removeEventListener('keydown', triggerAudioOnGesture);
};
window.addEventListener('click', triggerAudioOnGesture, { once: true });
window.addEventListener('keydown', triggerAudioOnGesture, { once: true });

const curtainContainer = document.getElementById('curtain-container');

function playCurtainTransition(callbackMidway) {
  curtainContainer.classList.add('show-valance');
  curtainContainer.classList.add('curtain-closing');

  setTimeout(() => {
    if (typeof callbackMidway === 'function') {
      callbackMidway();
    }

    setTimeout(() => {
      curtainContainer.classList.remove('curtain-closing');
      setTimeout(() => {
        curtainContainer.classList.remove('show-valance');
      }, 1100);
    }, 300);
  }, 1050);
}

function navigateTo(targetScreenId) {
  soundEngine.playSfx('click');
  const screens = document.querySelectorAll('.view-screen');
  screens.forEach(screen => screen.classList.remove('active'));

  const target = document.getElementById(targetScreenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
}

let enteredCode = '';
const maxDigits = 6;
const feedbackEl = document.getElementById('passcode-feedback');

function updatePinSlots() {
  for (let i = 0; i < maxDigits; i++) {
    const slot = document.getElementById(`slot-${i}`);
    if (i < enteredCode.length) {
      slot.textContent = '❤️';
      slot.classList.add('filled');
    } else {
      slot.textContent = '•';
      slot.classList.remove('filled');
    }
  }
}

function handleKeyInput(digit) {
  soundEngine.playSfx('click');
  feedbackEl.className = 'passcode-message';

  if (digit === 'CLEAR') {
    enteredCode = '';
    feedbackEl.textContent = 'Passcode cleared.';
    updatePinSlots();
    return;
  }

  if (digit === 'DEL') {
    enteredCode = enteredCode.slice(0, -1);
    feedbackEl.textContent = 'Enter our 6-digit special date...';
    updatePinSlots();
    return;
  }

  if (enteredCode.length < maxDigits) {
    enteredCode += digit;
    updatePinSlots();
  }

  if (enteredCode.length === maxDigits) {
    checkPasscode();
  }
}

function checkPasscode() {
  if (enteredCode === CONFIG.passcode) {
    soundEngine.playSfx('success');
    feedbackEl.className = 'passcode-message success';
    feedbackEl.innerHTML = '✨ CORRECT MY LOVE! ❤️ ✨<br>Unlocking our love story...';
    startBackgroundAudio();

    setTimeout(() => {
      playCurtainTransition(() => {
        navigateTo('screen-hub');
      });
    }, 500);
  } else {
    soundEngine.playSfx('error');
    feedbackEl.className = 'passcode-message error';
    feedbackEl.textContent = '❌ Oops! Wrong code sweetheart... Try again! 💔';

    setTimeout(() => {
      enteredCode = '';
      updatePinSlots();
      feedbackEl.className = 'passcode-message';
      feedbackEl.textContent = 'Please try again, my love...';
    }, 1100);
  }
}

document.querySelectorAll('.num-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-key');
    handleKeyInput(key);
  });
});

window.addEventListener('keydown', (e) => {
  const activeScreen = document.querySelector('.view-screen.active');
  if (activeScreen && activeScreen.id === 'screen-passcode') {
    if (/^[0-9]$/.test(e.key)) {
      handleKeyInput(e.key);
    } else if (e.key === 'Backspace') {
      handleKeyInput('DEL');
    } else if (e.key === 'Escape') {
      handleKeyInput('CLEAR');
    }
  }
});

document.getElementById('nav-btn-letter').addEventListener('click', () => navigateTo('screen-letter'));
document.getElementById('nav-btn-gallery').addEventListener('click', () => navigateTo('screen-gallery'));
document.getElementById('nav-btn-puzzle').addEventListener('click', () => {
  navigateTo('screen-puzzle');
  initPuzzleGame();
});

document.getElementById('envelope-trigger').addEventListener('click', () => {
  soundEngine.playSfx('click');
  const letterPaper = document.getElementById('letter-content-box');
  letterPaper.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const galleryContainer = document.getElementById('gallery-container');
let currentModalIndex = 0;

function createPixelArtPlaceholder(index) {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  const hues = [340, 320, 200, 280, 350, 190, 330, 260, 345, 210];
  const hue = hues[index % hues.length];

  const grad = ctx.createLinearGradient(0, 0, 160, 160);
  grad.addColorStop(0, `hsl(${hue}, 70%, 20%)`);
  grad.addColorStop(1, `hsl(${hue}, 80%, 10%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 160, 160);

  ctx.fillStyle = `hsla(${hue}, 90%, 80%, 0.6)`;
  for (let i = 0; i < 16; i++) {
    const x = (i * 37) % 150 + 5;
    const y = (i * 53) % 150 + 5;
    ctx.fillRect(x, y, 3, 3);
  }

  ctx.fillStyle = '#ff2a85';
  const heartMap = [
    [0,1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0]
  ];
  const scale = 7;
  const startX = (160 - 8 * scale) / 2;
  const startY = (160 - 7 * scale) / 2 - 8;

  for (let r = 0; r < heartMap.length; r++) {
    for (let c = 0; c < heartMap[r].length; c++) {
      if (heartMap[r][c] === 1) {
        ctx.fillRect(startX + c * scale, startY + r * scale, scale, scale);
      }
    }
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.fillText(`PHOTO #${index + 1}`, 80, 138); 

  return canvas.toDataURL('image/png');
}

function renderGallery() {
  galleryContainer.innerHTML = '';
  CONFIG.galleryPhotos.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    const imgSrc = (item.url && item.url.trim() !== '') ? item.url : createPixelArtPlaceholder(idx);

    card.innerHTML = `
      <div class="photo-frame">
        <img src="${imgSrc}" alt="${item.title}" class="photo-img" loading="lazy">
      </div>
      <div class="photo-caption">${item.title}</div>
      <div class="photo-index">MEMORY ${idx + 1}/10</div>
    `;

    const imgEl = card.querySelector('.photo-img');
    let fallbackStep = 0;
    imgEl.onerror = () => {
      fallbackStep++;
      if (fallbackStep === 1 && item.url) {
        if (item.url.includes('.jpg.jpg')) {
          imgEl.src = item.url.replace('.jpg.jpg', '.jpg');
          return;
        } else if (item.url.endsWith('.jpg')) {
          imgEl.src = item.url.replace(/\.jpg$/, '.jpg.jpg');
          return;
        }
      } else if (fallbackStep === 2 && item.url) {
        const fname = item.url.split('/').pop();
        imgEl.src = fname;
        return;
      }
      imgEl.src = createPixelArtPlaceholder(idx);
    };

    card.addEventListener('click', () => openGalleryModal(idx));
    galleryContainer.appendChild(card);
  });
}

const galleryModal = document.getElementById('gallery-modal');
const modalImg = document.getElementById('modal-img-element');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTag = document.getElementById('modal-tag');

function openGalleryModal(index) {
  soundEngine.playSfx('click');
  currentModalIndex = index;
  const data = CONFIG.galleryPhotos[index];
  const imgSrc = (data.url && data.url.trim() !== '') ? data.url : createPixelArtPlaceholder(index);

  modalTag.textContent = `MEMORY #${index + 1} OF 10`;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;

  let modalFallbackStep = 0;
  modalImg.onerror = () => {
    modalFallbackStep++;
    if (modalFallbackStep === 1 && data.url) {
      if (data.url.includes('.jpg.jpg')) {
        modalImg.src = data.url.replace('.jpg.jpg', '.jpg');
        return;
      } else if (data.url.endsWith('.jpg')) {
        modalImg.src = data.url.replace(/\.jpg$/, '.jpg.jpg');
        return;
      }
    } else if (modalFallbackStep === 2 && data.url) {
      const fname = data.url.split('/').pop();
      modalImg.src = fname;
      return;
    }
    modalImg.src = createPixelArtPlaceholder(index);
  };

  modalImg.src = imgSrc;
  galleryModal.classList.add('active');
}

document.getElementById('modal-close-btn').addEventListener('click', () => {
  soundEngine.playSfx('click');
  galleryModal.classList.remove('active');
});

document.getElementById('modal-prev-btn').addEventListener('click', () => {
  currentModalIndex = (currentModalIndex - 1 + CONFIG.galleryPhotos.length) % CONFIG.galleryPhotos.length;
  openGalleryModal(currentModalIndex);
});

document.getElementById('modal-next-btn').addEventListener('click', () => {
  currentModalIndex = (currentModalIndex + 1) % CONFIG.galleryPhotos.length;
  openGalleryModal(currentModalIndex);
});

galleryModal.addEventListener('click', (e) => {
  if (e.target === galleryModal) {
    galleryModal.classList.remove('active');
  }
});

const puzzleBoard = document.getElementById('puzzle-board');
const puzzleCanvasSource = document.getElementById('puzzle-canvas-source');
const puzzlePreviewImg = document.getElementById('puzzle-preview-img');
const puzzleMovesEl = document.getElementById('puzzle-moves-count');
const puzzleTimerEl = document.getElementById('puzzle-timer');
const puzzleSuccessSection = document.getElementById('puzzle-success-section');
const videoDisplayArea = document.getElementById('video-display-area');
const puzzleHelperTip = document.getElementById('puzzle-helper-tip');
let puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let selectedTileIndex = null;
let draggedTileIndex = null;
let puzzleMoves = 0;
let puzzleTimerInterval = null;
let puzzleSeconds = 0;
let isPuzzleSolved = false;
let puzzleImageDataUrl = '';

function renderDefaultAoaArtwork() {
  const canvas = puzzleCanvasSource;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#4a0514');
  grad.addColorStop(0.5, '#850e2b');
  grad.addColorStop(1, '#180a22');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  ctx.strokeStyle = '#ff6584';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  ctx.fillStyle = '#70d6ff';
  const stars = [
    [35, 35], [265, 35], [35, 265], [265, 265],
    [80, 50], [220, 50], [50, 150], [250, 150]
  ];
  stars.forEach(([x, y]) => {
    ctx.fillRect(x - 2, y - 2, 5, 5);
    ctx.fillRect(x - 4, y, 9, 1);
    ctx.fillRect(x, y - 4, 1, 9);
  });

  ctx.fillStyle = '#ffe4e9';
  ctx.font = "bold 13px 'Silkscreen', 'Press Start 2P', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('FOREVER & ALWAYS', w / 2, 55);

  ctx.font = "900 68px 'Press Start 2P', 'Impact', monospace";
  ctx.fillStyle = '#0e0712';
  ctx.fillText('AOA', w / 2 + 5, 145 + 5);

  ctx.fillStyle = '#d90429';
  ctx.fillText('AOA', w / 2 + 2, 145 + 2);

  const textGrad = ctx.createLinearGradient(0, 80, 0, 150);
  textGrad.addColorStop(0, '#ffffff');
  textGrad.addColorStop(0.5, '#ffd166');
  textGrad.addColorStop(1, '#ff6584');
  ctx.fillStyle = textGrad;
  ctx.fillText('AOA', w / 2, 145);

  ctx.fillStyle = '#ff2a85';
  ctx.font = '30px sans-serif';
  ctx.fillText('❤️ ✨ 💖', w / 2, 195);

  ctx.fillStyle = '#4cc9f0';
  ctx.font = "bold 13px 'Silkscreen', monospace";
  ctx.fillText('07 • 07 • 2010', w / 2, 235);

  ctx.fillStyle = '#ffd166';
  ctx.font = "11px 'Silkscreen', monospace";
  ctx.fillText('HAPPY ANNIVERSARY', w / 2, 255);

  puzzleImageDataUrl = canvas.toDataURL('image/png');
  puzzlePreviewImg.src = puzzleImageDataUrl;
}

function generateAoaArtwork() {
  if (CONFIG.puzzleImageUrl && CONFIG.puzzleImageUrl.trim() !== '') {
    const rawUrl = CONFIG.puzzleImageUrl.trim();
    puzzleImageDataUrl = rawUrl;
    puzzlePreviewImg.src = rawUrl;

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = puzzleCanvasSource;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "900 32px 'Press Start 2P', monospace";
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText('AOA', canvas.width / 2 + 2, canvas.height / 2 + 2);
        ctx.fillStyle = '#ffd166';
        ctx.fillText('AOA', canvas.width / 2, canvas.height / 2);

        puzzleImageDataUrl = canvas.toDataURL('image/png');
        puzzlePreviewImg.src = puzzleImageDataUrl;
      } catch (e) {
        console.log('Canvas export skipped; using image directly:', e);
        puzzleImageDataUrl = rawUrl;
        puzzlePreviewImg.src = rawUrl;
      }
      renderPuzzleBoard();
    };

    img.onerror = () => {
      console.warn('Custom puzzle image error, trying variations.');
      if (img.src.includes('.jpg.jpg')) {
        img.src = img.src.replace('.jpg.jpg', '.jpg');
      } else if (img.src.endsWith('.jpg')) {
        img.src = img.src.replace(/\.jpg$/, '.jpg.jpg');
      } else {
        puzzleImageDataUrl = rawUrl;
        puzzlePreviewImg.src = rawUrl;
        renderPuzzleBoard();
      }
    };

    img.src = rawUrl;
    return;
  }

  renderDefaultAoaArtwork();
}

function initPuzzleGame() {
  if (!puzzleImageDataUrl) {
    generateAoaArtwork();
  }

  selectedTileIndex = null;
  draggedTileIndex = null;
  puzzleMoves = 0;
  isPuzzleSolved = false;
  puzzleMovesEl.textContent = '0';
  puzzleSuccessSection.classList.remove('revealed');

  if (puzzleTimerInterval) clearInterval(puzzleTimerInterval);
  puzzleSeconds = 0;
  puzzleTimerEl.textContent = '00:00';
  puzzleTimerInterval = setInterval(() => {
    if (!isPuzzleSolved) {
      puzzleSeconds++;
      const m = String(Math.floor(puzzleSeconds / 60)).padStart(2, '0');
      const s = String(puzzleSeconds % 60).padStart(2, '0');
      puzzleTimerEl.textContent = `${m}:${s}`;
    }
  }, 1000);

  shufflePuzzle();
  renderPuzzleBoard();
}

function shufflePuzzle() {
  puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  selectedTileIndex = null;
  draggedTileIndex = null;

  for (let i = puzzleTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [puzzleTiles[i], puzzleTiles[j]] = [puzzleTiles[j], puzzleTiles[i]];
  }

  if (puzzleTiles.every((val, idx) => val === idx)) {
    [puzzleTiles[0], puzzleTiles[1]] = [puzzleTiles[1], puzzleTiles[0]];
  }

  puzzleMoves = 0;
  puzzleMovesEl.textContent = '0';
  updateHelperTip('💡 Sentuh/klik kepingan untuk angkat 🖐️, kemudian klik tempat baru untuk letak (atau drag & drop terus)!');
}

function updateHelperTip(text) {
  if (puzzleHelperTip) {
    puzzleHelperTip.textContent = text;
  }
}

function swapTiles(fromPos, toPos) {
  if (fromPos === toPos) return;
  soundEngine.playSfx('click');

  const temp = puzzleTiles[fromPos];
  puzzleTiles[fromPos] = puzzleTiles[toPos];
  puzzleTiles[toPos] = temp;

  puzzleMoves++;
  puzzleMovesEl.textContent = puzzleMoves;
  selectedTileIndex = null;
  draggedTileIndex = null;
  renderPuzzleBoard();
  updateHelperTip('💡 Sentuh/klik kepingan untuk angkat 🖐️, kemudian klik tempat baru untuk letak!');
  checkPuzzleWin();
}

function onTileTap(pos) {
  if (isPuzzleSolved) return;

  if (selectedTileIndex === null) {
    selectedTileIndex = pos;
    soundEngine.playSfx('click');
    renderPuzzleBoard();
    updateHelperTip(`🖐️ Kepingan #${puzzleTiles[pos] + 1} diangkat! Klik mana-mana kepingan sasaran untuk letak/tukar tempat.`);
  } else if (selectedTileIndex === pos) {
    selectedTileIndex = null;
    soundEngine.playSfx('click');
    renderPuzzleBoard();
    updateHelperTip('💡 Sentuh/klik kepingan untuk angkat 🖐️, kemudian klik tempat baru untuk letak!');
  } else {
    const from = selectedTileIndex;
    swapTiles(from, pos);
  }
}

function renderPuzzleBoard() {
  puzzleBoard.innerHTML = '';

  for (let pos = 0; pos < 9; pos++) {
    const tileVal = puzzleTiles[pos];
    const tileDiv = document.createElement('div');
    tileDiv.className = 'puzzle-tile';
    tileDiv.dataset.pos = pos;
    tileDiv.draggable = !isPuzzleSolved;

    if (selectedTileIndex === pos) {
      tileDiv.classList.add('tile-selected');
    }

    if (tileVal === pos) {
      tileDiv.classList.add('tile-correct');
    }

    tileDiv.style.backgroundImage = `url(${puzzleImageDataUrl})`;
    const origRow = Math.floor(tileVal / 3);
    const origCol = tileVal % 3;
    const posX = origCol * 50;
    const posY = origRow * 50;
    tileDiv.style.backgroundPosition = `${posX}% ${posY}%`;

    if (selectedTileIndex === pos) {
      tileDiv.innerHTML = '<span class="puzzle-tile-num tile-lifted-badge">🖐️ ANGKAT</span>';
    } else {
      tileDiv.innerHTML = `<span class="puzzle-tile-num">${tileVal + 1}</span>`;
    }

    tileDiv.addEventListener('click', () => {
      onTileTap(pos);
    });

    tileDiv.addEventListener('dragstart', (e) => {
      if (isPuzzleSolved) return;
      draggedTileIndex = pos;
      tileDiv.classList.add('tile-dragging');
      e.dataTransfer.setData('text/plain', pos);
      e.dataTransfer.effectAllowed = 'move';
    });

    tileDiv.addEventListener('dragover', (e) => {
      if (isPuzzleSolved) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      tileDiv.classList.add('tile-drag-over');
    });

    tileDiv.addEventListener('dragleave', () => {
      tileDiv.classList.remove('tile-drag-over');
    });

    tileDiv.addEventListener('drop', (e) => {
      if (isPuzzleSolved) return;
      e.preventDefault();
      tileDiv.classList.remove('tile-drag-over');
      if (draggedTileIndex !== null && draggedTileIndex !== pos) {
        swapTiles(draggedTileIndex, pos);
      }
      draggedTileIndex = null;
    });

    tileDiv.addEventListener('dragend', () => {
      tileDiv.classList.remove('tile-dragging');
      document.querySelectorAll('.puzzle-tile').forEach(t => t.classList.remove('tile-drag-over'));
      draggedTileIndex = null;
    });

    tileDiv.addEventListener('touchstart', () => {
      if (isPuzzleSolved) return;
      draggedTileIndex = pos;
    }, { passive: true });

    tileDiv.addEventListener('touchend', (e) => {
      if (isPuzzleSolved || draggedTileIndex === null) return;
      const touch = e.changedTouches[0];
      const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetTile = targetEl ? targetEl.closest('.puzzle-tile') : null;
      if (targetTile && targetTile.dataset.pos !== undefined) {
        const targetPos = parseInt(targetTile.dataset.pos, 10);
        if (targetPos !== draggedTileIndex) {
          swapTiles(draggedTileIndex, targetPos);
          e.preventDefault();
        }
      }
      draggedTileIndex = null;
    });

    puzzleBoard.appendChild(tileDiv);
  }
}

function checkPuzzleWin() {
  const isWin = puzzleTiles.every((val, index) => val === index);
  if (isWin) {
    handlePuzzleSolved();
  }
}

function handlePuzzleSolved() {
  isPuzzleSolved = true;
  selectedTileIndex = null;
  draggedTileIndex = null;
  if (puzzleTimerInterval) clearInterval(puzzleTimerInterval);
  soundEngine.playSfx('success');

  renderPuzzleBoard();
  createConfettiHearts();
  puzzleSuccessSection.classList.add('revealed');
  loadVideoGreeting();
  updateHelperTip('🎉 TAHNIAH SAYANG! Puzzle berjaya diselesaikan dengan sempurna! ❤️');

  setTimeout(() => {
    puzzleSuccessSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 250);
}

document.getElementById('puzzle-shuffle-btn').addEventListener('click', () => {
  soundEngine.playSfx('click');
  initPuzzleGame();
});

document.getElementById('puzzle-solve-btn').addEventListener('click', () => {
  soundEngine.playSfx('click');
  puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  selectedTileIndex = null;
  draggedTileIndex = null;
  handlePuzzleSolved();
});

function loadVideoGreeting() {
  videoDisplayArea.innerHTML = '';

  if (CONFIG.videoUrl && CONFIG.videoUrl.trim() !== '') {
    const url = CONFIG.videoUrl.trim();
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let embedUrl = url;
      if (url.includes('watch?v=')) {
        embedUrl = url.replace('watch?v=', 'embed/');
      } else if (url.includes('youtu.be/')) {
        embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/');
      }
      stopBackgroundAudio();
      videoDisplayArea.innerHTML = `
        <iframe src="${embedUrl}?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      `;
    } else {
      const vid = document.createElement('video');
      vid.controls = true;
      vid.autoplay = true;
      vid.playsInline = true;
      vid.style.width = '100%';
      vid.style.height = '100%';
      vid.style.borderRadius = '4px';

      const src = document.createElement('source');
      src.src = url;
      src.type = 'video/mp4';
      vid.appendChild(src);

      vid.addEventListener('play', () => stopBackgroundAudio());
      vid.addEventListener('ended', () => {
        launchFireworks();
        setTimeout(() => startBackgroundAudio(), 3500);
      });

      videoDisplayArea.appendChild(vid);
    }
  } else {
    videoDisplayArea.innerHTML = `
      <div class="video-custom-placeholder">
        <div style="font-size: 38px; margin-bottom: 8px; animation: heartBeat 1.5s infinite;">🎥 💖 🎬</div>
        <h3 style="font-family: var(--font-pixel); font-size: 13px; color: var(--gold-accent); margin-bottom: 6px;">
          [ ANNIVERSARY VIDEO GREETING ]
        </h3>
        <p style="font-family: var(--font-vt); font-size: 19px; color: var(--pink-soft); max-width: 440px; text-align: center;">
          You can easily link your video in the CONFIG.videoUrl section of this file.
        </p>
        <div style="margin-top: 10px; font-family: var(--font-silk); font-size: 9px; background: rgba(0,0,0,0.6); padding: 6px 12px; border: 1px dashed var(--blue-retro); color: var(--blue-soft);">
          💡 Paste your YouTube link or personal MP4 video file anytime!
        </div>
      </div>
    `;
  }
}

function stopBackgroundAudio() {
  isMusicActive = false;
  musicToggleBtn.classList.remove('playing');
  musicIcon.textContent = '🎵';
  musicLabel.textContent = 'MUSIC: OFF';
  customAudioElement.pause();
  soundEngine.stopMusic();
}

const particlesContainer = document.getElementById('particles-container');
const heartSymbols = ['❤️', '💖', '💕', '✨', '🌸', '🌹'];

function spawnHeartParticle() {
  const p = document.createElement('div');
  p.className = 'pixel-particle';
  p.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  p.style.left = Math.random() * 96 + 'vw';
  p.style.animationDuration = (Math.random() * 4 + 5) + 's';
  p.style.fontSize = (Math.random() * 10 + 13) + 'px';

  particlesContainer.appendChild(p);

  setTimeout(() => {
    if (p.parentNode) p.parentNode.removeChild(p);
  }, 9500);
}

setInterval(spawnHeartParticle, 900);

function createConfettiHearts() {
  for (let i = 0; i < 35; i++) {
    setTimeout(spawnHeartParticle, i * 35);
  }
}

function launchFireworks() {
  const canvas = document.createElement('canvas');
  canvas.id = 'fireworks-canvas';
  canvas.style.cssText = [
    'position:fixed', 'inset:0', 'width:100vw', 'height:100vh',
    'z-index:9998', 'pointer-events:none'
  ].join(';');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = [];
  const COLORS = ['#ff2a85', '#ffd166', '#4cc9f0', '#ff6584', '#c77dff', '#ffffff', '#70d6ff', '#ffb7c5'];

  function burst(x, y) {
    const count = 90 + Math.floor(Math.random() * 60);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 2 + Math.random() * 6;
      const size = 2 + Math.random() * 3;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.012,
        size,
        color,
        trail: [],
        isHeart: Math.random() < 0.2
      });
    }
  }

  const positions = [
    [0.2, 0.3], [0.5, 0.15], [0.8, 0.3],
    [0.3, 0.55], [0.7, 0.55], [0.5, 0.7],
    [0.15, 0.7], [0.85, 0.2], [0.5, 0.4]
  ];
  positions.forEach(([px, py], i) => {
    setTimeout(() => {
      burst(canvas.width * px + (Math.random() - 0.5) * 80, canvas.height * py + (Math.random() - 0.5) * 60);
    }, i * 300);
  });

  const emojiSymbols = ['🎆', '🎇', '✨', '💖', '🌟', '🎉', '💕', '🌸'];
  for (let e = 0; e < 40; e++) {
    setTimeout(() => {
      const em = document.createElement('div');
      em.textContent = emojiSymbols[Math.floor(Math.random() * emojiSymbols.length)];
      em.style.cssText = [
        'position:fixed',
        `left:${Math.random() * 95}vw`,
        `top:${Math.random() * 80}vh`,
        'font-size:' + (20 + Math.random() * 28) + 'px',
        'z-index:9999',
        'pointer-events:none',
        'animation:floatUp 3s ease-out forwards',
        'opacity:1'
      ].join(';');
      document.body.appendChild(em);
      setTimeout(() => em.remove(), 3200);
    }, e * 80);
  }

  let startTime = null;
  const DURATION = 3500;

  function draw(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 8) p.trail.shift();

      for (let t = 0; t < p.trail.length; t++) {
        ctx.beginPath();
        ctx.arc(p.trail[t].x, p.trail[t].y, p.size * (t / p.trail.length) * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 120).toString(16).padStart(2, '0');
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();

      if (Math.random() < 0.04) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fill();
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.09;
      p.vx *= 0.98;
      p.alpha -= p.decay;

      if (p.alpha <= 0) particles.splice(i, 1);
    }

    if (elapsed < DURATION || particles.length > 0) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(draw);

  setTimeout(() => {
    if (canvas.parentNode) canvas.remove();
  }, DURATION + 2000);
}

window.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  generateAoaArtwork();
  document.getElementById('badge-couple-text').textContent = `${CONFIG.coupleNames} • ANNIVERSARY OF LOVE`;
  document.getElementById('hub-main-title').textContent = `${CONFIG.anniversaryTitle} ❤️`;
  console.log('Pixel Romantic Anniversary Website Ready! Passcode: ' + CONFIG.passcode);
});
