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
│   │   ├── three/        # 3D Effect Components (Rain, Fog, etc.)
│   │   └── [UI Components] # Hero, Navigation, Loading, etc.
│   ├── store/            # Global State Management (Zustand)
│   │   ├── appStore.ts   # UI State
│   │   └── sceneStore.ts # 3D Scene State
│   ├── hooks/            # Custom Hooks
│   │   ├── useHopeAnimation.ts # GSAP Timeline
│   │   └── useScrollAnimation.ts # ScrollTrigger
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
- **Bun** (1.3.5): Package Manager & Runtime
- **Biome**: Linter & Formatter

## CI/CD

GitHub Actionsによる自動化:

- **ci.yml**: PR/pushでLint、TypeScript、テスト、ビルドを実行
- **deploy.yml**: mainブランチ→本番、developmentブランチ→プレビューをNetlifyにデプロイ
- **dependabot.yml**: 週次で依存関係の更新PRを作成

```bash
# ローカルでのLint/Format
bun run lint        # Biome lint
bun run format      # Biome format
```
