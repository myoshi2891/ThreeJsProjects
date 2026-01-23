---
name: hope-development
description: Development guidelines for the Hope 3D experience project. Use when modifying Three.js scenes, GSAP animations, CSS styles, or TypeScript components in the Hope project.
---

# Hope Development Skill

## Architecture

Hope is a **React 19 + React Three Fiber + Zustand** application with Vite build and Biome linter.

### Core Files
| File | Purpose |
|------|---------|
| `src/main.tsx` | React entry point |
| `src/components/App.tsx` | Main application component |
| `src/components/ThreeCanvas.tsx` | R3F Canvas wrapper |
| `src/styles.css` | All styling including `hope-mode` theme |
| `src/store/appStore.ts` | UI state (Zustand) |
| `src/store/sceneStore.ts` | 3D scene state (Zustand) |

## Code Patterns

### Adding UI Components
1. Create component in `src/components/`
2. Add styles to `styles.css`
3. Import and use in parent component (e.g., `App.tsx`)

```typescript
// src/components/MyComponent.tsx
export function MyComponent() {
  const someState = useAppStore(state => state.someState)
  return <div className="my-component">{/* ... */}</div>
}
```

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

### 3D Effects (React Three Fiber)
```typescript
// src/components/three/MyEffect.tsx
import { useFrame } from '@react-three/fiber'
import { useSceneStore } from '../../store/sceneStore'

export function MyEffect() {
  const hopeFactor = useSceneStore(state => state.hopeFactor)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    // Animation logic
  })

  return <mesh ref={meshRef}>{/* ... */}</mesh>
}
```

### GSAP Animations with Hooks
```typescript
// src/hooks/useMyAnimation.ts
import gsap from 'gsap'
import { useEffect } from 'react'

export function useMyAnimation(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return

    const tl = gsap.timeline()
    tl.to('.element', { opacity: 1, duration: 0.5 })

    return () => tl.kill()
  }, [isActive])
}
```

## Verification Checklist

Before committing changes:

- [ ] Run `bun run lint` - No Biome errors
- [ ] Run `bunx tsc --noEmit` - No TypeScript errors
- [ ] Run `bun run test` - All tests pass
- [ ] Run `bun dev` and test in browser
- [ ] Check both dark mode and hope-mode (light)
- [ ] Test responsive layouts (mobile/tablet)
- [ ] Verify YouTube player functionality

## Common Tasks

### Add New Story Section
1. Add content to `storyContent` object in `StorySection.tsx`
2. Add image to `public/images/` (WebP format recommended)
3. Use component: `<StorySection type="newType" />`

Current valid types: `"hope" | "life" | "possibility" | "light"`

### Modify Animation Timing
Edit hooks in `src/hooks/` or adjust GSAP timelines

### Add New 3D Effect
1. Create component in `src/components/three/`
2. Add to `ThreeCanvas.tsx`
3. Connect to `sceneStore` if state needed

## Build & Deploy

```bash
bun run build    # Creates dist/ folder
bun run preview  # Local production test
```

### CI/CD (GitHub Actions)
- **ci.yml**: Lint, TypeScript, Tests, Build on PR/push
- **deploy.yml**: Auto-deploy to Netlify
  - `main` → Production
  - `development` → Preview
