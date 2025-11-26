import { Scene } from '../../engine/scene/Scene.js';

export class MainMenuScene extends Scene {
  constructor() {
    super('MainMenu');
  }

  onCreate() {
    console.log('Main Menu Scene Created');
    // TODO: Create menu UI entities
  }

  onDestroy() {
    console.log('Main Menu Scene Destroyed');
  }

  update(deltaTime) {
    // Handle menu logic
  }
}
