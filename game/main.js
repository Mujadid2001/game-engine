import { Engine } from '../engine/Engine.js';

// Import all components
import { Position } from '../engine/components/Position.js';
import { Velocity } from '../engine/components/Velocity.js';
import { Sprite } from '../engine/components/Sprite.js';
import { PlayerInput } from '../engine/components/PlayerInput.js';
import { Collider } from '../engine/components/Collider.js';
import { RigidBody } from '../engine/components/RigidBody.js';
import { Animation } from '../engine/components/Animation.js';
import { Camera } from '../engine/components/Camera.js';
import { ParticleEmitter } from '../engine/components/ParticleEmitter.js';
import { Health } from '../engine/components/Health.js';
import { StateMachine } from '../engine/components/StateMachine.js';
import { Text } from '../engine/components/Text.js';
import { Button } from '../engine/components/Button.js';
import { Trail } from '../engine/components/Trail.js';
import { Tilemap } from '../engine/components/Tilemap.js';
import { AudioSource } from '../engine/components/AudioSource.js';

// Import all systems
import { MovementSystem } from '../engine/systems/MovementSystem.js';
import { RenderSystem } from '../engine/systems/RenderSystem.js';
import { InputSystem } from '../engine/systems/InputSystem.js';
import { PhysicsSystem } from '../engine/systems/PhysicsSystem.js';
import { CollisionSystem } from '../engine/systems/CollisionSystem.js';
import { AnimationSystem } from '../engine/systems/AnimationSystem.js';
import { CameraSystem } from '../engine/systems/CameraSystem.js';
import { ParticleSystem } from '../engine/systems/ParticleSystem.js';
import { HealthSystem } from '../engine/systems/HealthSystem.js';
import { StateMachineSystem } from '../engine/systems/StateMachineSystem.js';
import { UISystem } from '../engine/systems/UISystem.js';
import { TrailSystem } from '../engine/systems/TrailSystem.js';
import { TilemapSystem } from '../engine/systems/TilemapSystem.js';
import { AudioSystem } from '../engine/systems/AudioSystem.js';

// Import scenes
import { GameScene } from './scenes/GameScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { TutorialScene } from './scenes/TutorialScene.js';
import { WinScene } from './scenes/WinScene.js';
import { AdvancedDemoScene } from './scenes/AdvancedDemoScene.js';

// Initialize Engine
const engine = new Engine('gameCanvas', {
  width: 800,
  height: 600,
  backgroundColor: '#0a0a1e',
  showFPS: true,
  pixelPerfect: false
});

async function main() {
  console.log('🎮 Initializing ECS Game Engine...');
  console.log('📦 Loading components and systems...');

  // Register all components
  engine.registerComponent(Position);
  engine.registerComponent(Velocity);
  engine.registerComponent(Sprite);
  engine.registerComponent(PlayerInput);
  engine.registerComponent(Collider);
  engine.registerComponent(RigidBody);
  engine.registerComponent(Animation);
  engine.registerComponent(Camera);
  engine.registerComponent(ParticleEmitter);
  engine.registerComponent(Health);
  engine.registerComponent(StateMachine);
  engine.registerComponent(Text);
  engine.registerComponent(Button);
  engine.registerComponent(Trail);
  engine.registerComponent(Tilemap);
  engine.registerComponent(AudioSource);

  console.log('✅ Components registered:', 16);

  // Add systems (order matters!)
  const inputSystem = new InputSystem(engine.canvas);
  const cameraSystem = new CameraSystem(engine.canvas);
  const renderSystem = new RenderSystem(engine.renderer);
  const audioSystem = new AudioSystem();
  const tilemapSystem = new TilemapSystem();
  
  engine.addSystem(inputSystem);
  engine.addSystem(new UISystem(engine.canvas));
  engine.addSystem(new StateMachineSystem());
  engine.addSystem(new PhysicsSystem(500)); // Gravity
  engine.addSystem(new MovementSystem());
  engine.addSystem(new CollisionSystem());
  engine.addSystem(new AnimationSystem());
  engine.addSystem(new HealthSystem());
  engine.addSystem(cameraSystem);
  engine.addSystem(new ParticleSystem());
  engine.addSystem(new TrailSystem());
  engine.addSystem(audioSystem);
  engine.addSystem(tilemapSystem);
  engine.addSystem(renderSystem);

  console.log('✅ Systems initialized:', 14);

  // Add scenes
  engine.sceneManager.addScene('menu', new MainMenuScene());
  engine.sceneManager.addScene('tutorial', new TutorialScene());
  engine.sceneManager.addScene('game', new GameScene());
  engine.sceneManager.addScene('demo', new AdvancedDemoScene());
  engine.sceneManager.addScene('gameover', new GameOverScene());
  engine.sceneManager.addScene('win', new WinScene());

  console.log('✅ Scenes loaded:', 6);

  // Initialize and start
  await engine.init();
  
  console.log('🎮 Engine initialization complete!');
  console.log('');
  console.log('='.repeat(60));
  console.log('🎮 ECS GAME ENGINE - DEMO');
  console.log('='.repeat(60));
  console.log('');
  console.log('FEATURES:');
  console.log('  ⚡ Ultra-Fast ECS Architecture with Bitmask Filtering');
  console.log('  🎨 Advanced Canvas 2D Renderer');
  console.log('  📷 Camera System (Follow, Shake, Zoom)');
  console.log('  💥 Particle Effects & Visual Trails');
  console.log('  🎯 Smart Collision Detection & Response');
  console.log('  🎬 Animation System');
  console.log('  🎮 Complete Input Handling');
  console.log('  🤖 State Machines for AI');
  console.log('  ❤️ Health System');
  console.log('  🖱️ Interactive UI Components');
  console.log('');
  console.log('CONTROLS:');
  console.log('  WASD or Arrow Keys - Move Player');
  console.log('  Space - Jump');
  console.log('  Mouse Click - Shoot');
  console.log('  Click UI Buttons - Navigate');
  console.log('');
  console.log('GAME OBJECTIVE:');
  console.log('  ⭐ Collect all yellow stars');
  console.log('  ❌ Avoid red enemies');
  console.log('  💚 Don\'t lose all your health!');
  console.log('');
  console.log('='.repeat(60));
  console.log('');
  
  // Load main menu
  engine.loadScene('menu');
  
  // Start the engine
  engine.start();

  console.log('▶️  Game is now running!');
  console.log('👆 Click "START GAME" in the menu to begin!');
  console.log('');

  // Make engine globally accessible for debugging
  window.gameEngine = engine;
  console.log('💡 Tip: Access engine via window.gameEngine for debugging');
}

// Start the game
main().catch(error => {
  console.error('❌ Failed to start game:', error);
  console.error('Stack trace:', error.stack);
});

