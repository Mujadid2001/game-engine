export class Camera {
  constructor(x = 0, y = 0, width = 800, height = 600) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.zoom = 1;
    this.rotation = 0;
    this.target = null; // Entity to follow
    this.followSpeed = 5;
    this.deadzone = { x: 50, y: 50 };
    this.bounds = null; // { minX, minY, maxX, maxY }
    this.shake = { x: 0, y: 0, intensity: 0, duration: 0 };
  }

  follow(entity, speed = 5) {
    this.target = entity;
    this.followSpeed = speed;
  }

  screenToWorld(screenX, screenY) {
    return {
      x: (screenX - this.width / 2) / this.zoom + this.x,
      y: (screenY - this.height / 2) / this.zoom + this.y
    };
  }

  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.x) * this.zoom + this.width / 2,
      y: (worldY - this.y) * this.zoom + this.height / 2
    };
  }

  shakeCam(intensity, duration) {
    this.shake.intensity = intensity;
    this.shake.duration = duration;
  }
}
