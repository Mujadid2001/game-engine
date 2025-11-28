export class System {
  constructor() {
    this.world = null;
    this.enabled = true;
    this.priority = 0;
  }

  init() {
    // Override for initialization
  }

  update(deltaTime) {
    // Override in derived systems
  }

  render() {
    // Override for rendering
  }

  destroy() {
    // Override for cleanup
  }

  // Helper methods
  queryEntities(...componentClasses) {
    return this.world.getEntitiesWithComponents(...componentClasses);
  }

  getComponent(entity, componentClass) {
    return this.world.getComponent(entity, componentClass);
  }

  addComponent(entity, component) {
    this.world.addComponent(entity, component);
  }

  removeComponent(entity, componentClass) {
    this.world.removeComponent(entity, componentClass);
  }

  hasComponent(entity, componentClass) {
    return this.world.hasComponent(entity, componentClass);
  }

  createEntity() {
    return this.world.createEntity();
  }

  destroyEntity(entity) {
    this.world.destroyEntity(entity);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}
