/**
 * Level Editor
 * Visual tool for creating and editing game levels
 */

import { Position } from '../components/Position.js';
import { Sprite } from '../components/Sprite.js';
import { Collider } from '../components/Collider.js';

export class LevelEditor {
  constructor(world, canvas) {
    this.world = world;
    this.canvas = canvas;
    this.enabled = false;
    this.selectedTool = 'select';
    this.selectedPrefab = null;
    this.selectedEntity = null;
    this.gridSize = 32;
    this.showGrid = true;
    this.snapToGrid = true;
    this.prefabs = new Map();
    this.clipboard = null;
    
    this.setupEventListeners();
  }

  /**
   * Enable/disable editor mode
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (enabled) {
      console.log('📝 Level Editor enabled');
      this.showEditorUI();
    } else {
      console.log('📝 Level Editor disabled');
      this.hideEditorUI();
    }
  }

  /**
   * Register a prefab for placement
   */
  registerPrefab(name, createFunction) {
    this.prefabs.set(name, createFunction);
    console.log(`✅ Prefab registered: ${name}`);
  }

  /**
   * Set current tool
   */
  setTool(tool) {
    this.selectedTool = tool;
    console.log(`🔧 Tool selected: ${tool}`);
  }

  /**
   * Setup editor event listeners
   */
  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('contextmenu', (e) => this.handleRightClick(e));
    
    document.addEventListener('keydown', (e) => {
      if (!this.enabled) return;

      switch(e.key) {
        case 'Delete':
          this.deleteSelectedEntity();
          break;
        case 'c':
          if (e.ctrlKey) this.copyEntity();
          break;
        case 'v':
          if (e.ctrlKey) this.pasteEntity();
          break;
        case 'g':
          if (e.ctrlKey) this.snapToGrid = !this.snapToGrid;
          console.log(`Grid snap: ${this.snapToGrid ? 'ON' : 'OFF'}`);
          break;
        case 'Escape':
          this.selectedEntity = null;
          break;
      }
    });
  }

  /**
   * Handle canvas click
   */
  handleClick(e) {
    if (!this.enabled) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const worldPos = this.snapToGrid ? 
      this.snapPositionToGrid(x, y) : 
      { x, y };

    switch(this.selectedTool) {
      case 'place':
        this.placePrefab(worldPos.x, worldPos.y);
        break;
      case 'select':
        this.selectEntityAt(worldPos.x, worldPos.y);
        break;
      case 'delete':
        this.deleteEntityAt(worldPos.x, worldPos.y);
        break;
    }
  }

  /**
   * Handle right-click
   */
  handleRightClick(e) {
    e.preventDefault();
    if (!this.enabled) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.selectEntityAt(x, y);
  }

  /**
   * Place a prefab at position
   */
  placePrefab(x, y) {
    if (!this.selectedPrefab) {
      console.warn('No prefab selected');
      return;
    }

    const createFn = this.prefabs.get(this.selectedPrefab);
    if (!createFn) {
      console.warn(`Prefab not found: ${this.selectedPrefab}`);
      return;
    }

    const entity = createFn(this.world, x, y);
    console.log(`✨ Placed ${this.selectedPrefab} at (${x}, ${y})`);
    return entity;
  }

  /**
   * Select entity at position
   */
  selectEntityAt(x, y) {
    const entities = this.world.queryEntities(Position);

    for (const entity of entities) {
      const pos = this.world.getComponent(entity, Position);
      const collider = this.world.getComponent(entity, Collider);
      const sprite = this.world.getComponent(entity, Sprite);

      let width = 32, height = 32;
      if (collider) {
        width = collider.width;
        height = collider.height;
      } else if (sprite) {
        width = sprite.width;
        height = sprite.height;
      }

      if (x >= pos.x && x <= pos.x + width &&
          y >= pos.y && y <= pos.y + height) {
        this.selectedEntity = entity;
        console.log(`🎯 Selected entity: ${entity}`);
        return entity;
      }
    }

    this.selectedEntity = null;
    return null;
  }

  /**
   * Delete entity at position
   */
  deleteEntityAt(x, y) {
    const entity = this.selectEntityAt(x, y);
    if (entity !== null) {
      this.world.destroyEntity(entity);
      this.selectedEntity = null;
      console.log(`🗑️ Deleted entity: ${entity}`);
    }
  }

  /**
   * Delete selected entity
   */
  deleteSelectedEntity() {
    if (this.selectedEntity !== null) {
      this.world.destroyEntity(this.selectedEntity);
      console.log(`🗑️ Deleted selected entity: ${this.selectedEntity}`);
      this.selectedEntity = null;
    }
  }

  /**
   * Copy selected entity
   */
  copyEntity() {
    if (this.selectedEntity === null) return;

    this.clipboard = {
      components: []
    };

    // Copy all components
    const mask = this.world.entityManager.getComponentMask(this.selectedEntity);
    const types = this.world.componentManager.getAllComponentTypes();

    for (const [typeName, typeId] of types.entries()) {
      if ((mask & (1 << typeId)) !== 0) {
        const component = this.world.getComponent(this.selectedEntity, typeName);
        if (component) {
          this.clipboard.components.push({
            type: typeName,
            data: { ...component }
          });
        }
      }
    }

    console.log(`📋 Copied entity: ${this.selectedEntity}`);
  }

  /**
   * Paste entity from clipboard
   */
  pasteEntity() {
    if (!this.clipboard) {
      console.warn('Clipboard is empty');
      return;
    }

    const newEntity = this.world.createEntity();

    for (const compData of this.clipboard.components) {
      // Would need component registry to reconstruct
      console.log(`Pasting component: ${compData.type}`);
    }

    console.log(`📋 Pasted entity: ${newEntity}`);
    return newEntity;
  }

  /**
   * Snap position to grid
   */
  snapPositionToGrid(x, y) {
    return {
      x: Math.floor(x / this.gridSize) * this.gridSize,
      y: Math.floor(y / this.gridSize) * this.gridSize
    };
  }

  /**
   * Export level as JSON
   */
  exportLevel() {
    const levelData = {
      version: '1.0',
      gridSize: this.gridSize,
      entities: []
    };

    const entities = this.world.getAllEntities();
    for (const entity of entities) {
      const entityData = {
        id: entity,
        components: []
      };

      const mask = this.world.entityManager.getComponentMask(entity);
      const types = this.world.componentManager.getAllComponentTypes();

      for (const [typeName, typeId] of types.entries()) {
        if ((mask & (1 << typeId)) !== 0) {
          const component = this.world.getComponent(entity, typeName);
          if (component) {
            entityData.components.push({
              type: typeName,
              data: this.serializeComponent(component)
            });
          }
        }
      }

      levelData.entities.push(entityData);
    }

    const json = JSON.stringify(levelData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `level_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('💾 Level exported');
  }

  /**
   * Import level from JSON
   */
  async importLevel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const levelData = JSON.parse(e.target.result);
          this.loadLevel(levelData);
          resolve(levelData);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * Load level data
   */
  loadLevel(levelData) {
    this.world.clear();
    this.gridSize = levelData.gridSize || 32;

    for (const entityData of levelData.entities) {
      const entity = this.world.createEntity();

      for (const compData of entityData.components) {
        // Would need component registry
        console.log(`Loading component: ${compData.type}`);
      }
    }

    console.log('📂 Level loaded');
  }

  /**
   * Render editor overlay
   */
  render(renderer) {
    if (!this.enabled) return;

    const ctx = renderer.ctx || renderer.getContext();
    if (!ctx) return;

    // Draw grid
    if (this.showGrid) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      for (let x = 0; x < this.canvas.width; x += this.gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < this.canvas.height; y += this.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.canvas.width, y);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Highlight selected entity
    if (this.selectedEntity !== null) {
      const pos = this.world.getComponent(this.selectedEntity, Position);
      if (pos) {
        const sprite = this.world.getComponent(this.selectedEntity, Sprite);
        const collider = this.world.getComponent(this.selectedEntity, Collider);

        let width = 32, height = 32;
        if (collider) {
          width = collider.width;
          height = collider.height;
        } else if (sprite) {
          width = sprite.width;
          height = sprite.height;
        }

        ctx.save();
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(pos.x, pos.y, width, height);
        ctx.restore();
      }
    }

    // Draw tool info
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 100);
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`Tool: ${this.selectedTool}`, 20, 30);
    ctx.fillText(`Grid: ${this.snapToGrid ? 'ON' : 'OFF'} (Ctrl+G)`, 20, 50);
    ctx.fillText(`Prefab: ${this.selectedPrefab || 'None'}`, 20, 70);
    ctx.fillText(`Selected: ${this.selectedEntity || 'None'}`, 20, 90);
    ctx.restore();
  }

  /**
   * Serialize component
   */
  serializeComponent(component) {
    const data = {};
    for (const key in component) {
      if (component.hasOwnProperty(key)) {
        const value = component[key];
        if (typeof value !== 'function' && 
            !(value instanceof Image) &&
            !(value instanceof HTMLElement)) {
          data[key] = value;
        }
      }
    }
    return data;
  }

  /**
   * Show editor UI
   */
  showEditorUI() {
    // Would create DOM elements for editor controls
    console.log('🎨 Editor UI shown');
  }

  /**
   * Hide editor UI
   */
  hideEditorUI() {
    console.log('🎨 Editor UI hidden');
  }
}
