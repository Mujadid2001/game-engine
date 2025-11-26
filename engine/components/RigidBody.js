export class RigidBody {
  constructor(mass = 1, gravity = 0) {
    this.mass = mass;
    this.gravity = gravity;
    this.isStatic = false;
  }
}
