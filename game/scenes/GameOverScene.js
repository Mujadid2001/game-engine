import { Scene } from '../../engine/scene/Scene.js';
import { Position } from '../../engine/components/Position.js';
import { Text } from '../../engine/components/Text.js';
import { Button } from '../../engine/components/Button.js';

export class GameOverScene extends Scene {
  constructor() {
    super('GameOver');
  }

  onCreate() {
    console.log('💀 Game Over Scene Created');

    // Game Over title
    const title = this.createEntity();
    this.addComponent(title, new Position(400, 200));
    const titleText = new Text('GAME OVER', 'bold 64px Arial', '#ff0000');
    titleText.align = 'center';
    titleText.shadow = true;
    titleText.shadowColor = '#000000';
    titleText.shadowBlur = 10;
    this.addComponent(title, titleText);

    // Score text (example)
    const score = this.createEntity();
    this.addComponent(score, new Position(400, 280));
    const scoreText = new Text('Final Score: 0', '24px Arial', '#ffffff');
    scoreText.align = 'center';
    this.addComponent(score, scoreText);

    // Retry button
    const retryBtn = this.createEntity();
    this.addComponent(retryBtn, new Position(300, 350));
    const retryButton = new Button(200, 50, 'RETRY');
    retryButton.normalColor = '#4a7a4a';
    retryButton.hoverColor = '#6aaa6a';
    retryButton.onClick = () => {
      console.log('🔄 Restarting game...');
      this.engine.loadScene('game');
    };
    this.addComponent(retryBtn, retryButton);

    // Menu button
    const menuBtn = this.createEntity();
    this.addComponent(menuBtn, new Position(300, 420));
    const menuButton = new Button(200, 50, 'MAIN MENU');
    menuButton.normalColor = '#2a4a7a';
    menuButton.hoverColor = '#3a6aaa';
    menuButton.onClick = () => {
      console.log('📋 Returning to menu...');
      this.engine.loadScene('menu');
    };
    this.addComponent(menuBtn, menuButton);
  }

  update(deltaTime) {
    // Game over screen logic
  }

  onDestroy() {
    console.log('Game Over Scene Destroyed');
    super.onDestroy();
  }
}
