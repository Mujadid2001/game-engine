/**
 * Asset Management System
 * Handles loading and caching of all game assets (images, sounds, fonts)
 */

export class AssetManager {
  constructor() {
    this.images = new Map();
    this.sounds = new Map();
    this.fonts = new Map();
    this.loadingQueue = [];
    this.loadedCount = 0;
    this.totalCount = 0;
    this.onProgressCallback = null;
  }

  /**
   * Load an image asset
   */
  loadImage(name, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(name, img);
        this.loadedCount++;
        this.updateProgress();
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  /**
   * Load a sound asset
   */
  loadSound(name, src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.sounds.set(name, audio);
        this.loadedCount++;
        this.updateProgress();
        resolve(audio);
      };
      audio.onerror = () => reject(new Error(`Failed to load sound: ${src}`));
      audio.src = src;
      audio.load();
    });
  }

  /**
   * Load multiple assets at once
   */
  async loadAssets(assetManifest) {
    this.loadedCount = 0;
    this.totalCount = 0;
    const promises = [];

    // Count total assets
    if (assetManifest.images) this.totalCount += Object.keys(assetManifest.images).length;
    if (assetManifest.sounds) this.totalCount += Object.keys(assetManifest.sounds).length;

    // Load images
    if (assetManifest.images) {
      for (const [name, src] of Object.entries(assetManifest.images)) {
        promises.push(this.loadImage(name, src));
      }
    }

    // Load sounds
    if (assetManifest.sounds) {
      for (const [name, src] of Object.entries(assetManifest.sounds)) {
        promises.push(this.loadSound(name, src));
      }
    }

    await Promise.all(promises);
    return this;
  }

  updateProgress() {
    if (this.onProgressCallback && this.totalCount > 0) {
      const progress = this.loadedCount / this.totalCount;
      this.onProgressCallback(progress, this.loadedCount, this.totalCount);
    }
  }

  onProgress(callback) {
    this.onProgressCallback = callback;
  }

  getImage(name) {
    return this.images.get(name);
  }

  getSound(name) {
    return this.sounds.get(name);
  }

  hasImage(name) {
    return this.images.has(name);
  }

  hasSound(name) {
    return this.sounds.has(name);
  }
}

/**
 * Asset manifest - Define all game assets here
 */
export const GAME_ASSETS = {
  images: {
    // SVG-based placeholder sprites (can be replaced with actual images)
    player: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" fill="#00ff00" rx="4"/>
        <circle cx="10" cy="10" r="3" fill="#fff"/>
        <circle cx="22" cy="10" r="3" fill="#fff"/>
        <rect x="8" y="22" width="16" height="2" fill="#fff" rx="1"/>
      </svg>
    `),
    
    enemy: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" fill="#ff0000" rx="4"/>
        <circle cx="10" cy="12" r="3" fill="#000"/>
        <circle cx="22" cy="12" r="3" fill="#000"/>
        <path d="M 8 22 Q 16 18 24 22" stroke="#000" stroke-width="2" fill="none"/>
      </svg>
    `),
    
    star: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <polygon points="16,2 20,12 31,12 22,19 25,30 16,23 7,30 10,19 1,12 12,12" 
                 fill="#ffff00" stroke="#ffaa00" stroke-width="2"/>
      </svg>
    `),
    
    bullet: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="8" height="8" xmlns="http://www.w3.org/2000/svg">
        <circle cx="4" cy="4" r="4" fill="#00ffff"/>
        <circle cx="4" cy="4" r="2" fill="#ffffff"/>
      </svg>
    `),
    
    platform: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="100" height="20" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="20" fill="#8B4513" rx="2"/>
        <rect width="100" height="4" fill="#654321"/>
      </svg>
    `),
    
    particle: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="4" height="4" xmlns="http://www.w3.org/2000/svg">
        <circle cx="2" cy="2" r="2" fill="#ffffff"/>
      </svg>
    `),

    tileset: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
        <!-- 8x8 grid of 32x32 tiles -->
        <rect x="0" y="0" width="32" height="32" fill="#8B4513"/>
        <rect x="32" y="0" width="32" height="32" fill="#228B22"/>
        <rect x="64" y="0" width="32" height="32" fill="#4169E1"/>
        <rect x="96" y="0" width="32" height="32" fill="#FFD700"/>
        <rect x="128" y="0" width="32" height="32" fill="#DC143C"/>
      </svg>
    `)
  },
  
  sounds: {
    // Web Audio API procedural sounds (no files needed)
    jump: null,    // Generated procedurally
    shoot: null,   // Generated procedurally
    collect: null, // Generated procedurally
    hit: null,     // Generated procedurally
    gameOver: null // Generated procedurally
  }
};

/**
 * Procedural Sound Generator
 * Creates sounds using Web Audio API without external files
 */
export class SoundGenerator {
  constructor() {
    this.audioContext = null;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  playJump() {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  playShoot() {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.type = 'square';
    
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  playCollect() {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.type = 'sine';
    
    osc.frequency.setValueAtTime(523, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(784, this.audioContext.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  playHit() {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.type = 'sawtooth';
    
    osc.frequency.setValueAtTime(100, this.audioContext.currentTime);
    gain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  playGameOver() {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.type = 'triangle';
    
    osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.audioContext.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.5);
  }
}

// Export singleton instance
export const assetManager = new AssetManager();
export const soundGenerator = new SoundGenerator();
