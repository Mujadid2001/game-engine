import { System } from '../core/System.js';
import { Button } from '../components/Button.js';
import { Position } from '../components/Position.js';

export class UISystem extends System {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.mousePressed = false;
    this.setupListeners();
  }

  setupListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mousedown', () => {
      this.mouseDown = true;
      this.mousePressed = true;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });
  }

  update(deltaTime) {
    if (!this.enabled) return;

    const entities = this.queryEntities(Button, Position);

    for (const entity of entities) {
      const button = this.getComponent(entity, Button);
      const position = this.getComponent(entity, Position);

      // Check if mouse is over button
      const wasHovered = button.isHovered;
      button.isHovered = this.mouseX >= position.x && 
                         this.mouseX <= position.x + button.width &&
                         this.mouseY >= position.y && 
                         this.mouseY <= position.y + button.height;

      // Hover event
      if (button.isHovered && !wasHovered && button.onHover) {
        button.onHover();
      }

      // Click event
      if (button.isHovered && this.mousePressed && !button.isDisabled) {
        button.isPressed = true;
        if (button.onClick) {
          button.onClick();
        }
      }

      // Release event
      if (!this.mouseDown && button.isPressed) {
        button.isPressed = false;
        if (button.onRelease) {
          button.onRelease();
        }
      }
    }

    this.mousePressed = false;
  }
}
