export class System {
  constructor() {
    this.world = null;
    this.entities = [];
  }

  update(deltaTime) {
    // Override in derived systems
  }

  init() {
    // Override for initialization
  }
}
