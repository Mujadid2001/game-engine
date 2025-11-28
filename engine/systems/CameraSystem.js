import { System } from '../core/System.js';
import { Camera } from '../components/Camera.js';
import { Position } from '../components/Position.js';

export class CameraSystem extends System {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.mainCamera = null;
  }

  init() {
    // Find or create main camera
    const cameraEntities = this.queryEntities(Camera);
    if (cameraEntities.length > 0) {
      this.mainCamera = this.getComponent(cameraEntities[0], Camera);
    }
  }

  update(deltaTime) {
    if (!this.enabled || !this.mainCamera) return;

    const camera = this.mainCamera;

    // Follow target
    if (camera.target !== null) {
      const targetPos = this.getComponent(camera.target, Position);
      if (targetPos) {
        const targetX = targetPos.x;
        const targetY = targetPos.y;

        // Smooth following with deadzone
        const dx = targetX - camera.x;
        const dy = targetY - camera.y;

        if (Math.abs(dx) > camera.deadzone.x) {
          camera.x += dx * camera.followSpeed * deltaTime;
        }
        if (Math.abs(dy) > camera.deadzone.y) {
          camera.y += dy * camera.followSpeed * deltaTime;
        }
      }
    }

    // Apply camera bounds
    if (camera.bounds) {
      const halfWidth = camera.width / 2 / camera.zoom;
      const halfHeight = camera.height / 2 / camera.zoom;

      camera.x = Math.max(camera.bounds.minX + halfWidth, 
                          Math.min(camera.bounds.maxX - halfWidth, camera.x));
      camera.y = Math.max(camera.bounds.minY + halfHeight, 
                          Math.min(camera.bounds.maxY - halfHeight, camera.y));
    }

    // Camera shake
    if (camera.shake.duration > 0) {
      camera.shake.duration -= deltaTime;
      camera.shake.x = (Math.random() - 0.5) * camera.shake.intensity;
      camera.shake.y = (Math.random() - 0.5) * camera.shake.intensity;
    } else {
      camera.shake.x = 0;
      camera.shake.y = 0;
    }
  }

  getMainCamera() {
    return this.mainCamera;
  }

  setMainCamera(cameraComponent) {
    this.mainCamera = cameraComponent;
  }
}
