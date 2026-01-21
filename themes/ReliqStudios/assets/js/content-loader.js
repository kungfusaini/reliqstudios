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
    
    console.log('ContentLoader: Initializing...')
    console.log('ContentLoader: Looking for content element:', config.contentSelector)
    console.log('ContentLoader: Content element found:', !!contentElement)
    console.log('ContentLoader: Looking for particle container:', config.particleContainerSelector)
    console.log('ContentLoader: Particle container found:', !!particleContainer)
    
    if (!contentElement) {
      console.error('ContentLoader: Content element not found:', config.contentSelector)
      return
    }
    
    // Initially hide content and ensure it's positioned properly
    contentElement.style.opacity = '0'
    contentElement.style.visibility = 'hidden'
    contentElement.style.transition = `opacity ${config.fadeInDuration}ms ease-in-out, visibility ${config.fadeInDuration}ms ease-in-out`
    
    console.log('ContentLoader: Content element styles set - opacity:', contentElement.style.opacity, 'visibility:', contentElement.style.visibility)
    
    // Listen for particle animation completion
    document.addEventListener('particleAnimationComplete', handleParticleAnimationComplete)
    console.log('ContentLoader: Event listener added for particleAnimationComplete')
    
    // Add fallback timeout in case particle animation doesn't trigger
    setTimeout(() => {
      console.log('ContentLoader: Fallback triggered - showing content after timeout')
      if (contentElement.style.visibility === 'hidden') {
        console.log('ContentLoader: Content still hidden, forcing show')
        showContent()
        cleanupParticleSystem()
      }
    }, 10000) // 10 second fallback
  }
  
  const handleParticleAnimationComplete = function(event) {
    console.log('ContentLoader: Particle animation completed', event.detail)
    
    // Small delay to ensure particles are fully cleared
    setTimeout(() => {
      console.log('ContentLoader: About to show content')
      showContent()
      cleanupParticleSystem()
    }, 100)
  }
  
  const showContent = function() {
    if (!contentElement) {
      console.error('ContentLoader: Content element not found!')
      return
    }
    
    console.log('ContentLoader: Found content element:', contentElement)
    console.log('ContentLoader: Current styles - opacity:', contentElement.style.opacity, 'visibility:', contentElement.style.visibility)
    
    // Show the main content with fade-in effect
    contentElement.style.visibility = 'visible'
    contentElement.style.opacity = '1'
    
    console.log('ContentLoader: Applied styles - opacity:', contentElement.style.opacity, 'visibility:', contentElement.style.visibility)
    console.log('ContentLoader: Main content revealed')
  }
  
  const cleanupParticleSystem = function() {
    if (particleContainer) {
      // Keep the particle container for background particles - do not remove
      console.log('ContentLoader: Keeping particle system for background particles')
    }
  }
  
  // Public API
  return {
    init: init,
    showContent: showContent,
    cleanupParticleSystem: cleanupParticleSystem,
    test: function() {
      console.log('ContentLoader: Manual test triggered')
      showContent()
      cleanupParticleSystem()
    }
  }
}()