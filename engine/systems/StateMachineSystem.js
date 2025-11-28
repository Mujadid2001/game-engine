import { System } from '../core/System.js';
import { StateMachine } from '../components/StateMachine.js';

export class StateMachineSystem extends System {
  update(deltaTime) {
    if (!this.enabled) return;

    const entities = this.queryEntities(StateMachine);

    for (const entity of entities) {
      const stateMachine = this.getComponent(entity, StateMachine);
      stateMachine.update(deltaTime, entity, this.world);
    }
  }
}
