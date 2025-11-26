import { Scene } from '../../engine/scene/Scene.js';

export class Level1 extends Scene {
  constructor() {
    super('Level1');
  }

  onCreate() {
    console.log('Level 1 Scene Created');
    // TODO: Create level entities (player, enemies, etc.)
  }

  onDestroy() {
    console.log('Level 1 Scene Destroyed');
  }

  update(deltaTime) {
    // Handle level-specific logic
  }
}
