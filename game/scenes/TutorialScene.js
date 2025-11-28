import { Scene } from '../../engine/scene/Scene.js';
import { Position } from '../../engine/components/Position.js';
import { Velocity } from '../../engine/components/Velocity.js';
import { Sprite } from '../../engine/components/Sprite.js';
import { Text } from '../../engine/components/Text.js';
import { Button } from '../../engine/components/Button.js';
import { ParticleEmitter } from '../../engine/components/ParticleEmitter.js';

export class TutorialScene extends Scene {
  constructor() {
    super('Tutorial');
  }

  onCreate() {
    console.log('📚 Tutorial Scene Created');

    // Background particles
    for (let i = 0; i < 5; i++) {
      const particle = this.createEntity();
      this.addComponent(particle, new Position(Math.random() * 800, Math.random() * 600));
      const emitter = new ParticleEmitter();
      emitter.emissionRate = 3;
      emitter.lifetime = 4;
      emitter.speed = 20;
      emitter.size = 2;
      emitter.color = '#4488ff';
      emitter.gravity = -10;
      emitter.angleVariance = Math.PI * 2;
      this.addComponent(particle, emitter);
    }

    // Title
    const title = this.createEntity();
    this.addComponent(title, new Position(400, 80));
    const titleText = new Text('HOW TO PLAY', 'bold 40px Arial', '#00ffff');
    titleText.align = 'center';
    titleText.shadow = true;
    titleText.shadowBlur = 15;
    this.addComponent(title, titleText);

    // Instructions
    const instructions = [
      { y: 180, text: '🎮 MOVEMENT', color: '#ffff00' },
      { y: 220, text: 'Use WASD or Arrow Keys to move your character', color: '#ffffff' },
      { y: 260, text: '⬆️ JUMP', color: '#ffff00' },
      { y: 300, text: 'Press SPACE to jump over obstacles', color: '#ffffff' },
      { y: 340, text: '💥 SHOOT', color: '#ffff00' },
      { y: 380, text: 'Click mouse to shoot projectiles', color: '#ffffff' },
      { y: 420, text: '⭐ COLLECT', color: '#ffff00' },
      { y: 460, text: 'Collect yellow stars for points!', color: '#ffffff' },
    ];

    for (const inst of instructions) {
      const entity = this.createEntity();
      this.addComponent(entity, new Position(400, inst.y));
      const text = new Text(inst.text, inst.color === '#ffff00' ? 'bold 20px Arial' : '16px Arial', inst.color);
      text.align = 'center';
      this.addComponent(entity, text);
    }

    // Start button
    const startBtn = this.createEntity();
    this.addComponent(startBtn, new Position(300, 520));
    const startButton = new Button(200, 50, 'START GAME');
    startButton.normalColor = '#2a7a2a';
    startButton.hoverColor = '#3aaa3a';
    startButton.pressedColor = '#1a5a1a';
    startButton.onClick = () => {
      console.log('🎮 Starting game from tutorial...');
      this.engine.loadScene('game');
    };
    this.addComponent(startBtn, startButton);
  }

  update(deltaTime) {
    // Tutorial logic
  }
}
