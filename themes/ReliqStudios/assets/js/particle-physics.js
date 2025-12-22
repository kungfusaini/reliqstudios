// Shared particle physics and rendering logic
class ParticlePhysics {
  static updateParticle(particle, springStrength = 0.02, damping = 0.95) {
    const dx = particle.originalX - particle.x;
    const dy = particle.originalY - particle.y;
    
    particle.vx += dx * springStrength;
    particle.vy += dy * springStrength;
    particle.vx *= damping;
    particle.vy *= damping;
    
    particle.x += particle.vx + (Math.random() - 0.5) * particle.jitter;
    particle.y += particle.vy + (Math.random() - 0.5) * particle.jitter;
    
    this.updateOpacity(particle);
  }
  
  static updateOpacity(particle, minOpacity = 0.6, maxOpacity = 1, pulseRate = 0.01) {
    particle.opacity += (Math.random() - 0.5) * pulseRate;
    particle.opacity = Math.max(minOpacity, Math.min(maxOpacity, particle.opacity));
  }
  
  static drawParticle(ctx, particle) {
    if (particle.size < 1) return;
    ctx.fillStyle = particle.color.replace('1)', `${particle.opacity})`);
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  static updateBackgroundParticle(particle, springStrength = 0.005, damping = 0.92) {
    const dx = particle.originalX - particle.x;
    const dy = particle.originalY - particle.y;
    
    particle.vx += dx * springStrength;
    particle.vy += dy * springStrength;
    particle.vx *= damping;
    particle.vy *= damping;
    
    particle.x += particle.vx + (Math.random() - 0.5) * particle.jitter;
    particle.y += particle.vy + (Math.random() - 0.5) * particle.jitter;
    
    // More subtle opacity for background particles
    particle.opacity += (Math.random() - 0.5) * 0.002;
    particle.opacity = Math.max(0.05, Math.min(0.3, particle.opacity));
  }
}