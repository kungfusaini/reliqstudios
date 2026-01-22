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

  setTimeout(() => {
    showHint()
    document.addEventListener('click', handleClick)
    document.addEventListener('touchstart', handleClick)
  }, 3000)
}

// Main coordinator for particle animation and content loading
document.addEventListener('DOMContentLoaded', () => {
    console.log('Main: DOM Content Loaded - starting initialization')
    
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