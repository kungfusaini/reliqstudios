# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in the Reliq Studios Hugo codebase.

## Project Overview

This is a Hugo static site generator project with a custom "ReliqStudios" theme. The site features an interactive particle system, responsive design, and modern web development practices.

**Technology Stack:**
- Hugo v0.40+ (Static Site Generator)
- JavaScript (ES6+) with advanced particle animation system
- SCSS with modular architecture
- Docker deployment with nginx reverse proxy
- ESLint with Airbnb + Prettier configuration

## Build & Development Commands

 NEVER BUILD OR RUN THE SERVER THE USER WILL DO THAT

## Code Style Guidelines

### JavaScript (ESLint Configuration)

**Base Style:** Airbnb JavaScript Style Guide with Prettier integration

**Key Rules:**
- No semicolons (`semi: never`)
- Single quotes (`quotes: single`)
- Arrow functions with parens as needed (`arrow-parens: as-needed`)
- Comma dangle on multiline (`comma-dangle: always-multiline`)
- Underscore dangle allowed (`no-underscore-dangle: 0`)
- Template literals allowed in quotes

**Global Variables Available:**
- `document`, `window`, `self`, `fetch`, `Headers`
- `requestAnimationFrame` (for animations)

**Code Patterns:**
```javascript
// Use modern ES6+ features
document.addEventListener('DOMContentLoaded', () => {
    // DOM-ready code here
})

// Defensive programming with null checks
if (element && element.classList) {
    element.classList.add('active')
}

// Performance optimizations
requestAnimationFrame(() => {
    // Animation frame code
})

// Module pattern with IIFE
(() => {
    // Module code here
})()
```

### SCSS Architecture

**Import Order (from main.scss):**
1. Normalize/reset styles
2. Syntax highlighting (prism)
3. Icon libraries (flag-icons)
4. Variables and mixins
5. Base styles (fonts, buttons)
6. Layout modules (header, logo, menu, etc.)
7. Component-specific styles
8. Particle system (last)

**Naming Conventions:**
- Use kebab-case for file names (`_header.scss`, `_main.scss`)
- CSS custom properties for dynamic values (`--phoneWidth`)
- BEM-like naming for utility classes

**Color Scheme Variables:**
```scss
$background: #fbf1c7;
$background-secondary: #e4d8b1;
$color: #3c3836;
$color-variant: #282828;
$color-secondary: #665c54;
$border-color: #d5c4a1;
```

**Responsive Breakpoints:**
```scss
$media-size-phone: "(max-width: 684px)";
$media-size-tablet: "(max-width: 900px)";
```

### Hugo Template Conventions

**Configuration:**
- TOML format for `hugo.toml`
- Front matter in TOML format
- Base URL: "https://reliqstudios.com"
- Language: en-us

**Content Structure:**
- Content in `content/` directory with Markdown files
- Static assets in `static/` directory
- Theme files in `themes/ReliqStudios/`

**Asset Pipeline:**
```html
<!-- Hugo asset bundling example -->
{{ $secureJS := slice $main $particleImage $menu $prism | 
    resources.Concat "bundle.js" | 
    resources.Minify | 
    resources.Fingerprint "sha512" }}
<script src="{{ $secureJS.RelPermalink }}" integrity="{{ $secureJS.Data.Integrity }}"></script>
```

## Error Handling & Best Practices

### JavaScript Error Handling
```javascript
// Always check for element existence
const element = document.querySelector('.selector')
if (!element) {
    console.warn('Element not found:', '.selector')
    return
}

// Wrap async operations in try-catch
try {
    const response = await fetch(url)
    const data = await response.json()
} catch (error) {
    console.error('Fetch error:', error)
}
```

### Performance Considerations
- Use `requestAnimationFrame` for animations
- Implement event listener cleanup on page unload
- Use viewport calculations for responsive particle density
- Cache DOM queries in variables
- Use Hugo's built-in minification for production builds

### Memory Management
- Remove event listeners when components unmount
- Clear animation frames in cleanup functions
- Use WeakMap for DOM element associations

## File Organization

**JavaScript Files:**
- `main.js` - Main coordinator
- `particle-image-responsive.js` - Particle system
- `menu.js` - Menu interactions
- `prism.js` - Code syntax highlighting

**SCSS Files:**
- `_variables.scss` - Global variables
- `_mixins.scss` - Reusable mixins
- `_fonts.scss` - Typography
- Component-specific files (`_header.scss`, `_footer.scss`, etc.)
- `_particle-image.scss` - Particle system styles

**Configuration Files:**
- `hugo.toml` - Main Hugo configuration
- `themes/ReliqStudios/theme.toml` - Theme metadata
- `themes/ReliqStudios/.eslintrc.yml` - ESLint configuration


### Particle System
- Dual particle systems (primary + secondary)
- Responsive density and sizing based on viewport
- JSON configuration in `/js/particle-params.json`
- Canvas-based rendering with optimization
- Touch and mouse event handling

### Modern Web Features
- CSS Grid and Flexbox layouts
- CSS custom properties for theming
- Intersection Observer ready
- Touch event handling for mobile
- Asset fingerprinting for cache busting

## Common Pitfalls to Avoid

ALWAYS GO FROM PWD NEVER FULL FILES PATHS

## Accessibility Guidelines

- Use semantic HTML5 elements
- Implement proper ARIA labels where needed
- Provide screen reader styles
- Use proper color contrast ratios (check with current color scheme)
