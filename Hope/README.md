# Hope - Interactive 3D Web Experience

希望（Hope）をテーマにした没入型3D Webエクスペリエンス。

雨、霧、光のパーティクルが織りなす幻想的な3Dシーンの中で、希望にまつわる名言と写真を巡る体験型Webサイトです。

## Features

- Three.js による没入型3Dシーン（雨、霧、光芒、パーティクル）
- GSAP アニメーション（Hope演出、スクロール連動）
- ストーリーセクション（4テーマ: Hope, Life, Possibility, Light）
- YouTube動画埋め込み（サムネイル + フルスクリーン）
- 日英バイリンガル対応（自動言語検出 + LocalStorage保存）
- レスポンシブデザイン（モバイル対応）

## Quick Start

```bash
# 依存関係のインストール
bun install

# 開発サーバー起動 (localhost:5173)
bun dev
```

### 環境変数

`.env.example` をコピーして `.env` を作成してください。

```bash
cp .env.example .env
```

```
VITE_YOUTUBE_VIDEO_ID=<YouTube動画ID>
```

## Development

```bash
bun dev              # 開発サーバー起動
bun run build        # プロダクションビルド
bun run preview      # ビルド結果のプレビュー
bun run test         # テスト実行（ウォッチモード）
bun run lint         # Lint チェック
bun run lint:fix     # Lint 自動修正
```

### Docker

```bash
# 開発環境（ホットリロード対応）
docker compose -f docker-compose.dev.yml up

# 本番環境（Nginx）
docker compose up -d
```

## Tech Stack

| Category | Technology |
|----------|-----------|
| UI | React 19 |
| 3D | Three.js + React Three Fiber |
| State | Zustand |
| Animation | GSAP |
| Build | Vite |
| Test | Vitest + Testing Library |
| Lint | Biome |
| Runtime | Bun |

## Deployment

- **本番**: `main` ブランチへのpushで Netlify に自動デプロイ
- **プレビュー**: `development` ブランチへのpushでプレビュー環境にデプロイ
- **CI**: GitHub Actions で Lint, TypeScript, テスト, ビルドを自動実行

## Architecture

詳細なアーキテクチャ、コンポーネント説明、開発ルールについては [CLAUDE.md](CLAUDE.md) を参照してください。
