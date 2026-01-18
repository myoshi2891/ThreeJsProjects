# Hope - Interactive 3D Web Experience

## Overview

希望（Hope）をテーマにした没入型3D Webエクスペリエンス。Three.jsとGSAPを使用したインタラクティブなパーティクルアニメーションと、ストーリーテリング体験を提供します。

## Quick Start

```bash
cd Hope
bun install
bun dev
```

## Project Structure

```
Hope/
├── index.html          # Main HTML with all UI elements
├── package.json        # Dependencies: three, gsap, vite, typescript
├── src/
│   ├── main.ts         # Entry point, App class
│   ├── styles.css      # All styles (1000+ lines)
│   ├── scene/          # Three.js scene management
│   │   ├── SceneManager.ts    # Main scene controller
│   │   ├── Camera.ts          # Camera setup
│   │   ├── Lights.ts          # Lighting configuration
│   │   └── Particles.ts       # Particle system
│   ├── animation/      # Animation logic
│   │   ├── ScrollAnimation.ts # Scroll-based animations
│   │   └── HopeAnimation.ts   # Hope button sequence
│   ├── effects/        # Visual effects
│   │   ├── PostProcessing.ts  # Post-processing effects
│   │   └── Bloom.ts           # Bloom effect
│   ├── loaders/        # Asset loading
│   │   └── AssetLoader.ts     # Asset management
│   └── types/          # TypeScript types
│       └── index.ts    # Type definitions
└── public/             # Static assets
```

## Key Components

### App Class (`main.ts`)
- Entry point managing all UI interactions
- Controls video player (fullscreen + thumbnail)
- Handles button events and navigation

### SceneManager (`scene/SceneManager.ts`)
- Core Three.js scene orchestration
- Particle system management
- Hope animation trigger

### Styles (`styles.css`)
- CSS custom properties for theming
- `hope-mode` class for light/dark theme switching
- Responsive design breakpoints

## State Management

The app uses class-based state with DOM classes:
- `body.hope-mode`: Light theme after hope animation
- `.hidden` / `.visible`: Element visibility
- Animation states via GSAP timelines

## Key Behaviors

1. **Loading**: Progress bar animation → hide on complete
2. **Start Button**: Scrolls to experience section
3. **Hope Button**: 
   - Triggers 12-second particle animation
   - Shows fullscreen YouTube video
   - Activates `hope-mode` (light theme)
4. **Video**: Fullscreen with thumbnail fallback

## Development Commands

```bash
bun dev           # Start dev server (localhost:5173)
bun run build     # Production build
bun run preview   # Preview production build
```

## Tech Stack

- **Three.js** (0.160.0): 3D rendering
- **GSAP** (3.12.5): Animations
- **TypeScript** (5.3.3): Type safety
- **Vite** (5.0.0): Build tool
- **Bun**: Package manager and runtime
