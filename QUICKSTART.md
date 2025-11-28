# 🚀 Quick Start Guide - ECS Game Engine

Get your game running in **5 minutes**!

## ⚡ Installation

### Option 1: Live Server (Recommended)
```bash
cd game-engine
npm install
npm start
```

### Option 2: Python Server
```bash
cd game-engine
python -m http.server 8080
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## 🎮 Try the Demo

1. Open `http://localhost:8080` in your browser
2. Click **START GAME** on the menu
3. **Play the game:**
   - WASD or Arrow Keys to move
   - Space to jump
   - Click to shoot
   - Collect yellow stars ⭐
   - Avoid red enemies 🔴

---

## 🏗️ Build Your First Game (10 minutes)

### Step 1: Create the Engine

```javascript
// game/scenes/MyGame.js
import { Scene } from '../../engine/scene/Scene.js';
import { Position } from '../../engine/components/Position.js';
import { Velocity } from '../../engine/components/Velocity.js';
import { Sprite } from '../../engine/components/Sprite.js';

export class MyGame extends Scene {
  onCreate() {
    // Create player
    const player = this.createEntity();
    this.addComponent(player, new Position(100, 100));
    this.addComponent(player, new Velocity(0, 0));
    
    const sprite = new Sprite('#00ff00', 32, 32); // Green square
    this.addComponent(player, sprite);
    
    console.log('Game created!');
  }
}
```

### Step 2: Register the Scene

```javascript
// game/main.js
import { MyGame } from './scenes/MyGame.js';

// ... after engine setup ...
engine.sceneManager.addScene('mygame', new MyGame());
engine.loadScene('mygame');
```

### Step 3: Run!

```bash
npm start
```

**That's it!** You have a running game! 🎉

---

## 📚 Next Steps

### Add Player Movement

```javascript
import { PlayerInput } from '../../engine/components/PlayerInput.js';

const input = new PlayerInput(200); // Speed 200
this.addComponent(player, input);
```

### Add Physics

```javascript
import { RigidBody } from '../../engine/components/RigidBody.js';

const rb = new RigidBody(1, 500); // Mass 1, Gravity 500
rb.useGravity = true;
this.addComponent(player, rb);
```

### Add Camera Follow

```javascript
import { Camera } from '../../engine/components/Camera.js';

const cameraEntity = this.createEntity();
const camera = new Camera(400, 300, 800, 600);
camera.follow(player, 5);
this.addComponent(cameraEntity, camera);

// Set as main camera
const cameraSystem = this.engine.getSystem('CameraSystem');
cameraSystem.setMainCamera(camera);
```

### Add Collision

```javascript
import { Collider } from '../../engine/components/Collider.js';

const collider = new Collider(32, 32);
collider.onCollision = (other) => {
  console.log('Hit!', other);
};
this.addComponent(player, collider);
```

### Add Particles

```javascript
import { ParticleEmitter } from '../../engine/components/ParticleEmitter.js';

const particle = this.createEntity();
this.addComponent(particle, new Position(400, 300));

const emitter = new ParticleEmitter();
emitter.emissionRate = 20;
emitter.color = '#ffff00';
emitter.speed = 100;
this.addComponent(particle, emitter);
```

---

## 🎯 Common Recipes

### Create a Platform

```javascript
createPlatform(x, y, width, height) {
  const platform = this.createEntity();
  this.addComponent(platform, new Position(x, y));
  this.addComponent(platform, new Sprite('#4a4a4a', width, height));
  
  const collider = new Collider(width, height);
  this.addComponent(platform, collider);
  
  const rb = new RigidBody(Infinity, 0);
  rb.isStatic = true;
  this.addComponent(platform, rb);
  
  return platform;
}
```

### Create an Enemy

```javascript
createEnemy(x, y) {
  const enemy = this.createEntity();
  this.addComponent(enemy, new Position(x, y));
  this.addComponent(enemy, new Velocity(50, 0));
  this.addComponent(enemy, new Sprite('#ff0000', 28, 28));
  
  const collider = new Collider(28, 28);
  collider.onCollision = (other) => {
    if (other === this.player) {
      // Damage player
    }
  };
  this.addComponent(enemy, collider);
  
  return enemy;
}
```

### Create a Collectible

```javascript
createCoin(x, y) {
  const coin = this.createEntity();
  this.addComponent(coin, new Position(x, y));
  
  const sprite = new Sprite('#ffff00', 16, 16);
  sprite.rotation = 0.785; // 45 degrees
  this.addComponent(coin, sprite);
  
  const collider = new Collider(16, 16);
  collider.isTrigger = true;
  collider.onTriggerEnter = (other) => {
    if (other === this.player) {
      this.score += 10;
      this.world.destroyEntity(coin);
    }
  };
  this.addComponent(coin, collider);
  
  return coin;
}
```

---

## 🎨 Customization

### Change Canvas Size

```javascript
const engine = new Engine('gameCanvas', {
  width: 1024,
  height: 768
});
```

### Enable Pixel Art

```javascript
const engine = new Engine('gameCanvas', {
  pixelPerfect: true
});
```

### Show FPS Counter

```javascript
const engine = new Engine('gameCanvas', {
  showFPS: true
});
```

### Custom Background Color

```javascript
const engine = new Engine('gameCanvas', {
  backgroundColor: '#0a0a1e'
});
```

---

## 🐛 Troubleshooting

### Game doesn't start
- Check browser console for errors (F12)
- Make sure you're using a local server (not file://)
- Verify all imports are correct

### Entities not rendering
- Check if RenderSystem is added
- Verify sprite zIndex
- Check camera position

### Physics not working
- Ensure PhysicsSystem is added
- Check RigidBody component
- Verify gravity value

### Collisions not detected
- Add CollisionSystem
- Check collider layers
- Verify both entities have colliders

---

## 📖 Learn More

- Read `FEATURES.md` for complete feature list
- Check `README.md` for architecture details
- Study `game/scenes/GameScene.js` for examples
- Explore `engine/` folder for all components & systems

---

## 🎮 Happy Game Development!

You now have everything you need to build amazing 2D games!

**Need help?** Check the source code - it's well-documented! 💙

---

**Next Challenge:**
Build a complete platformer in under 100 lines of code! 🚀
