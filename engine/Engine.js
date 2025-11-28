import { World } from './core/World.js';
import { EntityManager } from './core/EntityManager.js';
import { ComponentManager } from './core/ComponentManager.js';
import { Time } from './utils/Time.js';
import { AssetLoader } from './utils/AssetLoader.js';
import { SceneManager } from './scene/SceneManager.js';
import { CanvasRenderer } from './renderer/CanvasRenderer.js';

export class Engine {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' 
      ? document.getElementById(canvasId) 
      : canvasId;

    if (!this.canvas) {
      throw new Error('Canvas element not found');
    }

    this.options = {
      width: options.width || 800,
      height: options.height || 600,
      backgroundColor: options.backgroundColor || '#1a1a2e',
      showFPS: options.showFPS || false,
      pixelPerfect: options.pixelPerfect || false,
      ...options
    };

    // Set canvas size
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;

    // Core systems
    this.world = new World();
    this.entityManager = new EntityManager();
    this.componentManager = new ComponentManager();
    this.time = new Time();
    this.assetLoader = new AssetLoader();
    this.sceneManager = new SceneManager(this);
    this.renderer = new CanvasRenderer(this.canvas);

    // Initialize world
    this.world.init(this.entityManager, this.componentManager);

    // State
    this.isRunning = false;
    this.isPaused = false;
    this.animationFrameId = null;

    // Pixel perfect rendering
    if (this.options.pixelPerfect) {
      this.renderer.ctx.imageSmoothingEnabled = false;
      this.canvas.style.imageRendering = 'pixelated';
    }
  }

  async init(assetManifest = null) {
    console.log('🎮 Engine initializing...');
    
    // Load assets if provided
    if (assetManifest) {
      const success = await this.assetLoader.loadAssets(assetManifest);
      if (!success) {
        console.warn('Some assets failed to load:', this.assetLoader.getErrors());
      }
    }

    console.log('✅ Engine ready!');
    return this;
  }

  registerComponent(componentClass) {
    this.componentManager.registerComponent(componentClass);
  }

  addSystem(system) {
    this.world.addSystem(system);
  }

  getSystem(systemClass) {
    return this.world.getSystem(systemClass);
  }

  start() {
    if (this.isRunning) return;
    
    console.log('▶️  Engine started');
    this.isRunning = true;
    this.isPaused = false;
    this.time.lastTime = performance.now();
    this.gameLoop(this.time.lastTime);
  }

  stop() {
    if (!this.isRunning) return;

    console.log('⏹️  Engine stopped');
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  pause() {
    this.isPaused = true;
    this.time.pause();
    console.log('⏸️  Engine paused');
  }

  resume() {
    this.isPaused = false;
    this.time.resume();
    console.log('▶️  Engine resumed');
  }

  gameLoop = (currentTime) => {
    if (!this.isRunning) return;

    // Update time
    this.time.update(currentTime);

    if (!this.isPaused) {
      const deltaTime = this.time.getDeltaTime();

      // Update scene
      this.sceneManager.update(deltaTime);

      // Update world systems
      this.world.update(deltaTime);
    }

    // Render (always render even when paused)
    this.renderer.clear(this.options.backgroundColor);
    this.world.render();
    this.sceneManager.render();

    // Show FPS if enabled
    if (this.options.showFPS) {
      this.drawFPS();
    }

    // Next frame
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  drawFPS() {
    this.renderer.ctx.save();
    this.renderer.ctx.fillStyle = '#00ff00';
    this.renderer.ctx.font = 'bold 16px monospace';
    this.renderer.ctx.textAlign = 'left';
    this.renderer.ctx.textBaseline = 'top';
    this.renderer.ctx.fillText(`FPS: ${this.time.getFPS()}`, 10, 10);
    this.renderer.ctx.restore();
  }

  loadScene(sceneName) {
    this.sceneManager.loadScene(sceneName);
  }

  createEntity() {
    return this.world.createEntity();
  }

  destroyEntity(entity) {
    this.world.destroyEntity(entity);
  }

  addComponent(entity, component) {
    this.world.addComponent(entity, component);
  }

  getComponent(entity, componentClass) {
    return this.world.getComponent(entity, componentClass);
  }

  // Convenience methods
  setTimeScale(scale) {
    this.time.setTimeScale(scale);
  }

  getWidth() {
    return this.canvas.width;
  }

  getHeight() {
    return this.canvas.height;
  }

  getCanvas() {
    return this.canvas;
  }
}
