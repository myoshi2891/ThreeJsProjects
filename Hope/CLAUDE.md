# Hope - Interactive 3D Web Experience (React 19)

## Overview

希望（Hope）をテーマにした没入型3D Webエクスペリエンス。React 19, React Three Fiber, Zustandを使用したモダンなアーキテクチャで構築されています。

## Agent Rules (IMPORTANT)

> [!CAUTION]
> **Git Repository Root**: このプロジェクトは親リポジトリ（`ThreeJsProjects`）の一部です。
>
> **Git コマンド（add, commit, push等）は必ず親ディレクトリ `ThreeJsProjects/` から実行すること！**
>
> ```bash
> # 正しい実行場所
> cd ../  # Hope → ThreeJsProjects に移動
> git add -A && git commit -m "message"
>
> # 間違い（Hope/ディレクトリから実行しない）
> git commit  # Hopeサブディレクトリからは実行しないこと
> ```

## Commit Procedure (REQUIRED)

> [!IMPORTANT]
> **コミット前に必ず以下の手順を実行してください。CIでlintエラーが発生するのを防ぎます。**
>
> ```bash
> # 1. Lint自動修正（フォーマット含む）
> cd Hope
> bun run lint:fix
>
> # 2. Lintエラーがないことを確認
> bun run lint
>
> # 3. 型チェック
> bunx tsc --noEmit
>
> # 4. 親ディレクトリに戻ってコミット
> cd ..
> git add <files> && git commit -m "message"
> ```
>
> **よくあるエラー**: Biomeフォーマッタがコード整形を要求するケース（特にJSX属性の折り返し）。
> `bun run lint:fix` で自動修正されます。手動編集後は必ず実行してください。

## Quick Start

```bash
cd Hope
bun install
bun dev
```

## Lockfile Management (IMPORTANT)

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
├── Dockerfile            # Production multi-stage build (Bun → Nginx)
├── Dockerfile.dev        # Development container (Bun + hot reload)
├── docker-compose.yml    # Production configuration
├── docker-compose.dev.yml # Development configuration
├── docker-entrypoint.sh  # Health checks, user switching
├── nginx/nginx.conf      # Nginx configuration (SPA routing, caching)
├── nginx/security-headers.conf # CSP, HSTS, X-Frame-Options等
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
├── index.html            # React root (LCP preload links含む)
├── package.json          # Deps: React 19, R3F, Zustand, Vitest
├── biome.json            # Biome linter/formatter config
├── netlify.toml          # Netlify deploy config
├── .env.example          # 環境変数テンプレート
├── .github/
│   └── workflows/
│       ├── ci.yml        # Lint, TypeScript, Tests, Build
│       ├── deploy.yml    # Netlify deployment (main→prod, dev→preview)
│       └── docker.yml    # Docker build/push to ghcr.io + Trivy scan
├── src/
│   ├── main.tsx          # React Entry point
│   ├── styles.css        # Global Styles (テーマ変数、アニメーション)
│   ├── components/       # UI & 3D Components
│   │   ├── App.tsx       # Main Application Component
│   │   ├── ThreeCanvas.tsx # R3F Canvas Wrapper
│   │   ├── Hero.tsx      # Hero section (CTA → experience scroll)
│   │   ├── Navigation.tsx # Nav bar (skip link, mobile toggle)
│   │   ├── Loading.tsx   # Loading progress UI
│   │   ├── StorySection.tsx # Story sections with quotes & thumbnails
│   │   ├── ExperienceSection.tsx # Video section with StorySection-style layout
│   │   ├── ImageSlider.tsx # Horizontal image slider for story sections
│   │   ├── ImageModal.tsx # Fullscreen image modal viewer
│   │   ├── VideoThumbnail.tsx # In-page YouTube thumbnail player
│   │   ├── VideoOverlay.tsx # Fullscreen YouTube player overlay
│   │   ├── LanguageToggle.tsx # i18n language switcher
│   │   ├── BackgroundLayer.tsx # Decorative background layer
│   │   ├── index.ts      # Barrel export
│   │   ├── three/        # 3D Effect Components
│   │   │   ├── RainEffect.tsx, FogEffect.tsx
│   │   │   ├── LightParticlesEffect.tsx, GodRaysEffect.tsx
│   │   │   ├── SceneSetup.tsx, MouseParallax.tsx
│   │   │   └── index.ts
│   │   └── __tests__/    # Component Tests (13 files)
│   ├── store/            # Global State Management (Zustand)
│   │   ├── index.ts      # Barrel export (use this for imports)
│   │   ├── appStore.ts   # UI State (loading, hopeMode, video flags)
│   │   ├── sceneStore.ts # 3D Scene State (hopeFactor, scrollProgress)
│   │   ├── i18nStore.ts  # i18n State (locale, t function, persist)
│   │   └── __tests__/    # Store Tests
│   ├── locales/          # Translation Files
│   │   ├── index.ts      # Translation export & Locale type
│   │   ├── en.json       # English translations
│   │   ├── ja.json       # Japanese translations
│   │   └── __tests__/    # Translation consistency tests
│   ├── hooks/            # Custom Hooks (React)
│   │   ├── useHopeAnimation.ts # GSAP Timeline Hook
│   │   └── useScrollAnimation.ts # ScrollTrigger Hook
│   ├── animation/        # Animation Classes (non-React)
│   │   ├── HopeAnimation.ts # Hope animation logic class
│   │   ├── ScrollAnimation.ts # Scroll animation logic class
│   │   └── __tests__/
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
│   ├── utils/            # Utility Functions
│   │   ├── youtube.ts    # YouTube video ID utility
│   │   └── __tests__/
│   └── test/             # Test Infrastructure
│       ├── setup.ts      # Vitest setup (mocks: rAF, ResizeObserver, WebGL)
│       ├── helpers/
│       │   └── storeReset.ts
│       └── mocks/
│           └── gsap.ts
└── public/
    ├── images/           # Story section thumbnail images (WebP format)
    ├── textures/         # 3D textures
    └── favicon.*         # Favicon files
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
- 各セクションに名言とサムネイル画像スライダーを表示
- クリックでImageModalによる拡大表示
- 厳密な型定義: `Record<StorySectionProps["type"], string[]>`

### ImageSlider (`components/ImageSlider.tsx`)

- 横スクロール画像スライダー
- StorySection内に配置
- クリックでImageModal表示

### ImageModal (`components/ImageModal.tsx`)

- フルスクリーン画像モーダル
- 半透明オーバーレイ（雨アニメーションが見える）
- キーボードアクセシビリティ（Escで閉じる）
- スムーズな開閉アニメーション

### ExperienceSection (`components/ExperienceSection.tsx`)

- StorySection風のレイアウト（number, title, description）を持つビデオセクション
- 「Watch the short Film」ボタンでHopeアニメーション開始
- フェードアウト: 500ms（CSS transition: opacity 0.5s ease-out と一致）
- アニメーション完了後にVideoThumbnailを表示

### VideoThumbnail (`components/VideoThumbnail.tsx`)

- ページ内YouTubeサムネイルプレーヤー
- フェードインアニメーションで表示
- 拡大ボタンでVideoOverlayへ遷移

### VideoOverlay (`components/VideoOverlay.tsx`)

- フルスクリーンYouTubeプレーヤーオーバーレイ
- ESCキーまたは閉じるボタンで終了
- 閉じた後はVideoThumbnailに戻る

### LanguageToggle (`components/LanguageToggle.tsx`)

- 日英言語切り替えボタン
- ナビゲーションバーに配置
- LocalStorageに設定を保存

### Stores (`src/store/`)

- **appStore**: ローディング、UI表示フラグ(`isHopeMode`等)を管理
- **sceneStore**: 3Dシーンパラメータ(`hopeFactor`, `scrollProgress`)を管理
- **i18nStore**: 言語設定(`locale`)と翻訳関数(`t`)を提供。Zustand persistで永続化。

**i18n再レンダリングパターン**:

```tsx
// locale購読で言語変更時の再レンダリングを保証
useI18nStore((state) => state.locale)
const t = useI18nStore((state) => state.t)
```

`t` 関数は参照が変わらないため、`locale` のサブスクリプションが再レンダリングに必要。
`void locale` や変数代入は不要。

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
6. **Language Switching**:
   - ナビゲーションバーのトグルで日英切り替え
   - ブラウザ言語設定を自動検出（初回）
   - 設定はLocalStorageに保存され、再訪問時も維持

## Development Commands

```bash
bun dev              # Start dev server (localhost:5173)
bun run test         # Run tests (Vitest, watch mode)
bun run test -- --run # Run tests once (CI mode)
bun run build        # Production build (tsc + vite build)
bun run preview      # Preview production build
bun run lint         # Biome lint check
bun run lint:fix     # Biome lint + auto-fix
bun run format       # Biome format
```

## Performance Optimization

### LCP (Largest Contentful Paint)

- 背景画像のプリロード: `index.html` に `<link rel="preload">` タグ追加
- Hero セクションの背景画像を優先的に読み込み

### Font Loading

- Google Fonts は `<link>` タグで読み込み（`@import` は非推奨）
- `font-display: swap` で FOUT (Flash of Unstyled Text) を許容
- `preconnect` で fonts.googleapis.com への接続を事前確立

### Accessibility

- スキップリンク（Navigation）
- キーボードナビゲーション: video ボタンに `:focus-visible` スタイル
- aria-label: ボタン内テキストと重複する場合は不要（スクリーンリーダーが自動読み上げ）

## Tech Stack

- **React** (19.0.0): UI Library
- **React Three Fiber** (9.0.0): 3D Rendering Integration
- **Zustand** (5.0.0): State Management
- **Three.js** (0.182.0): 3D Core
- **@react-three/drei** (10.7.7): R3F Utilities
- **GSAP** (3.12.5): Animations
- **Vitest** (4.0.18): Testing Framework
- **@testing-library/user-event** (14.6.1): User interaction testing
- **Vite** (7.3.1): Build Tool
- **Biome** (2.3.11): Linter & Formatter

### Tools & Runtime

- **Bun** (1.3.5): Package Manager & Runtime

## CI/CD

GitHub Actionsによる自動化:

- **ci.yml**: PR/pushでLint（Biome）、TypeScript型チェック、Vitestテスト、ビルドを実行
- **deploy.yml**: mainブランチ→本番、developmentブランチ→プレビューをNetlifyにデプロイ
- **docker.yml**: DockerイメージのビルドとGitHub Container Registry (ghcr.io) へのpush、Trivy脆弱性スキャン

## Environment Variables

```bash
VITE_YOUTUBE_VIDEO_ID=<YouTube動画ID>  # .env に設定（.env.example参照）
```

## Known Issues / TODO

以下のissueは設計判断が必要なため保留中:

- **#76**: backdrop-filter (`blur(8px)`) のモバイルパフォーマンス影響
- **#54**: デバイス性能に応じた Rain パーティクル数の動的調整
- **#130**: StorySection `renderDescription` のi18n構造改善（`<br />` 結合→翻訳ファイル側でフォーマット）
