import { System } from '../core/System.js';
import { RigidBody } from '../components/RigidBody.js';
import { Velocity } from '../components/Velocity.js';
import { Position } from '../components/Position.js';

export class PhysicsSystem extends System {
  constructor(gravity = 980) {
    super();
    this.gravity = gravity;
  }

  update(deltaTime) {
    if (!this.enabled) return;

    const entities = this.queryEntities(RigidBody, Velocity);

    for (const entity of entities) {
      const rigidBody = this.getComponent(entity, RigidBody);
      const velocity = this.getComponent(entity, Velocity);

      if (rigidBody.isStatic) continue;

      // Apply gravity
      if (rigidBody.useGravity) {
        velocity.y += this.gravity * deltaTime;
      }

      // Apply friction (damping)
      const frictionFactor = Math.pow(1 - rigidBody.friction, deltaTime);
      velocity.x *= frictionFactor;
      velocity.y *= frictionFactor;

      // Apply drag
      const dragFactor = Math.pow(1 - rigidBody.drag, deltaTime);
      velocity.x *= dragFactor;
      velocity.y *= dragFactor;

      // Mass affects acceleration (F = ma, so a = F/m)
      // Forces are applied as velocity changes
      const massModifier = 1 / Math.max(0.1, rigidBody.mass);
      
      // Store velocity in rigidBody for collision response
      rigidBody.velocity.x = velocity.x;
      rigidBody.velocity.y = velocity.y;
    }
  }

  applyForce(entity, forceX, forceY) {
    const rigidBody = this.getComponent(entity, RigidBody);
    const velocity = this.getComponent(entity, Velocity);
    
    if (rigidBody && velocity && !rigidBody.isStatic) {
      const massModifier = 1 / Math.max(0.1, rigidBody.mass);
      velocity.x += forceX * massModifier;
      velocity.y += forceY * massModifier;
    }
  }

  applyImpulse(entity, impulseX, impulseY) {
    const velocity = this.getComponent(entity, Velocity);
    if (velocity) {
      velocity.x += impulseX;
      velocity.y += impulseY;
    }
  }
}
