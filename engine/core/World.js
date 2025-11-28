export class World {
  constructor() {
    this.entityManager = null;
    this.componentManager = null;
    this.systems = [];
    this.systemsByName = new Map();
  }

  init(entityManager, componentManager) {
    this.entityManager = entityManager;
    this.componentManager = componentManager;
  }

  // Entity operations
  createEntity() {
    return this.entityManager.createEntity();
  }

  destroyEntity(entity) {
    // Remove all components first
    for (const [typeName] of this.componentManager.componentArrays) {
      this.componentManager.removeComponent(entity, { name: typeName });
    }
    this.entityManager.destroyEntity(entity);
  }

  // Component operations
  addComponent(entity, component) {
    const typeName = component.constructor.name;
    this.componentManager.addComponent(entity, component);
    
    // Update entity's component mask
    const componentType = this.componentManager.getComponentType(component.constructor);
    const currentMask = this.entityManager.getComponentMask(entity);
    const newMask = currentMask | (1 << componentType);
    this.entityManager.setComponentMask(entity, newMask);
  }

  getComponent(entity, componentClass) {
    return this.componentManager.getComponent(entity, componentClass);
  }

  removeComponent(entity, componentClass) {
    this.componentManager.removeComponent(entity, componentClass);
    
    // Update entity's component mask
    const componentType = this.componentManager.getComponentType(componentClass);
    const currentMask = this.entityManager.getComponentMask(entity);
    const newMask = currentMask & ~(1 << componentType);
    this.entityManager.setComponentMask(entity, newMask);
  }

  hasComponent(entity, componentClass) {
    return this.componentManager.hasComponent(entity, componentClass);
  }

  // System operations
  addSystem(system) {
    this.systems.push(system);
    system.world = this;
    this.systemsByName.set(system.constructor.name, system);
    if (system.init) {
      system.init();
    }
  }

  getSystem(systemClass) {
    return this.systemsByName.get(systemClass.name);
  }

  update(deltaTime) {
    for (const system of this.systems) {
      if (system.enabled && system.update) {
        system.update(deltaTime);
      }
    }
  }

  render() {
    for (const system of this.systems) {
      if (system.enabled && system.render) {
        system.render();
      }
    }
  }

  // Query entities with specific components (fast bitmask filtering)
  getEntitiesWithComponents(...componentClasses) {
    const entities = [];
    let requiredMask = 0;

    // Build required mask
    for (const componentClass of componentClasses) {
      const componentType = this.componentManager.getComponentType(componentClass);
      if (componentType !== undefined) {
        requiredMask |= (1 << componentType);
      }
    }

    // Filter entities using bitmask
    for (const entity of this.entityManager.entities) {
      const entityMask = this.entityManager.getComponentMask(entity);
      if ((entityMask & requiredMask) === requiredMask) {
        entities.push(entity);
      }
    }

    return entities;
  }

  clear() {
    // Destroy all entities
    const entitiesToDestroy = Array.from(this.entityManager.entities);
    for (const entity of entitiesToDestroy) {
      this.destroyEntity(entity);
    }
  }
}
