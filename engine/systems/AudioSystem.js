import { System } from '../core/System.js';
import { AudioSource } from '../components/AudioSource.js';
import { Position } from '../components/Position.js';

export class AudioSystem extends System {
  constructor() {
    super();
    this.sounds = new Map();
    this.musicTrack = null;
    this.musicVolume = 1.0;
    this.sfxVolume = 1.0;
    this.masterVolume = 1.0;
    this.listenerPosition = { x: 0, y: 0 };
  }

  init() {
    // Initialize audio context if needed
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  loadSound(name, url) {
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.sounds.set(name, audio);
    return audio;
  }

  playSound(name, volume = 1.0, loop = false) {
    const sound = this.sounds.get(name);
    if (sound) {
      const clone = sound.cloneNode();
      clone.volume = volume * this.sfxVolume * this.masterVolume;
      clone.loop = loop;
      clone.play();
      return clone;
    }
  }

  playMusic(name, volume = 1.0) {
    this.stopMusic();
    const music = this.sounds.get(name);
    if (music) {
      this.musicTrack = music.cloneNode();
      this.musicTrack.volume = volume * this.musicVolume * this.masterVolume;
      this.musicTrack.loop = true;
      this.musicTrack.play();
    }
  }

  stopMusic() {
    if (this.musicTrack) {
      this.musicTrack.pause();
      this.musicTrack.currentTime = 0;
      this.musicTrack = null;
    }
  }

  update(deltaTime) {
    if (!this.enabled) return;

    const entities = this.queryEntities(AudioSource, Position);

    for (const entity of entities) {
      const audioSource = this.getComponent(entity, AudioSource);
      const position = this.getComponent(entity, Position);

      if (audioSource.playOnStart && !audioSource.isPlaying && audioSource.soundName) {
        const audio = this.playSound(audioSource.soundName, audioSource.volume, audioSource.loop);
        audioSource.audioElement = audio;
        audioSource.isPlaying = true;
      }

      // Spatial audio
      if (audioSource.spatial && audioSource.audioElement) {
        const distance = Math.hypot(
          position.x - this.listenerPosition.x,
          position.y - this.listenerPosition.y
        );
        
        const volume = Math.max(0, 1 - (distance / audioSource.maxDistance));
        audioSource.audioElement.volume = volume * audioSource.volume * this.sfxVolume * this.masterVolume;
      }
    }
  }

  setListenerPosition(x, y) {
    this.listenerPosition.x = x;
    this.listenerPosition.y = y;
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.musicTrack) {
      this.musicTrack.volume = this.musicVolume * this.masterVolume;
    }
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicTrack) {
      this.musicTrack.volume = this.musicVolume * this.masterVolume;
    }
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}
