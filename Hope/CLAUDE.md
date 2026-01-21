# Hope - Interactive 3D Web Experience (React 19)

## Overview

希望（Hope）をテーマにした没入型3D Webエクスペリエンス。React 19, React Three Fiber, Zustandを使用したモダンなアーキテクチャで構築されています。

## Quick Start

```bash
cd Hope
bun install
bun dev
```

## Project Structure

```
Hope/
├── index.html            # React root
├── package.json          # Deps: React 19, R3F, Zustand, Vitest
├── src/
│   ├── main.tsx          # React Entry point
│   ├── components/       # UI & 3D Components
│   │   ├── App.tsx       # Main Application Component
│   │   ├── ThreeCanvas.tsx # R3F Canvas Wrapper
│   │   ├── StorySection.tsx # Story sections with quotes & thumbnails
│   │   ├── ImageModal.tsx # Fullscreen image modal viewer
│   │   ├── three/        # 3D Effect Components (Rain, Fog, etc.)
│   │   └── [UI Components] # Hero, Navigation, etc.
│   ├── store/            # Global State Management (Zustand)
│   │   ├── appStore.ts   # UI State
│   │   └── sceneStore.ts # 3D Scene State
│   ├── hooks/            # Custom Hooks
│   │   ├── useHopeAnimation.ts # GSAP Timeline
│   │   └── useScrollAnimation.ts # ScrollTrigger
│   └── styles.css        # Global Styles
└── public/
    └── images/           # Story section thumbnail images
```

## Key Components

### App (`components/App.tsx`)
- アプリケーションのメインコンポーネント
- UIレイヤーと3Dキャンバス(`ThreeCanvas`)を合成
- アニメーションフックの初期化

### ThreeCanvas (`components/ThreeCanvas.tsx`)
- React Three Fiber (`Canvas`) の設定
- シーンエフェクト(`RainEffect`, `FogEffect`, `GodRaysEffect`等)の配置

### StorySection (`components/StorySection.tsx`)
- 4つのストーリーセクション（Hope, Life, Possibility, Light）
- 各セクションに名言とサムネイル画像を表示
- クリックでImageModalによる拡大表示

### ImageModal (`components/ImageModal.tsx`)
- フルスクリーン画像モーダル
- 半透明オーバーレイ（雨アニメーションが見える）
- キーボードアクセシビリティ（Escで閉じる）
- スムーズな開閉アニメーション

### Stores (`src/store/`)
- **appStore**: ローディング、UI表示フラグ(`isHopeMode`等)を管理
- **sceneStore**: 3Dシーンパラメータ(`hopeFactor`, `scrollProgress`)を管理

## Key Behaviors

1. **Loading**: Zustandストアで進捗管理 → 完了後に非表示
2. **Start Button**: 体験セクションへスクロール
3. **Story Sections**: 名言とサムネイル画像を表示、クリックでモーダル拡大
4. **Hope Animation**: 
   - `useHopeAnimation`フックがGSAPタイムラインを実行
   - Zustandの`hopeFactor`を更新し、UIと3Dシーンが同期して変化
   - 完了後にビデオオーバーレイを表示
5. **Video**: フルスクリーン再生 → 閉じた後に右下サムネイル表示（フェードイン）

## Development Commands

```bash
bun dev           # Start dev server (localhost:5173)
bun run test      # Run tests (Vitest)
bun run build     # Production build
bun run preview   # Preview production build
```

## Tech Stack

- **React** (19.0.0): UI Library
- **React Three Fiber** (9.0.0): 3D Rendering Integration
- **Zustand** (5.0.0): State Management
- **Three.js** (0.172.0): 3D Core
- **GSAP** (3.12.5): Animations
- **Vitest**: Testing Framework
- **Vite**: Build Tool
- **Bun**: Package Manager & Runtime

## Agent Rules

- **Commit Location**: Always run git commands from the root directory (`/Users/mitsuruyoshizumi/Workspace/BasicFrontEnd/ThreeJsProjects`). The Hope subdirectory is now part of the parent repository (no separate .git).

