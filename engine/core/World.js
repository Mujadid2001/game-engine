export class World {
  constructor() {
    this.entityManager = null;
    this.componentManager = null;
    this.systems = [];
  }

  init(entityManager, componentManager) {
    this.entityManager = entityManager;
    this.componentManager = componentManager;
  }

  addSystem(system) {
    this.systems.push(system);
    system.world = this;
  }

  update(deltaTime) {
    for (const system of this.systems) {
      system.update(deltaTime);
    }
  }
}
