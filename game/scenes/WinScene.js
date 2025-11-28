import { Scene } from '../../engine/scene/Scene.js';
import { Position } from '../../engine/components/Position.js';
import { Text } from '../../engine/components/Text.js';
import { Button } from '../../engine/components/Button.js';
import { ParticleEmitter } from '../../engine/components/ParticleEmitter.js';

export class WinScene extends Scene {
  constructor() {
    super('Win');
    this.finalScore = 0;
  }

  setScore(score) {
    this.finalScore = score;
  }

  onCreate() {
    console.log('🏆 Victory Scene Created');

    // Victory particles
    for (let i = 0; i < 10; i++) {
      const particle = this.createEntity();
      this.addComponent(particle, new Position(400 + (Math.random() - 0.5) * 200, 100));
      const emitter = new ParticleEmitter();
      emitter.emissionRate = 20;
      emitter.lifetime = 2;
      emitter.speed = 150;
      emitter.size = 4;
      emitter.color = i % 2 === 0 ? '#ffff00' : '#ff00ff';
      emitter.gravity = 50;
      emitter.angleVariance = Math.PI * 2;
      this.addComponent(particle, emitter);
    }

    // Victory text
    const title = this.createEntity();
    this.addComponent(title, new Position(400, 150));
    const titleText = new Text('🏆 VICTORY! 🏆', 'bold 56px Arial', '#ffff00');
    titleText.align = 'center';
    titleText.shadow = true;
    titleText.shadowColor = '#ff8800';
    titleText.shadowBlur = 20;
    this.addComponent(title, titleText);

    // Congratulations
    const congrats = this.createEntity();
    this.addComponent(congrats, new Position(400, 230));
    const congratsText = new Text('Congratulations!', '28px Arial', '#ffffff');
    congratsText.align = 'center';
    this.addComponent(congrats, congratsText);

    // Score
    const scoreEntity = this.createEntity();
    this.addComponent(scoreEntity, new Position(400, 280));
    const scoreText = new Text(`Final Score: ${this.finalScore}`, 'bold 32px Arial', '#00ff00');
    scoreText.align = 'center';
    this.addComponent(scoreEntity, scoreText);

    // Stats
    const stats = this.createEntity();
    this.addComponent(stats, new Position(400, 340));
    const statsText = new Text('You collected all the stars!', '20px Arial', '#aaaaaa');
    statsText.align = 'center';
    this.addComponent(stats, statsText);

    // Play Again button
    const playBtn = this.createEntity();
    this.addComponent(playBtn, new Position(250, 420));
    const playButton = new Button(140, 50, 'PLAY AGAIN');
    playButton.normalColor = '#2a7a2a';
    playButton.hoverColor = '#3aaa3a';
    playButton.onClick = () => {
      this.engine.loadScene('game');
    };
    this.addComponent(playBtn, playButton);

    // Menu button
    const menuBtn = this.createEntity();
    this.addComponent(menuBtn, new Position(410, 420));
    const menuButton = new Button(140, 50, 'MENU');
    menuButton.normalColor = '#2a4a7a';
    menuButton.hoverColor = '#3a6aaa';
    menuButton.onClick = () => {
      this.engine.loadScene('menu');
    };
    this.addComponent(menuBtn, menuButton);
  }

  update(deltaTime) {
    // Victory screen animation
  }
}
