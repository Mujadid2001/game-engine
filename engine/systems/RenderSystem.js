import { System } from '../core/System.js';
import { Position } from '../components/Position.js';
import { Sprite } from '../components/Sprite.js';
import { Text } from '../components/Text.js';
import { Button } from '../components/Button.js';

export class RenderSystem extends System {
  constructor(renderer) {
    super();
    this.renderer = renderer;
    this.camera = null;
  }

  setCamera(camera) {
    this.camera = camera;
  }

  render() {
    if (!this.enabled) return;

    this.renderer.clear();

    // Apply camera transform
    if (this.camera) {
      this.renderer.save();
      this.renderer.translate(
        this.camera.width / 2 - this.camera.x * this.camera.zoom + this.camera.shake.x,
        this.camera.height / 2 - this.camera.y * this.camera.zoom + this.camera.shake.y
      );
      this.renderer.scale(this.camera.zoom, this.camera.zoom);
      this.renderer.rotate(this.camera.rotation);
    }

    // Render sprites (sorted by z-index)
    const spriteEntities = this.queryEntities(Position, Sprite);
    const sorted = spriteEntities.sort((a, b) => {
      const spriteA = this.getComponent(a, Sprite);
      const spriteB = this.getComponent(b, Sprite);
      return spriteA.zIndex - spriteB.zIndex;
    });

    for (const entity of sorted) {
      const position = this.getComponent(entity, Position);
      const sprite = this.getComponent(entity, Sprite);

      if (!sprite.visible) continue;

      this.renderer.drawSprite(sprite, position.x, position.y);
    }

    // Restore camera transform
    if (this.camera) {
      this.renderer.restore();
    }

    // Render UI (always on top, no camera transform)
    this.renderUI();
  }

  renderUI() {
    // Render text
    const textEntities = this.queryEntities(Position, Text);
    for (const entity of textEntities) {
      const position = this.getComponent(entity, Position);
      const text = this.getComponent(entity, Text);
      this.renderer.drawText(text, position.x, position.y);
    }

    // Render buttons
    const buttonEntities = this.queryEntities(Position, Button);
    for (const entity of buttonEntities) {
      const position = this.getComponent(entity, Position);
      const button = this.getComponent(entity, Button);
      this.renderer.drawButton(button, position.x, position.y);
    }
  }
}
