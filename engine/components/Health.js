export class Health {
  constructor(maxHealth = 100) {
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this.invulnerable = false;
    this.invulnerabilityTime = 0;
    this.regeneration = 0; // HP per second
    this.onDamage = null;
    this.onDeath = null;
    this.onHeal = null;
  }

  damage(amount) {
    if (this.invulnerable) return;
    
    this.currentHealth = Math.max(0, this.currentHealth - amount);
    
    if (this.onDamage) {
      this.onDamage(amount);
    }
    
    if (this.currentHealth === 0 && this.onDeath) {
      this.onDeath();
    }
  }

  heal(amount) {
    const oldHealth = this.currentHealth;
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    
    if (this.onHeal && this.currentHealth > oldHealth) {
      this.onHeal(this.currentHealth - oldHealth);
    }
  }

  isAlive() {
    return this.currentHealth > 0;
  }

  getHealthPercent() {
    return this.currentHealth / this.maxHealth;
  }
}
