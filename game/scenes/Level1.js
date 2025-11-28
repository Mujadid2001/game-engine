import { Scene } from '../../engine/scene/Scene.js';
import { Position } from '../../engine/components/Position.js';
import { Velocity } from '../../engine/components/Velocity.js';
import { Sprite } from '../../engine/components/Sprite.js';
import { PlayerInput } from '../../engine/components/PlayerInput.js';
import { Collider } from '../../engine/components/Collider.js';
import { RigidBody } from '../../engine/components/RigidBody.js';
import { Text } from '../../engine/components/Text.js';

export class Level1 extends Scene {
  constructor() {
    super('Level1');
    this.player = null;
  }

  onCreate() {
    console.log('🎮 Level 1 Scene Created');

    // Create player
    this.player = this.createEntity();
    this.addComponent(this.player, new Position(100, 300));
    this.addComponent(this.player, new Velocity(0, 0));
    
    const playerSprite = new Sprite('#00ff88', 40, 40);
    playerSprite.zIndex = 10;
    this.addComponent(this.player, playerSprite);
    
    this.addComponent(this.player, new PlayerInput(250));
    this.addComponent(this.player, new RigidBody(1, 500));
    this.addComponent(this.player, new Collider(40, 40));

    // Create ground
    const ground = this.createEntity();
    this.addComponent(ground, new Position(0, 550));
    const groundSprite = new Sprite('#555555', 800, 50);
    this.addComponent(ground, groundSprite);
    
    const groundCollider = new Collider(800, 50);
    groundCollider.layer = 1;
    this.addComponent(ground, groundCollider);
    
    const groundRb = new RigidBody(Infinity, 0);
    groundRb.isStatic = true;
    this.addComponent(ground, groundRb);

    // Title text
    const title = this.createEntity();
    this.addComponent(title, new Position(400, 50));
    const titleText = new Text('LEVEL 1 - DEMO', 'bold 32px Arial', '#ffffff');
    titleText.align = 'center';
    titleText.shadow = true;
    this.addComponent(title, titleText);

    console.log('✅ Level 1 ready! Use WASD to move');
  }

  update(deltaTime) {
    // Level logic
  }

  onDestroy() {
    console.log('Level 1 Scene Destroyed');
    super.onDestroy();
  }
}
