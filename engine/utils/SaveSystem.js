/**
 * Save System
 * Handles saving and loading game state to/from localStorage
 */

export class SaveSystem {
  constructor(saveKey = 'gameState') {
    this.saveKey = saveKey;
    this.maxSlots = 3;
  }

  /**
   * Save the current world state
   */
  saveWorld(world, slotNumber = 0, metadata = {}) {
    const saveData = {
      timestamp: Date.now(),
      slotNumber,
      metadata,
      entities: []
    };

    // Serialize all entities and their components
    for (const entity of world.getAllEntities()) {
      const entityData = {
        id: entity,
        components: []
      };

      // Get all components for this entity
      const componentMask = world.entityManager.getComponentMask(entity);
      const componentTypes = world.componentManager.getAllComponentTypes();

      for (const [typeName, typeId] of componentTypes.entries()) {
        if ((componentMask & (1 << typeId)) !== 0) {
          const component = world.getComponent(entity, typeName);
          if (component) {
            entityData.components.push({
              type: typeName,
              data: this.serializeComponent(component)
            });
          }
        }
      }

      saveData.entities.push(entityData);
    }

    // Save to localStorage
    const key = `${this.saveKey}_slot${slotNumber}`;
    localStorage.setItem(key, JSON.stringify(saveData));

    console.log(`✅ Game saved to slot ${slotNumber}`);
    return saveData;
  }

  /**
   * Load a saved world state
   */
  loadWorld(world, slotNumber = 0) {
    const key = `${this.saveKey}_slot${slotNumber}`;
    const savedData = localStorage.getItem(key);

    if (!savedData) {
      console.warn(`No save data found in slot ${slotNumber}`);
      return null;
    }

    const saveData = JSON.parse(savedData);

    // Clear current world
    world.clear();

    // Recreate entities with their components
    const entityIdMap = new Map();

    for (const entityData of saveData.entities) {
      const newEntity = world.createEntity();
      entityIdMap.set(entityData.id, newEntity);

      for (const componentData of entityData.components) {
        const ComponentClass = this.getComponentClass(componentData.type);
        if (ComponentClass) {
          const component = new ComponentClass();
          this.deserializeComponent(component, componentData.data);
          world.addComponent(newEntity, component);
        }
      }
    }

    console.log(`✅ Game loaded from slot ${slotNumber}`);
    return saveData;
  }

  /**
   * Get all available save slots
   */
  getSaveSlots() {
    const slots = [];

    for (let i = 0; i < this.maxSlots; i++) {
      const key = `${this.saveKey}_slot${i}`;
      const data = localStorage.getItem(key);
      
      if (data) {
        try {
          const saveData = JSON.parse(data);
          slots.push({
            slotNumber: i,
            timestamp: saveData.timestamp,
            metadata: saveData.metadata,
            exists: true
          });
        } catch (e) {
          slots.push({ slotNumber: i, exists: false });
        }
      } else {
        slots.push({ slotNumber: i, exists: false });
      }
    }

    return slots;
  }

  /**
   * Delete a save slot
   */
  deleteSave(slotNumber) {
    const key = `${this.saveKey}_slot${slotNumber}`;
    localStorage.removeItem(key);
    console.log(`🗑️ Save slot ${slotNumber} deleted`);
  }

  /**
   * Export save data as JSON file
   */
  exportSave(slotNumber) {
    const key = `${this.saveKey}_slot${slotNumber}`;
    const data = localStorage.getItem(key);
    
    if (!data) {
      console.warn('No save data to export');
      return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `save_slot${slotNumber}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Import save data from JSON file
   */
  async importSave(file, slotNumber) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const key = `${this.saveKey}_slot${slotNumber}`;
          localStorage.setItem(key, data);
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * Serialize component data
   */
  serializeComponent(component) {
    const data = {};
    
    for (const key in component) {
      if (component.hasOwnProperty(key)) {
        const value = component[key];
        
        // Skip non-serializable properties
        if (typeof value === 'function') continue;
        if (value instanceof Image) continue;
        if (value instanceof HTMLElement) continue;
        
        data[key] = value;
      }
    }
    
    return data;
  }

  /**
   * Deserialize component data
   */
  deserializeComponent(component, data) {
    for (const key in data) {
      if (data.hasOwnProperty(key) && component.hasOwnProperty(key)) {
        component[key] = data[key];
      }
    }
  }

  /**
   * Get component class by name
   * This is a simplified version - in production you'd have a registry
   */
  getComponentClass(typeName) {
    // Would need to import all components here or use a registry
    // For now, returning null - implement based on your component structure
    console.warn(`Component type ${typeName} not registered in SaveSystem`);
    return null;
  }

  /**
   * Quick save/load (slot 0)
   */
  quickSave(world, metadata = {}) {
    return this.saveWorld(world, 0, { ...metadata, quickSave: true });
  }

  quickLoad(world) {
    return this.loadWorld(world, 0);
  }

  /**
   * Auto-save functionality
   */
  enableAutoSave(world, intervalMs = 60000) {
    this.autoSaveInterval = setInterval(() => {
      this.quickSave(world, { autoSave: true });
      console.log('💾 Auto-saved');
    }, intervalMs);
  }

  disableAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }
}
