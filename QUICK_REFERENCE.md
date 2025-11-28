# 🎮 Quick Reference - ECS Game Engine

## 🚀 Quick Start

```powershell
# Start the server
npx live-server

# Open browser to http://localhost:8080
```

## 📦 What You Have

### Components (16)
1. Position - x, y coordinates
2. Velocity - movement speed
3. Sprite - visual representation
4. Collider - collision detection
5. RigidBody - physics simulation
6. PlayerInput - keyboard/mouse input
7. Camera - view management
8. ParticleEmitter - visual effects
9. Health - damage/healing
10. StateMachine - AI states
11. Animation - sprite animations
12. Text - UI text display
13. Button - interactive UI
14. Trail - motion trails
15. **Tilemap** - tile-based levels ⭐ NEW
16. **AudioSource** - sound playback ⭐ NEW

### Systems (14)
1. InputSystem - process input
2. UISystem - update UI
3. StateMachineSystem - run AI
4. PhysicsSystem - apply physics
5. MovementSystem - move entities
6. CollisionSystem - detect collisions
7. AnimationSystem - animate sprites
8. HealthSystem - manage health
9. CameraSystem - update camera
10. ParticleSystem - simulate particles
11. TrailSystem - render trails
12. **AudioSystem** - play sounds ⭐ NEW
13. **TilemapSystem** - render tilemaps ⭐ NEW
14. RenderSystem - draw everything

### Scenes (6)
1. MainMenuScene - title screen
2. TutorialScene - instructions
3. GameScene - platformer demo
4. **AdvancedDemoScene** - ALL features ⭐ NEW
5. WinScene - victory screen
6. GameOverScene - game over screen

### Tools (5)
1. AssetManager - load assets ⭐ NEW
2. SoundGenerator - procedural audio ⭐ NEW
3. SaveSystem - save/load games ⭐ NEW
4. LevelEditor - create levels ⭐ NEW
5. EventEmitter - event handling

### Renderers (2)
1. CanvasRenderer - 2D canvas rendering
2. **WebGLRenderer** - GPU accelerated ⭐ NEW

## 💻 Common Tasks

### Create an Entity
```javascript
const entity = world.createEntity();
world.addComponent(entity, new Position(100, 100));
world.addComponent(entity, new Sprite('#00ff00', 32, 32));
```

### Query Entities
```javascript
const entities = world.queryEntities(Position, Velocity);
for (const entity of entities) {
  const pos = world.getComponent(entity, Position);
  // Do something...
}
```

### Create a System
```javascript
class MySystem extends System {
  update(deltaTime) {
    const entities = this.queryEntities(Position, Velocity);
    for (const entity of entities) {
      // Update logic
    }
  }
}
```

### Load a Scene
```javascript
engine.loadScene('game'); // or 'demo', 'menu', etc.
```

### Save Game
```javascript
import { SaveSystem } from './engine/utils/SaveSystem.js';
const saveSystem = new SaveSystem();
saveSystem.quickSave(world);
```

### Play Sound
```javascript
import { soundGenerator } from './game/assets/assets.js';
soundGenerator.playJump();
soundGenerator.playShoot();
```

### Use Level Editor
```javascript
import { LevelEditor } from './engine/utils/LevelEditor.js';
const editor = new LevelEditor(world, canvas);
editor.setEnabled(true);
```

## 🎯 Console Commands

Open browser console (F12):
```javascript
// Access engine
window.gameEngine

// Control time
gameEngine.pause()
gameEngine.resume()
gameEngine.setTimeScale(0.5) // Slow motion

// Switch scenes
gameEngine.loadScene('demo')
gameEngine.loadScene('game')
gameEngine.loadScene('menu')

// Get systems
gameEngine.getSystem('RenderSystem')
gameEngine.getSystem('CameraSystem')
```

## 🎨 Scene Selection

Edit `game/main.js` (line ~87):
```javascript
// Choose starting scene:
engine.loadScene('menu');     // Main menu
engine.loadScene('demo');     // Advanced demo ⭐
engine.loadScene('game');     // Platformer
engine.loadScene('tutorial'); // Instructions
```

## 🔥 Performance Tips

1. Use WebGL renderer for 1000+ sprites
2. Enable object pooling for bullets/particles
3. Use spatial partitioning for collision
4. Limit particle count
5. Use sprite atlases
6. Batch render calls

## 📂 Key Files

```
Main Entry: index.html
Game Logic: game/main.js
Engine Core: engine/Engine.js
Scene Demo: game/scenes/AdvancedDemoScene.js
Assets: game/assets/assets.js
Save System: engine/utils/SaveSystem.js
Editor: engine/utils/LevelEditor.js
```

## 🆘 Troubleshooting

### Game won't load
- Check console for errors (F12)
- Ensure live-server is running
- Clear browser cache

### No sound
- Check browser audio permissions
- Sound generator uses Web Audio API
- Some browsers block autoplay

### Poor performance
- Reduce particle count
- Use WebGL renderer
- Lower entity count
- Disable trails

### Editor not working
- Call `editor.setEnabled(true)`
- Check canvas reference
- Register prefabs first

## 📚 Learn More

- `README.md` - Overview
- `ARCHITECTURE.md` - Technical details
- `FEATURES.md` - Feature showcase
- `COMPLETE_FEATURES.md` - Full guide
- `IMPLEMENTATION_SUMMARY.md` - What's new

## ✅ Feature Status

ALL FEATURES: **100% COMPLETE** ✅

- [x] Core ECS
- [x] All Components (16/16)
- [x] All Systems (14/14)
- [x] Rendering (Canvas + WebGL)
- [x] Physics & Collision
- [x] Audio System
- [x] Asset Management
- [x] Save/Load
- [x] Level Editor
- [x] Demo Scenes
- [x] Documentation

## 🎉 You're Ready!

Everything works. No placeholders. No TODOs.

**Build your game now!** 🚀

---

*Quick Reference Card - v2.0.0*
*Last Updated: November 28, 2025*
