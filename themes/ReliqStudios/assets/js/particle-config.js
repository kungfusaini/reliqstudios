// Simplified particle configuration settings
const particleConfig = {
  // Background particle settings
  background: {
    size: 4,
    spacing: 8,
    opacityMin: 0.08,
    opacityMax: 0.23,
    jitter: 0.3,
    greyMin: 80,
    greyMax: 120
  },
  
  // Chest image particle settings (simplified)
  chest: {
    // Target image size for scaling and particle calculations
    targetImageSize: 600,
    
    // Visual density settings
    sizeToSpacingRatio: 0.6,
    
    // Base particle properties
    size: 6,
    spacing: 10,
    opacity: 0.8,
    jitter: 0.5,
    alphaThreshold: 150,
    colorThreshold: 240
  }
};

// Make available globally for bundling
window.particleConfig = particleConfig;