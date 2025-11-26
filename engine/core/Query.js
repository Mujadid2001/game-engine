export class Query {
  constructor(componentManager, entityManager) {
    this.componentManager = componentManager;
    this.entityManager = entityManager;
  }

  getEntitiesWithComponents(...componentClasses) {
    const entities = [];
    let mask = 0;

    // Create bitmask for required components
    for (const componentClass of componentClasses) {
      const typeId = this.componentManager.getComponentType(componentClass);
      if (typeId !== undefined) {
        mask |= (1 << typeId);
      }
    }

    // Filter entities by bitmask
    for (const entity of this.entityManager.entities) {
      const entityMask = this.entityManager.getComponentMask(entity);
      if ((entityMask & mask) === mask) {
        entities.push(entity);
      }
    }

    return entities;
  }
}
