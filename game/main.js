import { Engine } from '../engine/Engine.js';
import { MovementSystem } from '../engine/systems/MovementSystem.js';
import { RenderSystem } from '../engine/systems/RenderSystem.js';
import { InputSystem } from '../engine/systems/InputSystem.js';
import { PhysicsSystem } from '../engine/systems/PhysicsSystem.js';
import { CollisionSystem } from '../engine/systems/CollisionSystem.js';
import { AnimationSystem } from '../engine/systems/AnimationSystem.js';

// Import components for registration
import { Position } from '../engine/components/Position.js';
import { Velocity } from '../engine/components/Velocity.js';
import { Sprite } from '../engine/components/Sprite.js';
import { Collider } from '../engine/components/Collider.js';
import { RigidBody } from '../engine/components/RigidBody.js';
import { PlayerInput } from '../engine/components/PlayerInput.js';
import { Animation } from '../engine/components/Animation.js';

// Import scenes
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { Level1 } from './scenes/Level1.js';
import { GameOverScene } from './scenes/GameOverScene.js';

// Get canvas
const canvas = document.getElementById('gameCanvas');
canvas.width = 800;
canvas.height = 600;

// Create engine
const engine = new Engine(canvas);

// Register all components
engine.registerComponent(Position);
engine.registerComponent(Velocity);
engine.registerComponent(Sprite);
engine.registerComponent(Collider);
engine.registerComponent(RigidBody);
engine.registerComponent(PlayerInput);
engine.registerComponent(Animation);

// Add systems
engine.addSystem(new InputSystem(engine.componentManager, engine.entityManager));
engine.addSystem(new PhysicsSystem(engine.componentManager, engine.entityManager));
engine.addSystem(new MovementSystem(engine.componentManager, engine.entityManager));
engine.addSystem(new CollisionSystem(engine.componentManager, engine.entityManager));
engine.addSystem(new AnimationSystem(engine.componentManager, engine.entityManager));
engine.addSystem(new RenderSystem(engine.componentManager, engine.entityManager, engine.renderer));

// Add scenes
engine.sceneManager.addScene('MainMenu', new MainMenuScene());
engine.sceneManager.addScene('Level1', new Level1());
engine.sceneManager.addScene('GameOver', new GameOverScene());

// Load initial scene
engine.sceneManager.loadScene('Level1', engine.world);

// Start engine
engine.start();

console.log('ECS Game Engine Started!');
