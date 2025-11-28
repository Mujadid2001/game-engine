/**
 * Advanced Demo Scene
 * Showcases ALL engine features in one comprehensive demo
 */

import { Scene } from '../../engine/scene/Scene.js';
import { Position } from '../../engine/components/Position.js';
import { Velocity } from '../../engine/components/Velocity.js';
import { Sprite } from '../../engine/components/Sprite.js';
import { PlayerInput } from '../../engine/components/PlayerInput.js';
import { Collider } from '../../engine/components/Collider.js';
import { RigidBody } from '../../engine/components/RigidBody.js';
import { Animation } from '../../engine/components/Animation.js';
import { Camera } from '../../engine/components/Camera.js';
import { ParticleEmitter } from '../../engine/components/ParticleEmitter.js';
import { Health } from '../../engine/components/Health.js';
import { StateMachine } from '../../engine/components/StateMachine.js';
import { Text } from '../../engine/components/Text.js';
import { Button } from '../../engine/components/Button.js';
import { Trail } from '../../engine/components/Trail.js';
import { Tilemap } from '../../engine/components/Tilemap.js';
import { AudioSource } from '../../engine/components/AudioSource.js';
import { soundGenerator } from '../assets/assets.js';

export class AdvancedDemoScene extends Scene {
  onCreate() {
    this.score = 0;
    this.enemiesDefeated = 0;
    this.soundGen = soundGenerator;

    // Create tilemap background
    this.createTilemap();

    // Create player with ALL features
    this.createAdvancedPlayer();

    // Create camera
    this.createCamera();

    // Create enemies with AI
    this.createSmartEnemies();

    // Create interactive environment
    this.createEnvironment();

    // Create UI
    this.createUI();

    // Create particle effects
    this.createAmbientParticles();

    // Add audio
    this.createBackgroundMusic();

    console.log('🎮 Advanced Demo Scene loaded with ALL features!');
  }

  createTilemap() {
    // Create ground tilemap
    const tilemapEntity = this.world.createEntity();
    const tilemap = new Tilemap(32, 32, 25, 19);
    
    // Create a simple level layout
    for (let y = 0; y < 19; y++) {
      for (let x = 0; x < 25; x++) {
        if (y >= 17) {
          tilemap.setTile(x, y, 1); // Ground
        } else if (y === 16 && (x < 5 || x > 20)) {
          tilemap.setTile(x, y, 1); // Platforms
        } else if (y === 12 && x >= 10 && x <= 15) {
          tilemap.setTile(x, y, 1); // Mid platform
        }
      }
    }

    const position = new Position(0, 0);
    
    this.world.addComponent(tilemapEntity, position);
    this.world.addComponent(tilemapEntity, tilemap);
  }

  createAdvancedPlayer() {
    const player = this.world.createEntity();
    
    // Position & Physics
    const position = new Position(100, 400);
    const velocity = new Velocity(0, 0);
    const rigidBody = new RigidBody();
    rigidBody.useGravity = true;
    rigidBody.friction = 0.8;
    
    // Visual
    const sprite = new Sprite('#00ff00', 32, 32);
    sprite.rotation = 0;
    sprite.zIndex = 10;
    
    // Trail effect
    const trail = new Trail();
    trail.maxLength = 20;
    trail.fadeRate = 0.05;
    trail.color = '#00ff00';
    trail.width = 4;
    
    // Collision
    const collider = new Collider(32, 32);
    collider.type = 'box';
    collider.layer = 0;
    collider.mask = 0b1111;
    
    // Input
    const input = new PlayerInput();
    input.moveSpeed = 300;
    input.jumpForce = -400;
    
    // Health
    const health = new Health(100, 100);
    health.invulnerabilityTime = 1.0;
    health.onDamage = () => {
      this.soundGen.playHit();
      this.createDamageParticles(position.x, position.y);
    };
    health.onDeath = () => {
      this.soundGen.playGameOver();
      this.gameOver();
    };
    health.onHeal = () => {
      this.soundGen.playCollect();
    };
    
    // Animation (mock - would use spritesheet)
    const animation = new Animation();
    animation.animations.set('idle', { frames: [0], frameTime: 0.1 });
    animation.animations.set('walk', { frames: [1, 2, 3, 2], frameTime: 0.1 });
    animation.animations.set('jump', { frames: [4], frameTime: 0.1 });
    animation.currentAnimation = 'idle';
    
    // Audio
    const audioSource = new AudioSource();
    audioSource.spatial = false;
    
    this.world.addComponent(player, position);
    this.world.addComponent(player, velocity);
    this.world.addComponent(player, rigidBody);
    this.world.addComponent(player, sprite);
    this.world.addComponent(player, trail);
    this.world.addComponent(player, collider);
    this.world.addComponent(player, input);
    this.world.addComponent(player, health);
    this.world.addComponent(player, animation);
    this.world.addComponent(player, audioSource);
    
    this.playerEntity = player;
  }

  createCamera() {
    const cameraEntity = this.world.createEntity();
    const camera = new Camera(400, 300, 800, 600);
    camera.follow(this.playerEntity, 3);
    camera.deadzone = { x: 100, y: 80 };
    camera.bounds = { minX: 0, minY: 0, maxX: 800, maxY: 600 };
    
    const position = new Position(0, 0);
    
    this.world.addComponent(cameraEntity, position);
    this.world.addComponent(cameraEntity, camera);
  }

  createSmartEnemies() {
    const enemyPositions = [
      { x: 300, y: 500 },
      { x: 500, y: 500 },
      { x: 400, y: 350 }
    ];

    for (const pos of enemyPositions) {
      const enemy = this.world.createEntity();
      
      const position = new Position(pos.x, pos.y);
      const velocity = new Velocity(0, 0);
      const sprite = new Sprite('#ff0000', 32, 32);
      sprite.zIndex = 5;
      
      const rigidBody = new RigidBody();
      rigidBody.useGravity = true;
      
      const collider = new Collider(32, 32);
      collider.type = 'box';
      collider.layer = 1;
      collider.onCollision = (other) => {
        // Check if hit player
        if (this.world.hasComponent(other, PlayerInput)) {
          const playerHealth = this.world.getComponent(other, Health);
          if (playerHealth) {
            playerHealth.damage(10);
          }
        }
      };
      
      const health = new Health(30, 30);
      health.onDeath = () => {
        this.world.destroyEntity(enemy);
        this.enemiesDefeated++;
        this.score += 100;
        this.createExplosion(position.x, position.y);
        this.soundGen.playHit();
      };
      
      // AI State Machine
      const stateMachine = new StateMachine();
      stateMachine.addState('patrol', {
        onEnter: () => {
          velocity.x = Math.random() > 0.5 ? 50 : -50;
        },
        onUpdate: (dt) => {
          // Simple patrol
          if (Math.abs(position.x - pos.x) > 100) {
            velocity.x = -velocity.x;
          }
        }
      });
      
      stateMachine.addState('chase', {
        onUpdate: (dt) => {
          const playerPos = this.world.getComponent(this.playerEntity, Position);
          if (playerPos) {
            const dx = playerPos.x - position.x;
            velocity.x = dx > 0 ? 80 : -80;
          }
        }
      });
      
      stateMachine.addTransition('patrol', 'chase', () => {
        const playerPos = this.world.getComponent(this.playerEntity, Position);
        if (playerPos) {
          const dist = Math.hypot(playerPos.x - position.x, playerPos.y - position.y);
          return dist < 200;
        }
        return false;
      });
      
      stateMachine.addTransition('chase', 'patrol', () => {
        const playerPos = this.world.getComponent(this.playerEntity, Position);
        if (playerPos) {
          const dist = Math.hypot(playerPos.x - position.x, playerPos.y - position.y);
          return dist > 300;
        }
        return false;
      });
      
      stateMachine.setState('patrol');
      
      this.world.addComponent(enemy, position);
      this.world.addComponent(enemy, velocity);
      this.world.addComponent(enemy, sprite);
      this.world.addComponent(enemy, rigidBody);
      this.world.addComponent(enemy, collider);
      this.world.addComponent(enemy, health);
      this.world.addComponent(enemy, stateMachine);
    }
  }

  createEnvironment() {
    // Create collectibles
    for (let i = 0; i < 10; i++) {
      const collectible = this.world.createEntity();
      
      const position = new Position(
        100 + i * 60,
        300 + Math.sin(i) * 100
      );
      
      const sprite = new Sprite('#ffff00', 24, 24);
      sprite.zIndex = 8;
      
      const collider = new Collider(24, 24);
      collider.isTrigger = true;
      collider.onCollision = (other) => {
        if (this.world.hasComponent(other, PlayerInput)) {
          this.world.destroyEntity(collectible);
          this.score += 50;
          this.soundGen.playCollect();
          this.createCollectParticles(position.x, position.y);
        }
      };
      
      // Rotating animation
      const velocity = new Velocity(0, 0);
      
      this.world.addComponent(collectible, position);
      this.world.addComponent(collectible, sprite);
      this.world.addComponent(collectible, collider);
      this.world.addComponent(collectible, velocity);
      
      this.collectibles = this.collectibles || [];
      this.collectibles.push(collectible);
    }

    // Create platforms
    const platformData = [
      { x: 200, y: 450, width: 150, height: 20 },
      { x: 450, y: 400, width: 100, height: 20 },
      { x: 100, y: 350, width: 80, height: 20 },
      { x: 600, y: 300, width: 120, height: 20 }
    ];

    for (const data of platformData) {
      const platform = this.world.createEntity();
      
      const position = new Position(data.x, data.y);
      const sprite = new Sprite('#8B4513', data.width, data.height);
      sprite.zIndex = 3;
      
      const collider = new Collider(data.width, data.height);
      collider.type = 'box';
      collider.layer = 2;
      collider.isStatic = true;
      
      this.world.addComponent(platform, position);
      this.world.addComponent(platform, sprite);
      this.world.addComponent(platform, collider);
    }
  }

  createUI() {
    // Score text
    const scoreText = this.world.createEntity();
    const scorePos = new Position(20, 20);
    const scoreDisplay = new Text(`Score: ${this.score}`, '24px Arial', '#ffffff');
    scoreDisplay.shadow = true;
    scoreDisplay.shadowColor = '#000';
    scoreDisplay.shadowBlur = 4;
    
    this.world.addComponent(scoreText, scorePos);
    this.world.addComponent(scoreText, scoreDisplay);
    this.scoreTextEntity = scoreText;
    
    // Health bar
    const healthText = this.world.createEntity();
    const healthPos = new Position(20, 50);
    const healthDisplay = new Text('Health: 100', '20px Arial', '#00ff00');
    healthDisplay.shadow = true;
    
    this.world.addComponent(healthText, healthPos);
    this.world.addComponent(healthText, healthDisplay);
    this.healthTextEntity = healthText;
    
    // Pause button
    const pauseBtn = this.world.createEntity();
    const btnPos = new Position(700, 20);
    const button = new Button('PAUSE', 80, 40);
    button.onClick = () => {
      console.log('🎮 Game paused');
      // Would pause game here
    };
    
    this.world.addComponent(pauseBtn, btnPos);
    this.world.addComponent(pauseBtn, button);
  }

  createAmbientParticles() {
    // Background particles
    for (let i = 0; i < 3; i++) {
      const emitter = this.world.createEntity();
      const position = new Position(Math.random() * 800, Math.random() * 600);
      
      const particleEmitter = new ParticleEmitter();
      particleEmitter.emissionRate = 5;
      particleEmitter.lifetime = 3;
      particleEmitter.speed = 30;
      particleEmitter.speedVariance = 20;
      particleEmitter.angle = -Math.PI / 2;
      particleEmitter.angleVariance = Math.PI / 4;
      particleEmitter.color = '#ffffff';
      particleEmitter.size = 2;
      particleEmitter.gravity = -20;
      
      this.world.addComponent(emitter, position);
      this.world.addComponent(emitter, particleEmitter);
    }
  }

  createBackgroundMusic() {
    // Would create looping background music
    // For now using procedural sounds on events
  }

  createExplosion(x, y) {
    const explosion = this.world.createEntity();
    const position = new Position(x, y);
    const emitter = new ParticleEmitter();
    
    emitter.burst = true;
    emitter.burstCount = 50;
    emitter.lifetime = 0.5;
    emitter.speed = 150;
    emitter.speedVariance = 50;
    emitter.angleVariance = Math.PI * 2;
    emitter.color = '#ff6600';
    emitter.size = 4;
    emitter.gravity = 200;
    
    this.world.addComponent(explosion, position);
    this.world.addComponent(explosion, emitter);
    
    // Auto-destroy after burst
    setTimeout(() => {
      this.world.destroyEntity(explosion);
    }, 1000);
  }

  createCollectParticles(x, y) {
    const particles = this.world.createEntity();
    const position = new Position(x, y);
    const emitter = new ParticleEmitter();
    
    emitter.burst = true;
    emitter.burstCount = 20;
    emitter.lifetime = 0.3;
    emitter.speed = 100;
    emitter.speedVariance = 30;
    emitter.angleVariance = Math.PI * 2;
    emitter.color = '#ffff00';
    emitter.size = 3;
    
    this.world.addComponent(particles, position);
    this.world.addComponent(particles, emitter);
    
    setTimeout(() => {
      this.world.destroyEntity(particles);
    }, 500);
  }

  createDamageParticles(x, y) {
    const particles = this.world.createEntity();
    const position = new Position(x, y);
    const emitter = new ParticleEmitter();
    
    emitter.burst = true;
    emitter.burstCount = 15;
    emitter.lifetime = 0.4;
    emitter.speed = 120;
    emitter.color = '#ff0000';
    emitter.size = 3;
    
    this.world.addComponent(particles, position);
    this.world.addComponent(particles, emitter);
    
    setTimeout(() => {
      this.world.destroyEntity(particles);
    }, 500);
  }

  update(deltaTime) {
    // Update UI
    if (this.scoreTextEntity) {
      const scoreText = this.world.getComponent(this.scoreTextEntity, Text);
      if (scoreText) {
        scoreText.text = `Score: ${this.score} | Enemies: ${this.enemiesDefeated}`;
      }
    }
    
    if (this.healthTextEntity && this.playerEntity) {
      const health = this.world.getComponent(this.playerEntity, Health);
      const healthText = this.world.getComponent(this.healthTextEntity, Text);
      if (health && healthText) {
        healthText.text = `Health: ${Math.floor(health.current)}/${health.max}`;
        healthText.color = health.current > 50 ? '#00ff00' : health.current > 25 ? '#ffaa00' : '#ff0000';
      }
    }
    
    // Animate collectibles
    if (this.collectibles) {
      for (const collectible of this.collectibles) {
        const sprite = this.world.getComponent(collectible, Sprite);
        if (sprite) {
          sprite.rotation += deltaTime * 2;
        }
      }
    }
  }

  gameOver() {
    console.log('💀 Game Over!');
    this.engine.loadScene('gameover');
  }

  onDestroy() {
    console.log('🧹 Advanced Demo Scene destroyed');
  }
}
