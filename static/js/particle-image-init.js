import '/vendor/reliq-enhanced-particle-image/src/index.js'

const initParticleImage = () => {
  if (window.particleImageInitialized) {
    return
  }

  if (typeof window.particleImageDisplay !== 'function') {
    console.warn('Particle image library not loaded')
    return
  }

  window.particleImageDisplay('particle-image')
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParticleImage)
} else {
  initParticleImage()
}
