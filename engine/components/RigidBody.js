export class RigidBody {
  constructor(mass = 1, gravity = 0) {
    this.mass = mass;
    this.gravity = gravity;
    this.isStatic = false;
    this.useGravity = true;
    this.friction = 0.1;
    this.restitution = 0.5; // Bounciness
    this.drag = 0.01;
    this.angularDrag = 0.05;
    this.velocity = { x: 0, y: 0 };
    this.angularVelocity = 0;
  }
}
