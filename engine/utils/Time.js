export class Time {
  constructor() {
    this.lastTime = 0;
    this.deltaTime = 0;
    this.elapsed = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.fpsUpdateInterval = 1000;
    this.lastFpsUpdate = 0;
    this.timeScale = 1.0;
    this.maxDeltaTime = 0.1; // Cap delta to prevent spiral of death
  }

  update(currentTime) {
    const rawDelta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    // Cap delta time and apply time scale
    this.deltaTime = Math.min(rawDelta, this.maxDeltaTime) * this.timeScale;
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

  setTimeScale(scale) {
    this.timeScale = Math.max(0, scale);
  }

  pause() {
    this.timeScale = 0;
  }

  resume() {
    this.timeScale = 1.0;
  }

  reset() {
    this.elapsed = 0;
    this.frameCount = 0;
  }
}
