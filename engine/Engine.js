import { World } from './core/World.js';
import { EntityManager } from './core/EntityManager.js';
import { ComponentManager } from './core/ComponentManager.js';
import { Time } from './utils/Time.js';
import { SceneManager } from './scene/SceneManager.js';
import { CanvasRenderer } from './renderer/CanvasRenderer.js';

export class Engine {
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.config = config;
    
    // Core ECS
    this.world = new World();
    this.entityManager = new EntityManager();
    this.componentManager = new ComponentManager();
    
    // Utilities
    this.time = new Time();
    this.sceneManager = new SceneManager();
    this.renderer = new CanvasRenderer(canvas);
    
    // State
    this.isRunning = false;
    this.animationFrameId = null;

    // Initialize
    this.world.init(this.entityManager, this.componentManager);
  }

  start() {
    this.isRunning = true;
    this.time.lastTime = performance.now();
    this.gameLoop(performance.now());
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  gameLoop(currentTime) {
    if (!this.isRunning) return;

    this.time.update(currentTime);
    const deltaTime = this.time.getDeltaTime();

    // Update scene
    this.sceneManager.update(deltaTime);

    // Update world systems
    this.world.update(deltaTime);

    // Request next frame
    this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  addSystem(system) {
    this.world.addSystem(system);
  }

  registerComponent(componentClass) {
    this.componentManager.registerComponent(componentClass);
  }
}
