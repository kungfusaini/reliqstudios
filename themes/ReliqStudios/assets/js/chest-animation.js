class ChestAnimation {
  constructor(container, imageElement) {
    this.container = container;
    this.imageElement = imageElement;
    this.frames = ['tile000', 'tile001', 'tile002', 'tile003'];
    this.currentFrame = 0;
    this.direction = 1; // 1 for forward, -1 for reverse
    this.frameDelay = 200; // milliseconds between frames
    this.interval = null;
    
    this.init();
  }
  
  init() {
    this.startAnimation();
  }
  
  startAnimation() {
    this.interval = setInterval(() => {
      this.nextFrame();
    }, this.frameDelay);
  }
  
  nextFrame() {
    // Update frame index
    this.currentFrame += this.direction;
    
    // Reverse direction at endpoints
    if (this.currentFrame >= this.frames.length - 1) {
      this.currentFrame = this.frames.length - 1;
      this.direction = -1;
    } else if (this.currentFrame <= 0) {
      this.currentFrame = 0;
      this.direction = 1;
    }
    
    // Update image source
    this.imageElement.src = `/chest/${this.frames[this.currentFrame]}.png`;
    
    // Notify particle system to update
    if (window.particleSystem) {
      setTimeout(() => {
        window.particleSystem.updateFromNewFrame();
      }, 50); // Small delay to ensure image loads
    }
  }
  
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  getCurrentFrame() {
    return this.frames[this.currentFrame];
  }
}

// Animation disabled - using static test image
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const chestContainer = document.querySelector('.chest-container');
  const chestImage = document.querySelector('.chest-image');
  
  if (chestContainer && chestImage) {
    // Animation disabled - using static test image
    // window.chestAnimation = new ChestAnimation(chestContainer, chestImage);
  }
});