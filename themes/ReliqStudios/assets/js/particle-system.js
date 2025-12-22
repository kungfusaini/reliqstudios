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
    this.dynamicScale = null;
    
    // Validate viewport settings
    this.validateViewportSettings();
    
    // Create hidden reference image for consistent particle sampling
    this.createReferenceImage();
    
    // Apply initial dynamic scaling
    this.applyDynamicScaling();
    this.setupImageProcessing();
    this.animate();
    this.setupDynamicResize();
  }
  
  validateViewportSettings() {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta || !viewportMeta.content.includes('width=device-width')) {
      // Particle system requires proper viewport meta tag for optimal scaling
    }
  }

  createReferenceImage() {
    this.referenceImage = new Image();
    this.referenceImage.src = this.chestImage.src;
    this.referenceImage.style.width = `${this.config.baseReferenceSize}px`;
    this.referenceImage.style.height = 'auto';
    this.referenceImage.style.visibility = 'hidden';
    this.referenceImage.style.position = 'absolute';
    this.referenceImage.style.zIndex = '-1';
    document.body.appendChild(this.referenceImage);
  }

  calculateDynamicScale() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const containerWidth = this.chestImage.parentElement.offsetWidth;
    
    // Calculate optimal image size based on viewport constraints
    const maxImageWidth = viewportWidth * this.config.maxViewportUsage;
    const minImageWidth = viewportWidth * this.config.minViewportUsage;
    const targetImageWidth = Math.min(containerWidth, maxImageWidth, this.config.baseReferenceSize);
    const finalImageWidth = Math.max(minImageWidth, targetImageWidth);
    
    // Calculate scaling factor from base reference
    const scaleFactor = finalImageWidth / this.config.baseReferenceSize;
    
    // Dynamic particle size calculation based on scale and density requirements
    const densityAdjustedSize = this.calculateOptimalParticleSize(scaleFactor);
    const densityAdjustedSpacing = densityAdjustedSize / this.config.sizeToSpacingRatio;
    
    // Calculate dynamic margins
    const margins = this.calculateDynamicMargins(scaleFactor);
    
    return {
      imageWidth: finalImageWidth,
      scaleFactor,
      particleSize: densityAdjustedSize,
      spacing: densityAdjustedSpacing,
      margins
    };
  }

  calculateOptimalParticleSize(scaleFactor) {
    const baseSize = this.config.size;
    
    // Calculate size needed to maintain particle density
    const densityAdjustedSize = baseSize * Math.sqrt(scaleFactor);
    
    // Apply viewport thresholds for gradual changes
    const minScale = this.config.viewportThresholds.particleMinScale;
    const maxScale = this.config.viewportThresholds.particleMaxScale;
    
    let finalSize = baseSize;
    
    if (scaleFactor < minScale) {
      // Scale down gradually when below minimum scale
      finalSize = baseSize * (1 - (minScale - scaleFactor) * 0.5);
    } else if (scaleFactor > maxScale) {
      // Scale up gradually when above maximum scale
      finalSize = baseSize * (1 + (scaleFactor - maxScale) * 0.3);
    } else {
      // Within range, use density-adjusted size
      finalSize = densityAdjustedSize;
    }
    
    // Constrain within functional bounds
    const constrainedSize = Math.max(
      this.config.minParticleSize,
      Math.min(this.config.maxParticleSize, finalSize)
    );
    
    return constrainedSize;
  }

  calculateDynamicMargins(scaleFactor) {
    // Calculate margins as viewport percentages, not fixed rem values
    const baseMarginVW = Math.min(15, 8 / scaleFactor); // Viewport width percentage
    const baseMarginVH = Math.min(20, 12 / scaleFactor); // Viewport height percentage
    
    return {
      marginLeft: `${baseMarginVW}vw`,
      marginTop: `${baseMarginVH}vh`
    };
  }

  applyDynamicScaling() {
    this.dynamicScale = this.calculateDynamicScale();
    
    // Apply CSS custom properties for dynamic styling
    const root = document.documentElement;
    root.style.setProperty('--chest-width', `${this.dynamicScale.imageWidth}px`);
    root.style.setProperty('--chest-margin-x', this.dynamicScale.margins.marginLeft);
    root.style.setProperty('--chest-margin-y', this.dynamicScale.margins.marginTop);
    root.style.setProperty('--chest-reference-width', `${this.config.baseReferenceSize}px`);
    
    // Update image dimensions directly
    this.chestImage.style.width = `${this.dynamicScale.imageWidth}px`;
    this.chestImage.style.marginLeft = this.dynamicScale.margins.marginLeft;
    this.chestImage.style.marginTop = this.dynamicScale.margins.marginTop;
    
    // Update config with dynamic values for particle calculations
    this.config = {
      ...window.particleConfig.chest,
      size: this.dynamicScale.particleSize,
      spacing: this.dynamicScale.spacing
    };
    
    this.resizeCanvas();
  }

  resizeCanvas() {
    const rect = this.chestImage.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    
    // Calculate display scale for particle positioning
    if (this.dynamicScale) {
      this.displayScale = rect.width / this.config.baseReferenceSize;
    }
  }
  
  setupImageProcessing() {
    // Wait for reference image to be fully loaded and processed
    if (this.referenceImage.complete) {
      this.processImageAndCreateParticles();
    } else {
      this.referenceImage.addEventListener('load', () => {
        this.processImageAndCreateParticles();
      });
      
      this.referenceImage.addEventListener('error', () => {
        // Reference image failed to load
      });
    }
  }
  
  // Public method to update particles when chest frame changes
  updateFromNewFrame() {
    if (!this.isProcessing) {
      // Update reference image source
      this.referenceImage.src = this.chestImage.src;
      this.referenceImage.onload = () => {
        this.applyDynamicScaling(); // Reapply scaling with new image
        this.processImageAndCreateParticles();
      };
    }
  }
  
  setupDynamicResize() {
    let resizeTimeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.applyDynamicScaling();
        if (!this.isProcessing) {
          this.processImageAndCreateParticles();
        }
      }, 100); // Debounced for performance
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
  }
  

  
  processImageAndCreateParticles() {
    this.isProcessing = true;
    
    // Always sample from the base reference size image
    const referenceSize = this.config.baseReferenceSize;
    const aspectRatio = this.referenceImage.naturalHeight / this.referenceImage.naturalWidth;
    const referenceHeight = referenceSize * aspectRatio;
    
    // Create temporary canvas at reference size for consistent sampling
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = referenceSize;
    tempCanvas.height = referenceHeight;
    
    // Draw the reference image at base reference size
    tempCtx.drawImage(this.referenceImage, 0, 0, referenceSize, referenceHeight);
    
    // Get image data from reference
    this.imageData = tempCtx.getImageData(0, 0, referenceSize, referenceHeight);
    
    // Create particles based on reference image
    this.createParticlesFromImage();
    this.isProcessing = false;
  }
  
  createParticlesFromImage() {
    this.particles = [];
    const data = this.imageData.data;
    const referenceWidth = this.imageData.width; // Always base reference size
    const referenceHeight = this.imageData.height;
    
    // Use integer step for pixel sampling - round to nearest integer
    const step = Math.max(1, Math.round(this.config.spacing));
    
    for (let y = 0; y < referenceHeight; y += step) {
      for (let x = 0; x < referenceWidth; x += step) {
        // Ensure integer coordinates for pixel array access
        const pixelX = Math.floor(x);
        const pixelY = Math.floor(y);
        const index = (pixelY * referenceWidth + pixelX) * 4;
        
        // Bounds check
        if (index < 0 || index >= data.length - 3) continue;
        
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];
        
        // More restrictive filtering - higher alpha threshold and darker pixels
        if (a > this.config.alphaThreshold && (r < this.config.colorThreshold || g < this.config.colorThreshold || b < this.config.colorThreshold)) {
          // Store reference coordinates but scale for display
          const displayX = pixelX * this.displayScale;
          const displayY = pixelY * this.displayScale;
          
          this.particles.push({
            x: displayX, // Scaled display position
            y: displayY, // Scaled display position
            originalX: displayX, // Original display position
            originalY: displayY,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: Math.max(2, this.config.size * this.displayScale), // Updated min size
            opacity: this.config.opacity + Math.random() * 0.2,
            color: `rgba(${r}, ${g}, ${b}, 1)`,
            jitter: Math.random() * this.config.jitter * this.displayScale
          });
        }
      }
    }
    
    // Background particles now handled by BackgroundParticleSystem
    // No need to create background particles here
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
      // Skip particles that are too small to be visible
      if (particle.size < 1) return;
      
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
    
    // Clean up reference image
    if (this.referenceImage && this.referenceImage.parentNode) {
      this.referenceImage.parentNode.removeChild(this.referenceImage);
    }
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
    canvas.style.pointerEvents = 'none'; // No interaction needed for image particles
    canvas.style.zIndex = '5'; // Above background but below content
    
    // Position canvas over the chest container
    chestContainer.appendChild(canvas);
    
    // Initialize particle system
    window.particleSystem = new ParticleSystem(canvas, chestImage);
  }
});
