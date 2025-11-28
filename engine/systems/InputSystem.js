import { System } from '../core/System.js';
import { PlayerInput } from '../components/PlayerInput.js';
import { Velocity } from '../components/Velocity.js';

export class InputSystem extends System {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.keys = {};
    this.mouse = { x: 0, y: 0, buttons: {} };
    this.setupInputListeners();
  }

  setupInputListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    if (this.canvas) {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.canvas.addEventListener('mousedown', (e) => {
        this.mouse.buttons[e.button] = true;
      });

      this.canvas.addEventListener('mouseup', (e) => {
        this.mouse.buttons[e.button] = false;
      });
    }
  }

  update(deltaTime) {
    if (!this.enabled) return;

    const entities = this.queryEntities(PlayerInput, Velocity);

    for (const entity of entities) {
      const input = this.getComponent(entity, PlayerInput);
      const velocity = this.getComponent(entity, Velocity);

      // Reset velocity
      velocity.x = 0;
      velocity.y = 0;

      // Horizontal movement
      if (this.keys[input.leftKey]) {
        velocity.x = -input.speed;
      }
      if (this.keys[input.rightKey]) {
        velocity.x = input.speed;
      }

      // Vertical movement (for top-down games)
      if (this.keys[input.upKey]) {
        velocity.y = -input.speed;
      }
      if (this.keys[input.downKey]) {
        velocity.y = input.speed;
      }

      // Jump (for platformers)
      if (this.keys[input.jumpKey] && input.canJump && input.isGrounded) {
        velocity.y = -input.jumpForce;
        input.isGrounded = false;
      }
    }
  }

  isKeyPressed(keyCode) {
    return this.keys[keyCode] || false;
  }

  isMouseButtonPressed(button) {
    return this.mouse.buttons[button] || false;
  }

  getMousePosition() {
    return { x: this.mouse.x, y: this.mouse.y };
  }
}
