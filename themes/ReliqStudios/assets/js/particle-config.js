// Particle configuration settings
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
  
  // Chest image particle settings  
  chest: {
    // Base reference (no hardcoded pixel values)
    baseReferenceSize: 600,           // Only for aspect ratio calculation
    minParticleSize: 2,               // Minimum functional particle size (increased for visibility)
    maxParticleSize: 12,              // Maximum particle size for performance
    minViewportUsage: 0.3,            // Minimum % of viewport width
    maxViewportUsage: 0.85,           // Maximum % of viewport width
    
    // Visual quality constraints (not fixed values)
    densityTarget: 2400,              // Target particle count for optimal visual
    sizeToSpacingRatio: 0.6,         // Visual balance ratio
    
    // Thresholds for dynamic behavior (percentages, not pixels)
    viewportThresholds: {
      particleMinScale: 0.4,          // Scale down to 40% before size changes
      particleMaxScale: 1.2           // Scale up to 120% before size changes
    },
    
    // Base values for calculation only
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
