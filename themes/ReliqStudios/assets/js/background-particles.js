class BackgroundParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.config = window.particleConfig.background;
    this.animationId = null;
    
    this.resizeCanvas();
    this.createBackgroundParticles();
    this.animate();
  }
   
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
  }
   
  createBackgroundParticles() {
    this.particles = [];
    
    // Auto-calculate based on viewport and spacing
    const step = this.config.spacing;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        this.particles.push({
          x: x, // Fixed position for dot matrix
          y: y, // Fixed position for dot matrix
          originalX: x,
          originalY: y,
          vx: 0, // No initial velocity
          vy: 0, // No initial velocity
          size: this.config.size + Math.random() * 1, // Slight size variation
          opacity: this.config.opacityMin + Math.random() * (this.config.opacityMax - this.config.opacityMin),
          color: this.getRandomGreyColor(),
          jitter: Math.random() * this.config.jitter
        });
      }
    }
  }
   
  getRandomGreyColor() {
    const grey = Math.floor(this.config.greyMin + Math.random() * (this.config.greyMax - this.config.greyMin));
    return `rgba(${grey}, ${grey}, ${grey}, 1)`;
  }
   
  updateParticles() {
    this.particles.forEach(particle => {
      ParticlePhysics.updateBackgroundParticle(particle);
    });
  }
   
  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      ParticlePhysics.drawParticle(this.ctx, particle);
    });
  }
   
  animate() {
    this.updateParticles();
    this.drawParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
   
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  
  if (body) {
    // Create canvas element for background particles
    const canvas = document.createElement('canvas');
    canvas.className = 'background-particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1'; // Behind everything
    
    // Add canvas to body
    body.appendChild(canvas);
    
    // Initialize background particle system
    window.backgroundParticleSystem = new BackgroundParticleSystem(canvas);
  }
});