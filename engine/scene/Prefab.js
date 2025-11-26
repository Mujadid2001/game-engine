export class Prefab {
  constructor(name, components = []) {
    this.name = name;
    this.components = components;
  }

  instantiate(world, entityManager, componentManager) {
    const entity = entityManager.createEntity();
    let mask = 0;

    for (const component of this.components) {
      componentManager.addComponent(entity, component);
      
      const typeId = componentManager.getComponentType(component.constructor);
      if (typeId !== undefined) {
        mask |= (1 << typeId);
      }
    }

    entityManager.setComponentMask(entity, mask);
    return entity;
  }
}
