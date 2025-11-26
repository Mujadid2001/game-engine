export class EntityManager {
  constructor() {
    this.nextEntityId = 0;
    this.entities = new Set();
    this.entityComponentMasks = new Map();
  }

  createEntity() {
    const entity = this.nextEntityId++;
    this.entities.add(entity);
    this.entityComponentMasks.set(entity, 0);
    return entity;
  }

  destroyEntity(entity) {
    this.entities.delete(entity);
    this.entityComponentMasks.delete(entity);
  }

  setComponentMask(entity, mask) {
    this.entityComponentMasks.set(entity, mask);
  }

  getComponentMask(entity) {
    return this.entityComponentMasks.get(entity) || 0;
  }
}
