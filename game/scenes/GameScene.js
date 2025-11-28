import { Scene } from '../../engine/scene/Scene.js';
import { Position } from '../../engine/components/Position.js';
import { Velocity } from '../../engine/components/Velocity.js';
import { Sprite } from '../../engine/components/Sprite.js';
import { PlayerInput } from '../../engine/components/PlayerInput.js';
import { Collider } from '../../engine/components/Collider.js';
import { RigidBody } from '../../engine/components/RigidBody.js';
import { Camera } from '../../engine/components/Camera.js';
import { Health } from '../../engine/components/Health.js';
import { Text } from '../../engine/components/Text.js';
import { Trail } from '../../engine/components/Trail.js';
import { ParticleEmitter } from '../../engine/components/ParticleEmitter.js';
import { StateMachine } from '../../engine/components/StateMachine.js';
import { soundGenerator } from '../assets/assets.js';

export class GameScene extends Scene {
  constructor() {
    super('Game');
    this.player = null;
    this.score = 0;
    this.scoreText = null;
    this.enemies = [];
    this.soundGen = soundGenerator;
  }

  onCreate() {
    console.log('🎮 Game Scene Created');

    // Create camera
    const cameraEntity = this.createEntity();
    const camera = new Camera(400, 300, 800, 600);
    camera.bounds = { minX: 0, minY: 0, maxX: 1600, maxY: 600 };
    this.addComponent(cameraEntity, camera);
    this.addComponent(cameraEntity, new Position(400, 300));

    // Get camera system and set main camera
    const cameraSystem = this.engine.getSystem('CameraSystem');
    if (cameraSystem) {
      cameraSystem.setMainCamera(camera);
    }

    // Get render system and set camera
    const renderSystem = this.engine.getSystem('RenderSystem');
    if (renderSystem) {
      renderSystem.setCamera(camera);
    }

    // Create player
    this.createPlayer();

    // Create platforms
    this.createPlatforms();

    // Create enemies
    this.createEnemies();

    // Create collectibles
    this.createCollectibles();

    // UI - Score
    this.scoreText = this.createEntity();
    this.addComponent(this.scoreText, new Position(20, 20));
    const scoreDisplay = new Text(`Score: ${this.score}`, 'bold 24px Arial', '#ffff00');
    scoreDisplay.shadow = true;
    scoreDisplay.shadowColor = '#000000';
    this.addComponent(this.scoreText, scoreDisplay);

    // UI - Health
    const healthText = this.createEntity();
    this.addComponent(healthText, new Position(20, 50));
    const healthDisplay = new Text('Health: ♥♥♥', 'bold 24px Arial', '#ff0000');
    healthDisplay.shadow = true;
    this.addComponent(healthText, healthDisplay);

    console.log('🎮 Game ready! Collect stars and avoid enemies!');
  }

  createPlayer() {
    this.player = this.createEntity();
    
    // Position and physics
    this.addComponent(this.player, new Position(100, 400));
    this.addComponent(this.player, new Velocity(0, 0));
    
    // Visual (using colored rectangle for now)
    const sprite = new Sprite('#00ff00', 32, 32); // Green square
    sprite.zIndex = 10;
    this.addComponent(this.player, sprite);
    
    // Player input
    const input = new PlayerInput(200, 'KeyW', 'KeyS', 'KeyA', 'KeyD');
    input.jumpForce = 400;
    this.addComponent(this.player, input);
    
    // Physics
    const rb = new RigidBody(1, 500);
    rb.useGravity = true;
    rb.friction = 0.8;
    this.addComponent(this.player, rb);
    
    // Collision
    const collider = new Collider(32, 32);
    collider.layer = 0;
    collider.onCollision = (other) => {
      // Handle ground collision for jumping
      const otherCollider = this.getComponent(other, Collider);
      if (otherCollider && otherCollider.layer === 1) {
        const playerInput = this.getComponent(this.player, PlayerInput);
        if (playerInput) {
          playerInput.isGrounded = true;
        }
      }
    };
    this.addComponent(this.player, collider);
    
    // Health
    const health = new Health(3);
    health.onDamage = (amount) => {
      console.log(`Player took ${amount} damage!`);
      this.soundGen.playHit();
      const camera = this.engine.getSystem('CameraSystem').getMainCamera();
      if (camera) camera.shakeCam(10, 0.3);
    };
    health.onDeath = () => {
      console.log('💀 Game Over!');
      this.engine.loadScene('menu');
    };
    this.addComponent(this.player, health);

    // Trail effect
    const trail = new Trail();
    trail.maxPoints = 15;
    trail.width = 3;
    trail.color = '#00ff00';
    trail.minDistance = 10;
    this.addComponent(this.player, trail);

    // Make camera follow player
    const cameraSystem = this.engine.getSystem('CameraSystem');
    if (cameraSystem && cameraSystem.mainCamera) {
      cameraSystem.mainCamera.follow(this.player, 3);
    }
  }

  createPlatforms() {
    const platforms = [
      { x: 0, y: 550, width: 1600, height: 50 },
      { x: 200, y: 450, width: 200, height: 20 },
      { x: 500, y: 350, width: 200, height: 20 },
      { x: 800, y: 450, width: 200, height: 20 },
      { x: 1100, y: 350, width: 200, height: 20 },
      { x: 1400, y: 250, width: 200, height: 20 }
    ];

    for (const platform of platforms) {
      const entity = this.createEntity();
      this.addComponent(entity, new Position(platform.x, platform.y));
      
      const sprite = new Sprite('#4a4a4a', platform.width, platform.height);
      sprite.zIndex = 0;
      this.addComponent(entity, sprite);
      
      const collider = new Collider(platform.width, platform.height);
      collider.layer = 1; // Platform layer
      this.addComponent(entity, collider);
      
      const rb = new RigidBody(Infinity, 0);
      rb.isStatic = true;
      this.addComponent(entity, rb);
    }
  }

  createEnemies() {
    const enemyPositions = [
      { x: 300, y: 400 },
      { x: 600, y: 300 },
      { x: 900, y: 400 },
      { x: 1200, y: 300 }
    ];

    for (const pos of enemyPositions) {
      const enemy = this.createEntity();
      this.enemies.push(enemy);
      
      this.addComponent(enemy, new Position(pos.x, pos.y));
      this.addComponent(enemy, new Velocity(50, 0));
      
      const sprite = new Sprite('#ff0000', 28, 28); // Red square
      sprite.zIndex = 5;
      this.addComponent(enemy, sprite);
      
      const collider = new Collider(28, 28);
      collider.layer = 2; // Enemy layer
      collider.onCollision = (other) => {
        if (other === this.player) {
          const health = this.getComponent(this.player, Health);
          if (health) {
            health.damage(1);
          }
        }
      };
      this.addComponent(enemy, collider);

      // Simple AI: patrol behavior
      const stateMachine = new StateMachine('patrol');
      stateMachine.addState('patrol', null, (dt, entity, world) => {
        const pos = world.getComponent(entity, Position);
        const vel = world.getComponent(entity, Velocity);
        
        // Simple patrol - reverse at boundaries
        if (pos.x > pos.x + 100 || pos.x < pos.x - 100) {
          vel.x *= -1;
        }
      });
      this.addComponent(enemy, stateMachine);
    }
  }

  createCollectibles() {
    const collectiblePositions = [
      { x: 300, y: 420 },
      { x: 600, y: 320 },
      { x: 900, y: 420 },
      { x: 1200, y: 320 },
      { x: 1500, y: 220 }
    ];

    for (const pos of collectiblePositions) {
      const collectible = this.createEntity();
      
      this.addComponent(collectible, new Position(pos.x, pos.y));
      
      const sprite = new Sprite('#ffff00', 20, 20); // Yellow square (star)
      sprite.zIndex = 3;
      sprite.rotation = 0.785; // 45 degrees
      this.addComponent(collectible, sprite);
      
      const collider = new Collider(20, 20);
      collider.isTrigger = true;
      collider.layer = 3;
      collider.onTriggerEnter = (other) => {
        if (other === this.player) {
          // Collect!
          this.score += 100;
          this.updateScore();
          this.soundGen.playCollect();
          
          // Create particle burst
          const particleEntity = this.createEntity();
          this.addComponent(particleEntity, new Position(pos.x, pos.y));
          const emitter = new ParticleEmitter();
          emitter.burst = true;
          emitter.burstCount = 20;
          emitter.speed = 150;
          emitter.lifetime = 0.5;
          emitter.color = '#ffff00';
          emitter.gravity = 200;
          this.addComponent(particleEntity, emitter);
          
          // Remove collectible
          this.world.destroyEntity(collectible);
          
          console.log(`⭐ Collected! Score: ${this.score}`);
        }
      };
      this.addComponent(collectible, collider);
    }
  }

  updateScore() {
    const textComponent = this.getComponent(this.scoreText, Text);
    if (textComponent) {
      textComponent.text = `Score: ${this.score}`;
    }
  }

  update(deltaTime) {
    // Make collectibles rotate
    for (const entity of this.entities) {
      const sprite = this.getComponent(entity, Sprite);
      if (sprite && sprite.rotation !== 0) {
        sprite.rotation += deltaTime * 2;
      }
    }

    // Update health display
    const health = this.getComponent(this.player, Health);
    if (health) {
      // Find health text entity and update
      // (simplified - in real game you'd track this entity)
    }

    // Check input for shooting
    const inputSystem = this.engine.getSystem('InputSystem');
    if (inputSystem && inputSystem.isMouseButtonPressed(0)) {
      this.shoot();
    }
  }

  shoot() {
    // Simple shooting mechanic
    const playerPos = this.getComponent(this.player, Position);
    const inputSystem = this.engine.getSystem('InputSystem');
    const mousePos = inputSystem.getMousePosition();
    
    if (!playerPos || !mousePos) return;

    // Get camera to convert screen to world coordinates
    const camera = this.engine.getSystem('CameraSystem').getMainCamera();
    if (camera) {
      const worldPos = camera.screenToWorld(mousePos.x, mousePos.y);
      
      // Calculate direction
      const dx = worldPos.x - playerPos.x;
      const dy = worldPos.y - playerPos.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Create bullet
      const bullet = this.createEntity();
      this.addComponent(bullet, new Position(playerPos.x + 16, playerPos.y + 16));
      this.addComponent(bullet, new Velocity(dx / length * 400, dy / length * 400));
      
      const sprite = new Sprite('#00ffff', 8, 8);
      sprite.zIndex = 8;
      this.addComponent(bullet, sprite);
      
      // Play shoot sound
      this.soundGen.playShoot();
      
      console.log('💥 Pew!');
    }
  }

  onDestroy() {
    console.log('🎮 Game Scene Destroyed');
    super.onDestroy();
  }
}
