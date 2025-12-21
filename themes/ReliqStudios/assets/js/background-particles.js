class BackgroundParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 1500; // Background particles count
    this.particleSize = 3; // Small particle size
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
    
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        originalX: Math.random() * this.canvas.width,
        originalY: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3, // Gentle movement
        vy: (Math.random() - 0.5) * 0.3,
        size: this.particleSize + Math.random() * 2, // Slight size variation
        opacity: 0.2 + Math.random() * 0.3, // Low opacity for subtle effect
        color: this.getRandomGreyColor(),
        jitter: Math.random() * 0.5
      });
    }
  }
  
  getRandomGreyColor() {
    const grey = Math.floor(80 + Math.random() * 40); // Range 80-120
    return `rgba(${grey}, ${grey}, ${grey}, 1)`;
  }
  
  updateParticles() {
    this.particles.forEach(particle => {
      // Spring force to return to original position
      const dx = particle.originalX - particle.x;
      const dy = particle.originalY - particle.y;
      
      particle.vx += dx * 0.01; // Weaker spring for more floaty effect
      particle.vy += dy * 0.01;
      
      // Damping
      particle.vx *= 0.96;
      particle.vy *= 0.96;
      
      // Add gentle jittering
      particle.x += particle.vx + (Math.random() - 0.5) * particle.jitter;
      particle.y += particle.vy + (Math.random() - 0.5) * particle.jitter;
      
      // Subtle opacity pulsing
      particle.opacity += (Math.random() - 0.5) * 0.005;
      particle.opacity = Math.max(0.1, Math.min(0.6, particle.opacity));
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