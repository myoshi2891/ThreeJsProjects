#!/bin/sh
# =============================================================================
# Hope Project - Docker Entrypoint Script
# =============================================================================
# 開発環境用エントリーポイント
# node_modulesが空の場合のみ依存関係をインストール
# =============================================================================

set -e

# rootで実行されている場合、権限を修正
if [ "$(id -u)" = "0" ]; then
  echo "🔧 Fixing permissions..."
  chown -R vite:nodejs /app/node_modules 2>/dev/null || true

  # node_modulesが空または存在しない場合のみ、依存関係をインストール
  if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
    echo "📦 Installing dependencies..."
    su vite -c "bun install"
    echo "✅ Dependencies installed successfully"
  else
    echo "✅ Dependencies already installed"
  fi

  # viteユーザーでコマンドを実行
  exec su vite -c "exec $*"
else
  # 既にviteユーザーの場合
  if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
    echo "📦 Installing dependencies..."
    bun install
    echo "✅ Dependencies installed successfully"
  else
    echo "✅ Dependencies already installed"
  fi

  exec "$@"
fi
