import { System } from '../core/System.js';

export class AudioSystem extends System {
  constructor() {
    super();
    this.sounds = new Map();
    this.music = null;
  }

  loadSound(name, src) {
    const audio = new Audio(src);
    this.sounds.set(name, audio);
  }

  playSound(name, volume = 1.0) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.volume = volume;
      sound.currentTime = 0;
      sound.play();
    }
  }

  playMusic(src, volume = 0.5, loop = true) {
    if (this.music) {
      this.music.pause();
    }
    this.music = new Audio(src);
    this.music.volume = volume;
    this.music.loop = loop;
    this.music.play();
  }

  stopMusic() {
    if (this.music) {
      this.music.pause();
      this.music = null;
    }
  }

  update(deltaTime) {
    // Audio updates if needed
  }
}
