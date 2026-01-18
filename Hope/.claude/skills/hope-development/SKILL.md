---
name: hope-development
description: Development guidelines for the Hope 3D experience project. Use when modifying Three.js scenes, GSAP animations, CSS styles, or TypeScript components in the Hope project.
---

# Hope Development Skill

## Architecture

Hope is a TypeScript + Three.js + GSAP application with vite build.

### Core Files
| File | Purpose |
|------|---------|
| `src/main.ts` | App entry, UI event handling |
| `src/styles.css` | All styling including `hope-mode` theme |
| `src/scene/SceneManager.ts` | Three.js scene orchestration |
| `src/animation/HopeAnimation.ts` | Particle animation sequences |

## Code Patterns

### Adding UI Elements
1. Add HTML to `index.html`
2. Add styles to `styles.css`
3. Add event handlers in `App` class (`main.ts`)

### Theme Switching
```css
/* Dark mode (default) */
.hero-subtitle { color: var(--color-text-secondary); }

/* Light mode (after hope animation) */
body.hope-mode .hero-subtitle { 
  color: #0a1628;
  background: rgba(255, 255, 255, 0.85);
}
```

### Three.js Modifications
```typescript
// In SceneManager.ts
public addCustomEffect(): void {
  // 1. Create geometry/material
  // 2. Add to scene: this.scene.add(mesh)
  // 3. Update in animate loop if needed
}
```

### GSAP Animations
```typescript
import gsap from 'gsap'

gsap.to(element, {
  opacity: 1,
  duration: 0.5,
  ease: 'power2.out'
})
```

## Verification Checklist

Before committing changes:

- [ ] Run `bun dev` and test in browser
- [ ] Check both dark mode and hope-mode (light)
- [ ] Test responsive layouts (mobile/tablet)
- [ ] Verify YouTube player functionality
- [ ] Check console for errors

## Common Tasks

### Change Particle Colors
Edit `src/scene/Particles.ts` - update color uniforms

### Modify Animation Timing
Edit `src/animation/HopeAnimation.ts` or adjust setTimeout values in `main.ts`

### Add New Section
1. Add HTML section in `index.html`
2. Add styles in `styles.css`
3. Update scroll animation in `ScrollAnimation.ts` if needed

## Build & Deploy

```bash
bun run build    # Creates dist/ folder
bun run preview  # Local production test
```
