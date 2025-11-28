export class EntityManager {
  constructor() {
    this.nextEntityId = 0;
    this.entities = new Set();
    this.entityComponentMasks = new Map();
  }

  createEntity() {
    const entity = this.nextEntityId++;
    this.entities.add(entity); // entity is added in the set
    this.entityComponentMasks.set(entity, 0); // initial component mask is 0 for any new entity
    return entity;
  }

  destroyEntity(entity) {
    this.entities.delete(entity); // entity is removed from the set
    this.entityComponentMasks.delete(entity); // component mask is removed for the entity
  }

  setComponentMask(entity, mask) {
    this.entityComponentMasks.set(entity, mask); // update the component mask for the entity
  }

  getComponentMask(entity) {
    return this.entityComponentMasks.get(entity) || 0; // default to 0 if not found
  }
}
