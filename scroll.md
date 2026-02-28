# Scroll Issue: Nav Links Scroll Behind Header

## The Problem
When clicking nav links (e.g., "#about", "#projects"), the page scrolls to the section but the heading is hidden behind the fixed/sticky header/navigation bar.

## What Was Tried

### 1. CSS `scroll-margin-top` on `.page-section`
```scss
.page-section {
  scroll-margin-top: 100px;
}
```
- **Result**: Didn't work reliably across browsers

### 2. CSS `scroll-padding-top` on `html`
```scss
html {
  scroll-padding-top: 10vh;
}
```
- **Result**: Didn't work

### 3. Dynamic JavaScript to calculate header height
```javascript
const header = document.querySelector('.header');
const headerNav = document.querySelector('.header__nav');
const menu = document.querySelector('.menu');
let totalHeight = 0;
if (header) totalHeight += header.offsetHeight;
if (headerNav) totalHeight += headerNav.offsetHeight;
if (menu) totalHeight += menu.offsetHeight;
// Applied scrollMarginTop to each .page-section
```
- **Result**: Still didn't work

### 4. Manual anchor click handler
```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Calculate scroll position manually
    });
});
```
- **Result**: Still going behind header

### 5. CSS `margin-top: 10vh` on sections
```scss
.page-section {
  margin-top: 10vh;
}
```
- **Result**: Didn't solve the scroll-to issue

## Why It Might Not Be Working

1. **The header might be `position: fixed`** - which removes it from document flow and scroll-margin may not account for it properly in all cases

2. **Multiple overlapping elements** - header + nav + menu might be stacked, causing total height to be miscalculated

3. **CSS specificity issues** - other styles might be overriding scroll-margin-top

4. **Smooth scroll interference** - `scroll-behavior: smooth` in CSS might be conflicting

## What Needs to Be Done

1. **Check in DevTools**:
   - Is the header `position: fixed` or `position: sticky`?
   - What is the actual computed height of `.header`, `.header__nav`, `.menu`?
   - Is `scroll-margin-top` actually being applied to `.page-section`?

2. **Try these approaches**:
   - Use JavaScript to add inline `scroll-margin-top` directly to each section on page load
   - Use `position: sticky` instead of `position: fixed` for the header
   - Add a transparent spacer element at the top of each section
   - Use `scrollIntoView()` with proper `block` alignment in JavaScript

## Notes
- User has two screens: monitor (works) and laptop (issue occurs)
- This suggests the header height might differ between screen sizes
- Solution should use viewport units (`vh`) or be calculated dynamically to work on all screen sizes
