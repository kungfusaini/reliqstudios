// Hint overlay functionality
const createHint = () => {
  const hint = document.createElement('div')
  hint.className = 'hint-overlay'
  hint.id = 'hint-overlay'
  document.body.appendChild(hint)

  const isMobile = window.matchMedia('(max-width: 684px)').matches
  hint.textContent = isMobile ? 'Tap to Open' : 'Click to Open'

  const showHint = () => {
    hint.classList.add('visible')
  }

  const hideHint = () => {
    hint.classList.remove('visible')
    setTimeout(() => {
      if (hint.parentNode) {
        hint.parentNode.removeChild(hint)
      }
    }, 500)
  }

  const handleClick = () => {
    hideHint()
    document.removeEventListener('click', handleClick)
    document.removeEventListener('touchstart', handleClick)
  }

  // Track if user has clicked before hint appears
  let userInteracted = false

  const earlyClickHandler = (e) => {
    userInteracted = true
    document.removeEventListener('click', earlyClickHandler)
    document.removeEventListener('touchstart', earlyClickHandler)
  }

  document.addEventListener('click', earlyClickHandler)
  document.addEventListener('touchstart', earlyClickHandler)

  setTimeout(() => {
    document.removeEventListener('click', earlyClickHandler)
    document.removeEventListener('touchstart', earlyClickHandler)

    if (!userInteracted) {
      showHint()
      document.addEventListener('click', handleClick)
      document.addEventListener('touchstart', handleClick)
    } else {
      if (hint.parentNode) {
        hint.parentNode.removeChild(hint)
      }
    }
  }, 3000)
}

// Fade-in animation handler
const initFadeInAnimations = () => {
  // Fade in header immediately
  const header = document.querySelector('.header')
  if (header) {
    setTimeout(() => {
      header.classList.add('fade-in')
    }, 100)
  }

  // Fade in footer immediately (with slight delay)
  const footer = document.querySelector('.footer')
  if (footer) {
    setTimeout(() => {
      footer.classList.add('fade-in')
    }, 200)
  }

  // Fade in particles once they're ready
  const particleCanvas = document.getElementById('particle-image')
  if (particleCanvas) {
    // Listen for particle initialization event
    const startParticleFadeIn = () => {
      particleCanvas.classList.add('fade-in')
    }

    // Check if particles already started, otherwise listen for the event
    if (window.particleImageDisplayerReady) {
      startParticleFadeIn()
    } else {
      document.addEventListener('particleImageReady', startParticleFadeIn)
      // Fallback: fade in after a reasonable timeout if event never fires
      setTimeout(startParticleFadeIn, 2000)
    }
  }
}

// Main coordinator for particle animation and content loading
document.addEventListener('DOMContentLoaded', () => {
    console.log('Main: DOM Content Loaded - starting initialization')

    // Initialize fade-in animations
    initFadeInAnimations()

    // Initialize the content loader first
    console.log('Main: Checking ContentLoader availability...')
    if (typeof ContentLoader !== 'undefined') {
        console.log('Main: ContentLoader found, initializing...')
        ContentLoader.init()
    } else {
        console.warn('ContentLoader not found - content may not appear after animation')
    }

    // Particle system initializes automatically via the data-params-src attribute
    console.log('Main: Systems initialized - particle animation running')

    // Initialize hint overlay
    createHint()
});