class ParticleSystem {
  constructor(canvas, chestImage) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chestImage = chestImage;
    this.particles = [];
    this.particleCount = 6000;
    this.animationId = null;
    this.imageData = null;
    this.isProcessing = false;
    
    this.resizeCanvas();
    this.setupImageProcessing();
    this.animate();
    this.setupEventListeners();
  }
  
  resizeCanvas() {
    const rect = this.chestImage.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }
  
  setupImageProcessing() {
    // Wait for image to be fully loaded and processed
    if (this.chestImage.complete) {
      this.processImageAndCreateParticles();
    } else {
      this.chestImage.addEventListener('load', () => {
        this.processImageAndCreateParticles();
      });
    }
  }
  
  // Public method to update particles when chest frame changes
  updateFromNewFrame() {
    if (!this.isProcessing) {
      this.processImageAndCreateParticles();
    }
  }
  
  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      if (!this.isProcessing) {
        this.processImageAndCreateParticles();
      }
    });
  }
  
  init() {
    this.resizeCanvas();
    
    // Wait for image to be fully loaded and processed
    if (this.chestImage.complete) {
      this.processImageAndCreateParticles();
    } else {
      this.chestImage.addEventListener('load', () => {
        this.processImageAndCreateParticles();
      });
    }
    
    this.animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      if (!this.isProcessing) {
        this.processImageAndCreateParticles();
      }
    });
  }
  
  processImageAndCreateParticles() {
    this.isProcessing = true;
    
    // Create temporary canvas to read image data
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    
    // Draw the chest image to temp canvas
    tempCtx.drawImage(this.chestImage, 0, 0, this.canvas.width, this.canvas.height);
    
    // Get image data
    this.imageData = tempCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Create particles based on the image
    this.createParticlesFromImage();
    this.isProcessing = false;
  }
  
  createParticlesFromImage() {
    this.particles = [];
    const data = this.imageData.data;
    const width = this.imageData.width;
    const height = this.imageData.height;
    
    // Sample pixels to create particles - structured dot matrix
    const step = Math.max(3, Math.floor(Math.sqrt((width * height) / this.particleCount)));
    
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];
        
        // More restrictive filtering - higher alpha threshold and darker pixels
        if (a > 150 && (r < 240 || g < 240 || b < 240)) {
          this.particles.push({
            x: x, // Fixed position for dot matrix
            y: y, // Fixed position for dot matrix
            originalX: x,
            originalY: y,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 1 + 3,
            opacity: 0.8 + Math.random() * 0.2,
            color: `rgba(${r}, ${g}, ${b}, 1)`,
            jitter: Math.random() * 0.5
          });
        }
      }
    }
  }
  
  updateParticles() {
    this.particles.forEach(particle => {
      // Spring force to return to original position
      const dx = particle.originalX - particle.x;
      const dy = particle.originalY - particle.y;
      
      particle.vx += dx * 0.02; // Spring strength
      particle.vy += dy * 0.02;
      
      // Damping
      particle.vx *= 0.95;
      particle.vy *= 0.95;
      
      // Add subtle jittering
      particle.x += particle.vx + (Math.random() - 0.5) * particle.jitter;
      particle.y += particle.vy + (Math.random() - 0.5) * particle.jitter;
      
      // Subtle opacity pulsing
      particle.opacity += (Math.random() - 0.5) * 0.01;
      particle.opacity = Math.max(0.6, Math.min(1, particle.opacity));
    });
  }
  
  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Set particle color from original image pixel
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

// Initialize when DOM is ready and after chest animation is set up
document.addEventListener('DOMContentLoaded', () => {
  const chestImage = document.querySelector('.chest-image');
  const chestContainer = document.querySelector('.chest-container');
  
  if (chestImage && chestContainer) {
    // Set up container for canvas overlay
    chestContainer.style.position = 'relative';
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'auto'; // Allow interaction
    canvas.style.zIndex = '10';
    
    // Position canvas over the chest container
    chestContainer.appendChild(canvas);
    
    // Initialize particle system
    window.particleSystem = new ParticleSystem(canvas, chestImage);
  }
});
