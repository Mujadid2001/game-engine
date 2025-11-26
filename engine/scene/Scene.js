export class Scene {
  constructor(name) {
    this.name = name;
    this.world = null;
  }

  init(world) {
    this.world = world;
    this.onCreate();
  }

  onCreate() {
    // Override in derived scenes
  }

  onDestroy() {
    // Override in derived scenes
  }

  update(deltaTime) {
    // Override for scene-specific logic
  }
}
