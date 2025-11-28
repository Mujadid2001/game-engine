export class ParticleEmitter {
  constructor() {
    this.particles = [];
    this.maxParticles = 100;
    this.emissionRate = 10; // particles per second
    this.emissionTimer = 0;
    this.lifetime = 1;
    this.lifetimeVariance = 0.2;
    this.speed = 100;
    this.speedVariance = 50;
    this.angle = 0;
    this.angleVariance = Math.PI * 2;
    this.size = 5;
    this.sizeVariance = 2;
    this.color = '#ffffff';
    this.endColor = null;
    this.gravity = 0;
    this.active = true;
    this.burst = false; // One-shot emission
    this.burstCount = 50;
  }

  emit(count = 1) {
    for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const angle = this.angle + (Math.random() - 0.5) * this.angleVariance;
    const speed = this.speed + (Math.random() - 0.5) * this.speedVariance;
    
    return {
      x: 0,
      y: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: this.lifetime + (Math.random() - 0.5) * this.lifetimeVariance,
      maxLife: this.lifetime,
      size: this.size + (Math.random() - 0.5) * this.sizeVariance,
      alpha: 1
    };
  }
}
