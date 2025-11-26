export class Time {
  constructor() {
    this.lastTime = 0;
    this.deltaTime = 0;
    this.elapsed = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.fpsUpdateInterval = 1000;
    this.lastFpsUpdate = 0;
  }

  update(currentTime) {
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    this.elapsed += this.deltaTime;

    // Calculate FPS
    this.frameCount++;
    if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }
  }

  getDeltaTime() {
    return this.deltaTime;
  }

  getElapsed() {
    return this.elapsed;
  }

  getFPS() {
    return this.fps;
  }
}
