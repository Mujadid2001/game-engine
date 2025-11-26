export class Animation {
  constructor(frames = [], frameRate = 10) {
    this.frames = frames;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.elapsed = 0;
    this.isPlaying = true;
    this.loop = true;
  }
}
