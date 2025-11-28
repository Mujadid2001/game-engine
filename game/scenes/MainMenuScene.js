import { Scene } from '../../engine/scene/Scene.js';
import { Position } from '../../engine/components/Position.js';
import { Text } from '../../engine/components/Text.js';
import { Button } from '../../engine/components/Button.js';
import { ParticleEmitter } from '../../engine/components/ParticleEmitter.js';

export class MainMenuScene extends Scene {
  constructor() {
    super('MainMenu');
  }

  onCreate() {
    console.log('📋 Main Menu Scene Created');

    // Title text
    const title = this.createEntity();
    this.addComponent(title, new Position(400, 150));
    const titleText = new Text('ECS GAME ENGINE', 'bold 48px Arial', '#00ffff');
    titleText.align = 'center';
    titleText.shadow = true;
    titleText.shadowColor = '#0088ff';
    titleText.shadowBlur = 10;
    this.addComponent(title, titleText);

    // Subtitle
    const subtitle = this.createEntity();
    this.addComponent(subtitle, new Position(400, 210));
    const subtitleText = new Text('The Ultimate 2D Framework', '24px Arial', '#aaaaff');
    subtitleText.align = 'center';
    this.addComponent(subtitle, subtitleText);

    // Start button
    const startBtn = this.createEntity();
    this.addComponent(startBtn, new Position(300, 300));
    const startButton = new Button(200, 50, 'START GAME');
    startButton.normalColor = '#2a4a7a';
    startButton.hoverColor = '#3a6aaa';
    startButton.pressedColor = '#1a3a5a';
    startButton.onClick = () => {
      console.log('🎮 Starting game...');
      this.engine.loadScene('game');
    };
    this.addComponent(startBtn, startButton);

    // Instructions
    const instructions = this.createEntity();
    this.addComponent(instructions, new Position(400, 450));
    const instructText = new Text('WASD/Arrows: Move | Space: Jump | Click: Shoot', '16px Arial', '#888888');
    instructText.align = 'center';
    this.addComponent(instructions, instructText);

    // Background particles
    for (let i = 0; i < 3; i++) {
      const particle = this.createEntity();
      this.addComponent(particle, new Position(Math.random() * 800, Math.random() * 600));
      const emitter = new ParticleEmitter();
      emitter.emissionRate = 5;
      emitter.lifetime = 3;
      emitter.speed = 30;
      emitter.size = 3;
      emitter.color = '#0088ff';
      emitter.gravity = -20;
      this.addComponent(particle, emitter);
    }

    console.log('✨ Menu ready - Click START GAME to begin!');
  }

  update(deltaTime) {
    // Menu logic if needed
  }
}

