export class ComponentManager {
  constructor() {
    this.componentTypes = new Map();
    this.nextComponentId = 0;
    this.componentArrays = new Map();
  }

  registerComponent(componentClass) {
    const typeName = componentClass.name;
    if (!this.componentTypes.has(typeName)) {
      this.componentTypes.set(typeName, this.nextComponentId++);
      this.componentArrays.set(typeName, new Map());
    }
  }

  getComponentType(componentClass) {
    return this.componentTypes.get(componentClass.name);
  }

  addComponent(entity, component) {
    const typeName = component.constructor.name;
    this.componentArrays.get(typeName).set(entity, component);
  }

  getComponent(entity, componentClass) {
    return this.componentArrays.get(componentClass.name)?.get(entity);
  }

  removeComponent(entity, componentClass) {
    this.componentArrays.get(componentClass.name)?.delete(entity);
  }

  hasComponent(entity, componentClass) {
    return this.componentArrays.get(componentClass.name)?.has(entity) || false;
  }
}
