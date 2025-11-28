export class Animation {
  constructor(frames = [], frameRate = 10) {
    this.frames = frames; // Array of frame indices or sprite sources
    this.frameRate = frameRate;
    this.frameDuration = 1 / frameRate;
    this.currentFrame = 0;
    this.elapsed = 0;
    this.isPlaying = true;
    this.loop = true;
    this.onComplete = null;
    this.animations = new Map(); // Named animations
    this.currentAnimation = null;
  }

  addAnimation(name, frames, frameRate = this.frameRate) {
    this.animations.set(name, { frames, frameRate, frameDuration: 1 / frameRate });
  }

  play(name, loop = true) {
    const anim = this.animations.get(name);
    if (anim) {
      this.currentAnimation = name;
      this.frames = anim.frames;
      this.frameRate = anim.frameRate;
      this.frameDuration = anim.frameDuration;
      this.loop = loop;
      this.currentFrame = 0;
      this.elapsed = 0;
      this.isPlaying = true;
    }
  }

  stop() {
    this.isPlaying = false;
  }

  reset() {
    this.currentFrame = 0;
    this.elapsed = 0;
  }
}
