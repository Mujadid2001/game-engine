export class PlayerInput {
  constructor(speed = 200, upKey = 'KeyW', downKey = 'KeyS', leftKey = 'KeyA', rightKey = 'KeyD') {
    this.speed = speed;
    this.upKey = upKey;
    this.downKey = downKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.jumpKey = 'Space';
    this.actionKey = 'KeyE';
    this.shootKey = 'Mouse0';
    this.jumpForce = 400;
    this.canJump = true;
    this.isGrounded = false;
  }
}
