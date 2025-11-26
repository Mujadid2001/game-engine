import { System } from '../core/System.js';
import { PlayerInput } from '../components/PlayerInput.js';
import { Velocity } from '../components/Velocity.js';
import { Query } from '../core/Query.js';

export class InputSystem extends System {
  constructor(componentManager, entityManager) {
    super();
    this.query = new Query(componentManager, entityManager);
    this.componentManager = componentManager;
    this.keys = {};

    this.setupInputListeners();
  }

  setupInputListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  update(deltaTime) {
    const entities = this.query.getEntitiesWithComponents(PlayerInput, Velocity);

    for (const entity of entities) {
      const input = this.componentManager.getComponent(entity, PlayerInput);
      const velocity = this.componentManager.getComponent(entity, Velocity);

      velocity.x = 0;

      if (this.keys['ArrowLeft'] || this.keys['a']) {
        velocity.x = -input.moveSpeed;
      }
      if (this.keys['ArrowRight'] || this.keys['d']) {
        velocity.x = input.moveSpeed;
      }
      if (this.keys['ArrowUp'] || this.keys['w'] || this.keys[' ']) {
        velocity.y = -input.jumpForce;
      }
    }
  }
}
