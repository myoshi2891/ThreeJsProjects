#!/bin/sh
# =============================================================================
# Hope Project - Docker Entrypoint Script
# =============================================================================
# 開発環境用エントリーポイント
# node_modulesが空の場合のみ依存関係をインストール
# =============================================================================

set -e

# 依存関係インストールの共通処理
install_dependencies() {
  if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
    echo "📦 Installing dependencies..."
    # rootの場合はgosuを使ってviteユーザーとして実行
    if [ "$(id -u)" = "0" ]; then
      gosu vite bun install
    else
      bun install
    fi
    echo "✅ Dependencies installed successfully"
  else
    echo "✅ Dependencies already installed"
  fi
}

# rootで実行されている場合
if [ "$(id -u)" = "0" ]; then
  # node_modulesが存在し、所有者がvite:nodejsでない場合のみ権限を修正
  # NOTE: docker-compose.dev.ymlでボリュームのマウント時にuid/gidを適切に設定することで
  # このchown処理を不要にすることができます。
  if [ -d "node_modules" ] && [ "$(stat -c '%u:%g' node_modules 2>/dev/null)" != "1001:1001" ]; then
    echo "🔧 Fixing permissions..."
    chown -R vite:nodejs node_modules 2>/dev/null || true
  fi

  install_dependencies

  # viteユーザーでコマンドを実行（gosuを使用）
  exec gosu vite "$@"
else
  # 既にviteユーザーの場合
  install_dependencies

  exec "$@"
fi
