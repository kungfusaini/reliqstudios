class ParticleSystem {
  constructor(canvas, chestImage) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chestImage = chestImage;
    this.particles = [];
    this.config = window.particleConfig.chest;
    this.animationId = null;
    this.imageData = null;
    this.isProcessing = false;
    
    // Calculate scale ONCE at initialization
    this.scaleFactor = this.calculateInitialScale();
    this.particleSize = this.config.size * Math.sqrt(this.scaleFactor);
    this.spacing = this.particleSize / this.config.sizeToSpacingRatio;
    
    this.setupImageProcessing();
    this.resizeCanvas();
    this.animate();
  }

  calculateInitialScale() {
    // Scale small pixel art image to target size
    const targetImageSize = this.config.targetImageSize;
    
    // Apply scaling to make image 600px wide
    this.chestImage.style.width = `${targetImageSize}px`;
    this.chestImage.style.marginLeft = 'auto';
    this.chestImage.style.marginRight = 'auto';
    this.chestImage.style.display = 'block';
    // Apply sprite offset to canvas for centering
    this.canvas.style.setProperty('--sprite-offset-x', `${this.config.spriteOffsetX}px`);
    this.canvas.style.setProperty('--sprite-offset-y', `${this.config.spriteOffsetY}px`);    
    // Scale factor for particle sizing (always 1.0 since we use target size directly)
    return 1.0;
  }

  resizeCanvas() {
    const rect = this.chestImage.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }
  
  setupImageProcessing() {
    // Wait for image to be fully loaded
    if (this.chestImage.complete) {
      this.processImageAndCreateParticles();
    } else {
      this.chestImage.addEventListener('load', () => {
        this.processImageAndCreateParticles();
      });
      
      this.chestImage.addEventListener('error', () => {
        console.error('Failed to load chest image');
      });
    }
  }
   
  processImageAndCreateParticles() {
    this.isProcessing = true;
    
    // Create temporary canvas for image processing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Use the scaled image dimensions for processing
    const rect = this.chestImage.getBoundingClientRect();
    tempCanvas.width = rect.width;
    tempCanvas.height = rect.height;
    
    // Draw the image at current display size
    tempCtx.drawImage(this.chestImage, 0, 0, rect.width, rect.height);
    
    // Get image data
    this.imageData = tempCtx.getImageData(0, 0, rect.width, rect.height);
    
    // Create particles based on image
    this.createParticlesFromImage();
    this.isProcessing = false;
  }
  
  createParticlesFromImage() {
    this.particles = [];
    const data = this.imageData.data;
    const width = this.imageData.width;
    const height = this.imageData.height;
    
    // Use integer step for pixel sampling
    const step = Math.max(1, Math.round(this.spacing));
    
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const pixelX = Math.floor(x);
        const pixelY = Math.floor(y);
        const index = (pixelY * width + pixelX) * 4;
        
        if (index < 0 || index >= data.length - 3) continue;
        
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];
        
        // Filter for dark, visible pixels
        if (a > this.config.alphaThreshold && (r < this.config.colorThreshold || g < this.config.colorThreshold || b < this.config.colorThreshold)) {
          this.particles.push({
            x: pixelX,
            y: pixelY,
            originalX: pixelX,
            originalY: pixelY,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: Math.max(2, this.particleSize),
            opacity: this.config.opacity + Math.random() * 0.2,
            color: `rgba(${r}, ${g}, ${b}, 1)`,
            jitter: Math.random() * this.config.jitter
          });
        }
      }
    }
  }
   
  updateParticles() {
    this.particles.forEach(particle => {
      ParticlePhysics.updateParticle(particle);
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
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '5';
    
    // Position canvas over the chest container
    chestContainer.appendChild(canvas);
    
    // Initialize particle system
    window.particleSystem = new ParticleSystem(canvas, chestImage);
  }
});