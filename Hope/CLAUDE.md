# Hope - Interactive 3D Web Experience (React 19)

## Overview

希望（Hope）をテーマにした没入型3D Webエクスペリエンス。React 19, React Three Fiber, Zustandを使用したモダンなアーキテクチャで構築されています。

## ⚠️ Agent Rules (IMPORTANT)

> [!CAUTION]
> **Git Repository Root**: このプロジェクトは親リポジトリ（`ThreeJsProjects`）の一部です。
>
> **Git コマンド（add, commit, push等）は必ず親ディレクトリ `ThreeJsProjects/` から実行すること！**
>
> ```bash
> # ✅ 正しい実行場所
> cd ../  # Hope → ThreeJsProjects に移動
> git add -A && git commit -m "message"
>
> # ❌ 間違い（Hope/ディレクトリから実行しない）
> git commit  # Hopeサブディレクトリからは実行しないこと
> ```

## Quick Start

```bash
cd Hope
bun install
bun dev
```

## ⚠️ Lockfile Management (IMPORTANT)

> [!WARNING]
> **CIで `bun ci` を使用しているため、`bun.lock` は常に最新である必要があります。**
>
> 依存関係を変更した場合や、CIで以下のエラーが発生した場合：
>
> ```
> error: lockfile had changes, but lockfile is frozen
> ```
>
> **対処方法:**
>
> ```bash
> cd Hope
> bun install          # lockfileを更新
> cd ..                # ThreeJsProjectsに移動
> git add Hope/bun.lock
> git commit -m "chore: update bun.lock"
> ```

## Docker Environment

```
Hope/
├── Dockerfile            # Production multi-stage build
├── Dockerfile.dev        # Development container
├── docker-compose.yml    # Production configuration
├── docker-compose.dev.yml # Development configuration
├── nginx/nginx.conf      # Nginx configuration
├── nginx/security-headers.conf # Shared security headers
└── .dockerignore         # Docker exclude files
```

```bash
# Production
docker compose up -d

# Development (with hot reload)
docker compose -f docker-compose.dev.yml up
```

## Project Structure

```
Hope/
├── index.html            # React root
├── package.json          # Deps: React 19, R3F, Zustand, Vitest
├── biome.json            # Biome linter/formatter config
├── .github/
│   ├── workflows/
│   │   ├── ci.yml        # Lint, TypeScript, Tests, Build
│   │   └── deploy.yml    # Netlify deployment (main→prod, dev→preview)
│   └── dependabot.yml    # Weekly dependency updates
├── src/
│   ├── main.tsx          # React Entry point
│   ├── components/       # UI & 3D Components
│   │   ├── App.tsx       # Main Application Component
│   │   ├── ThreeCanvas.tsx # R3F Canvas Wrapper
│   │   ├── StorySection.tsx # Story sections with quotes & thumbnails
│   │   ├── ExperienceSection.tsx # Video section with StorySection-style layout
│   │   ├── VideoThumbnail.tsx # In-page YouTube thumbnail player
│   │   ├── VideoOverlay.tsx # Fullscreen YouTube player overlay
│   │   ├── ImageModal.tsx # Fullscreen image modal viewer
│   │   ├── BackgroundLayer.tsx # Decorative background layer
│   │   ├── three/        # 3D Effect Components (Rain, Fog, etc.)
│   │   ├── __tests__/    # Component Tests
│   │   └── [UI Components] # Hero, Navigation (skip link), Loading, etc.
│   ├── store/            # Global State Management (Zustand)
│   │   ├── index.ts      # Barrel export (use this for imports)
│   │   ├── appStore.ts   # UI State
│   │   ├── sceneStore.ts # 3D Scene State
│   │   └── __tests__/    # Store Tests
│   ├── hooks/            # Custom Hooks (React)
│   │   ├── useHopeAnimation.ts # GSAP Timeline Hook
│   │   └── useScrollAnimation.ts # ScrollTrigger Hook
│   ├── animation/        # Animation Classes (非React)
│   │   ├── HopeAnimation.ts # Hope animation logic class
│   │   └── ScrollAnimation.ts # Scroll animation logic class
│   ├── scene/            # 3D Scene Management (Three.js)
│   │   ├── SceneManager.ts # Scene lifecycle & rendering
│   │   └── objects/      # Scene objects
│   │       ├── Rain.ts, Fog.ts, LightParticles.ts
│   ├── effects/          # Post-processing Effects
│   │   ├── PostProcessing.ts # EffectComposer configuration
│   │   └── GodRays.ts    # God rays effect
│   ├── loaders/          # Asset Loading
│   │   └── AssetLoader.ts # HDRI texture & environment loading
│   ├── types/            # TypeScript Type Definitions
│   │   └── index.ts      # Shared types (SceneParams, LoadingCallbacks)
│   └── styles.css        # Global Styles
└── public/
    └── images/           # Story section thumbnail images (WebP format)
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

### ExperienceSection (`components/ExperienceSection.tsx`)

- StorySection風のレイアウト（number, title, description）を持つビデオセクション
- 「Watch the short Film」ボタンでHopeアニメーション開始
- アニメーション完了後にVideoThumbnailを表示

### VideoThumbnail (`components/VideoThumbnail.tsx`)

- ページ内YouTubeサムネイルプレーヤー
- フェードインアニメーションで表示
- 拡大ボタンでVideoOverlayへ遷移

### VideoOverlay (`components/VideoOverlay.tsx`)

- フルスクリーンYouTubeプレーヤーオーバーレイ
- ESCキーまたは閉じるボタンで終了
- 閉じた後はVideoThumbnailに戻る

### Stores (`src/store/`)

- **appStore**: ローディング、UI表示フラグ(`isHopeMode`等)を管理
- **sceneStore**: 3Dシーンパラメータ(`hopeFactor`, `scrollProgress`)を管理

### Animation Classes (`src/animation/`)

- **HopeAnimation**: 希望アニメーションのロジッククラス（GSAPタイムライン）
- **ScrollAnimation**: スクロール連動アニメーションのロジッククラス（ScrollTrigger）

### Scene Management (`src/scene/`)

- **SceneManager**: Three.jsシーンのライフサイクル管理、レンダリングループ
- **objects/**: 3Dオブジェクトクラス（Rain, Fog, LightParticles）

### Effects (`src/effects/`)

- **PostProcessing**: EffectComposer設定、UnrealBloomPass等のポストエフェクト
- **GodRays**: ゴッドレイ（光芒）エフェクトの実装

### Loaders (`src/loaders/`)

- **AssetLoader**: HDRIテクスチャ・環境マップのローディング（EXRLoader使用）

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

## Performance Optimization

### LCP (Largest Contentful Paint)

- 背景画像のプリロード: `index.html` に `<link rel="preload">` タグ追加
- Hero セクションの背景画像を優先的に読み込み

### Font Loading

- Google Fonts は `<link>` タグで読み込み（`@import` は非推奨）
- `font-display: swap` で FOUT (Flash of Unstyled Text) を許容
- `preconnect` で fonts.googleapis.com への接続を事前確立

## Tech Stack

- **React** (19.0.0): UI Library
- **React Three Fiber** (9.0.0): 3D Rendering Integration
- **Zustand** (5.0.0): State Management
- **Three.js** (0.182.0): 3D Core
- **@react-three/drei** (10.7.7): R3F Utilities
- **GSAP** (3.12.5): Animations
- **Vitest** (4.x): Testing Framework
- **@testing-library/user-event** (14.6.1): User interaction testing
- **Vite** (7.x): Build Tool
- **Biome** (2.x): Linter & Formatter

### Tools & Runtime

- **Bun** (1.3.5): Package Manager & Runtime

## CI/CD

GitHub Actionsによる自動化:

- **ci.yml**: PR/pushでLint、TypeScript、テスト、ビルドを実行
- **docker.yml**: DockerイメージのビルドとCI
- **deploy.yml**: mainブランチ→本番、developmentブランチ→プレビューをNetlifyにデプロイ
- **dependabot.yml**: 週次で依存関係の更新PRを作成

```bash
# ローカルでのLint/Format
bun run lint        # Biome lint
bun run format      # Biome format
```
