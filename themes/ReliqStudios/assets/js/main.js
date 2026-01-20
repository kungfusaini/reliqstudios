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
});