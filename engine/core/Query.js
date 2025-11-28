export class Query {
  constructor(world) {
    this.world = world;
    this.requiredMask = 0;
    this.excludedMask = 0;
    this.requiredComponents = [];
    this.excludedComponents = [];
    this.cachedEntities = [];
    this.isDirty = true;
  }

  // Fluent API for building queries
  with(...componentClasses) {
    this.requiredComponents.push(...componentClasses);
    for (const componentClass of componentClasses) {
      const typeId = this.world.componentManager.getComponentType(componentClass);
      if (typeId !== undefined) {
        this.requiredMask |= (1 << typeId);
      }
    }
    this.isDirty = true;
    return this;
  }

  without(...componentClasses) {
    this.excludedComponents.push(...componentClasses);
    for (const componentClass of componentClasses) {
      const typeId = this.world.componentManager.getComponentType(componentClass);
      if (typeId !== undefined) {
        this.excludedMask |= (1 << typeId);
      }
    }
    this.isDirty = true;
    return this;
  }

  execute() {
    if (!this.isDirty && this.cachedEntities.length > 0) {
      return this.cachedEntities;
    }

    this.cachedEntities = [];

    for (const entity of this.world.entityManager.entities) {
      const entityMask = this.world.entityManager.getComponentMask(entity);
      
      // Check required components
      const hasRequired = (entityMask & this.requiredMask) === this.requiredMask;
      
      // Check excluded components
      const hasExcluded = this.excludedMask !== 0 && (entityMask & this.excludedMask) !== 0;
      
      if (hasRequired && !hasExcluded) {
        this.cachedEntities.push(entity);
      }
    }

    this.isDirty = false;
    return this.cachedEntities;
  }

  forEach(callback) {
    const entities = this.execute();
    for (const entity of entities) {
      callback(entity);
    }
  }

  // Get entities with component data
  get() {
    return this.execute().map(entity => {
      const data = { entity };
      for (const componentClass of this.requiredComponents) {
        data[componentClass.name] = this.world.getComponent(entity, componentClass);
      }
      return data;
    });
  }

  invalidate() {
    this.isDirty = true;
  }
}
