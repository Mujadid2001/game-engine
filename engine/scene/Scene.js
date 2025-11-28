export class Scene {
  constructor(name) {
    this.name = name;
    this.engine = null;
    this.world = null;
    this.entities = [];
  }

  init(engine) {
    this.engine = engine;
    this.world = engine.world;
    this.onCreate();
  }

  onCreate() {
    // Override in derived scenes
  }

  onDestroy() {
    // Clean up entities
    for (const entity of this.entities) {
      this.world.destroyEntity(entity);
    }
    this.entities = [];
  }

  update(deltaTime) {
    // Override for scene-specific logic
  }

  render() {
    // Override for scene-specific rendering
  }

  // Helper methods
  createEntity() {
    const entity = this.world.createEntity();
    this.entities.push(entity);
    return entity;
  }

  addComponent(entity, component) {
    this.world.addComponent(entity, component);
  }

  getComponent(entity, componentClass) {
    return this.world.getComponent(entity, componentClass);
  }
}
