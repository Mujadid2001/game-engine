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

// Import scenes
import { GameScene } from './scenes/GameScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';

// Initialize Engine
const engine = new Engine('gameCanvas', {
  width: 800,
  height: 600,
  backgroundColor: '#0a0a1e',
  showFPS: true,
  pixelPerfect: false
});

async function main() {
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

  // Add systems (order matters!)
  const inputSystem = new InputSystem(engine.canvas);
  const cameraSystem = new CameraSystem(engine.canvas);
  const renderSystem = new RenderSystem(engine.renderer);
  
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
  engine.addSystem(renderSystem);

  // Add scenes
  engine.sceneManager.addScene('menu', new MainMenuScene());
  engine.sceneManager.addScene('game', new GameScene());

  // Initialize and start
  await engine.init();
  
  // Load main menu
  engine.loadScene('menu');
  
  // Start the engine
  engine.start();

  console.log('🎮 Game is running!');
  console.log('Controls:');
  console.log('  WASD or Arrow Keys - Move');
  console.log('  Space - Jump');
  console.log('  Click - Shoot');
}

// Start the game
main().catch(console.error);

