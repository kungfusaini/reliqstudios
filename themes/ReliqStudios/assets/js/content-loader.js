const ContentLoader = function() {
  'use strict'
  
  const config = {
    contentSelector: '#main-content',
    particleContainerSelector: '#particle-image',
    fadeOutDuration: 800,
    fadeInDuration: 600
  }
  
  let contentElement = null
  let particleContainer = null
  
  const init = function() {
    contentElement = document.querySelector(config.contentSelector)
    particleContainer = document.querySelector(config.particleContainerSelector)
    
    if (!contentElement) {
      return
    }
    
    // Initially hide content and ensure it's positioned properly
    contentElement.style.opacity = '0'
    contentElement.style.visibility = 'hidden'
    contentElement.style.transition = `opacity ${config.fadeInDuration}ms ease-in-out, visibility ${config.fadeInDuration}ms ease-in-out`
    
    // Listen for particle animation completion
    document.addEventListener('particleAnimationComplete', handleParticleAnimationComplete)
  }
  
  const handleParticleAnimationComplete = function(event) {
    // Small delay to ensure particles are fully cleared
    setTimeout(() => {
      showContent()
      cleanupParticleSystem()
    }, 100)
  }
  
  const showContent = function() {
    if (!contentElement) {
      return
    }
    
    // Show the main content with fade-in effect
    contentElement.style.visibility = 'visible'
    contentElement.style.opacity = '1'
  }
  
  const cleanupParticleSystem = function() {
    if (particleContainer) {
      // Keep the particle container for background particles - do not remove
    }
  }
  
  // Public API
  return {
    init: init,
    showContent: showContent,
    cleanupParticleSystem: cleanupParticleSystem,
    test: function() {
      showContent()
      cleanupParticleSystem()
    }
  }
}()