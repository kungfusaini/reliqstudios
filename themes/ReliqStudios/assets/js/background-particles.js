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
    this.setupEventListeners();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
  }
  
  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createBackgroundParticles(); // Recreate particles for new dimensions
    });
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
      // Spring force to return to original position
      const dx = particle.originalX - particle.x;
      const dy = particle.originalY - particle.y;
      
      particle.vx += dx * 0.005; // Even weaker spring
      particle.vy += dy * 0.005;
      
      // Stronger damping
      particle.vx *= 0.92;
      particle.vy *= 0.92;
      
      // Much gentler jittering
      particle.x += particle.vx + (Math.random() - 0.5) * particle.jitter;
      particle.y += particle.vy + (Math.random() - 0.5) * particle.jitter;
      
      // Very subtle opacity pulsing
      particle.opacity += (Math.random() - 0.5) * 0.002;
      particle.opacity = Math.max(0.05, Math.min(0.3, particle.opacity));
    });
  }
  
  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Set particle color with opacity
      this.ctx.fillStyle = particle.color.replace('1)', `${particle.opacity})`);
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
      this.ctx.fill();
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
    window.removeEventListener('resize', this.resizeCanvas);
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