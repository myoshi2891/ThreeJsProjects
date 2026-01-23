# =============================================================================
# Hope Project - Production Dockerfile (Multi-stage Build)
# =============================================================================
# Stage 1: 依存関係インストール & ビルド
# Stage 2: Nginx による静的ファイル配信
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Builder
# -----------------------------------------------------------------------------
FROM oven/bun:1.3.5-alpine AS builder

WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json bun.lock ./

# 依存関係インストール（devDependencies含む、ビルドに必要）
RUN bun install --frozen-lockfile

# ソースコードをコピー
COPY . .

# ビルド引数として環境変数を受け取る
ARG VITE_YOUTUBE_VIDEO_ID
ENV VITE_YOUTUBE_VIDEO_ID=$VITE_YOUTUBE_VIDEO_ID

# TypeScriptチェック & ビルド
RUN bun run build

# -----------------------------------------------------------------------------
# Stage 2: Production (Nginx)
# -----------------------------------------------------------------------------
FROM nginx:1.25-alpine AS production

# セキュリティ: 不要なパッケージを削除し、脆弱性を最小化
RUN apk --no-cache upgrade

# Nginx設定ファイルをコピー
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# ビルド成果物をNginxの公開ディレクトリにコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# セキュリティ: デフォルトのnginxファイルを削除
RUN rm -rf /usr/share/nginx/html/50x.html 2>/dev/null || true

# キャッシュディレクトリの権限設定（非rootユーザー対応）
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# 非rootユーザーで実行
USER nginx

# Nginxポート
EXPOSE 80

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Nginxをフォアグラウンドで起動
CMD ["nginx", "-g", "daemon off;"]
