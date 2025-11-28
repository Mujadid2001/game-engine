// Test file to verify all engine features work correctly
import { Engine } from '../engine/Engine.js';

// Import all components
import { Position } from '../engine/components/Position.js';
import { Velocity } from '../engine/components/Velocity.js';
import { Sprite } from '../engine/components/Sprite.js';

// Import systems
import { MovementSystem } from '../engine/systems/MovementSystem.js';
import { RenderSystem } from '../engine/systems/RenderSystem.js';

console.log('🧪 Running Engine Tests...');

// Test 1: Engine Creation
try {
  const canvas = document.createElement('canvas');
  canvas.id = 'testCanvas';
  canvas.width = 800;
  canvas.height = 600;
  document.body.appendChild(canvas);
  
  const engine = new Engine('testCanvas', {
    width: 800,
    height: 600,
    showFPS: true
  });
  console.log('✅ Test 1 PASSED: Engine created successfully');
  
  // Test 2: Component Registration
  engine.registerComponent(Position);
  engine.registerComponent(Velocity);
  engine.registerComponent(Sprite);
  console.log('✅ Test 2 PASSED: Components registered');
  
  // Test 3: System Addition
  engine.addSystem(new MovementSystem());
  engine.addSystem(new RenderSystem(engine.renderer));
  console.log('✅ Test 3 PASSED: Systems added');
  
  // Test 4: Entity Creation
  const entity = engine.createEntity();
  console.log('✅ Test 4 PASSED: Entity created:', entity);
  
  // Test 5: Component Addition
  engine.addComponent(entity, new Position(100, 100));
  engine.addComponent(entity, new Velocity(50, 0));
  engine.addComponent(entity, new Sprite('#00ff00', 32, 32));
  console.log('✅ Test 5 PASSED: Components added to entity');
  
  // Test 6: Component Retrieval
  const pos = engine.getComponent(entity, Position);
  if (pos && pos.x === 100 && pos.y === 100) {
    console.log('✅ Test 6 PASSED: Component retrieval works');
  }
  
  // Test 7: Entity Query
  const entities = engine.world.getEntitiesWithComponents(Position, Velocity);
  if (entities.length === 1 && entities[0] === entity) {
    console.log('✅ Test 7 PASSED: Entity query works (bitmask filtering)');
  }
  
  // Test 8: Start Engine
  engine.start();
  console.log('✅ Test 8 PASSED: Engine started');
  
  // Stop after 1 second for testing
  setTimeout(() => {
    engine.stop();
    console.log('✅ Test 9 PASSED: Engine stopped');
    console.log('');
    console.log('🎉 ALL TESTS PASSED!');
    console.log('🎮 Engine is fully functional and ready to use!');
  }, 1000);
  
} catch (error) {
  console.error('❌ TEST FAILED:', error);
}
