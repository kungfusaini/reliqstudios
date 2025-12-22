// Test configurations for density adaptive particle system
const testConfigs = [
  {
    name: "Very Low Density",
    maxParticles: 20,
    description: "Testing minimum particle count - should create very large particles"
  },
  {
    name: "Low Density", 
    maxParticles: 100,
    description: "Current setting - should create medium-large particles"
  },
  {
    name: "Medium Density",
    maxParticles: 1000,
    description: "Should create medium particles"
  },
  {
    name: "High Density",
    maxParticles: 5000,
    description: "Should create small particles"
  },
  {
    name: "Very High Density",
    maxParticles: 15000,
    description: "Testing performance limit - should create very small particles"
  }
];

// Export for testing
window.particleTestConfigs = testConfigs;
console.log("Density adaptive test configurations loaded:", testConfigs);