# =============================================================================
# Hope Project Makefile
# =============================================================================

.PHONY: help dev prod down clean logs shell format lint restart-dev restart-prod

# デフォルトターゲット: ヘルプを表示
help:
	@echo "使用可能なコマンド:"
	@echo "  make dev           - 開発環境を起動 (ホットリロード有効)"
	@echo "  make prod          - 本番環境を起動 (Nginx静的配信)"
	@echo "  make down          - コンテナとネットワークを停止・削除"
	@echo "  make clean         - プロジェクトのコンテナ、ボリューム、ローカルイメージを削除"
	@echo "  make logs          - ログを表示 (フォローモード)"
	@echo "  make shell         - 実行中のコンテナに入る (/bin/sh)"
	@echo "  make format        - コードのフォーマット (Biome)"
	@echo "  make lint          - コードのLint (Biome)"
	@echo "  make restart-dev   - 開発環境を再起動 (停止 → 起動)"
	@echo "  make restart-prod  - 本番環境を再起動 (停止 → 起動)"

# -----------------------------------------------------------------------------
# 実行コマンド
# -----------------------------------------------------------------------------

# 開発環境 (docker-compose.dev.yml)
dev:
	@echo "Starting Development Environment..."
	docker compose -f docker-compose.dev.yml up

# 本番環境 (docker-compose.yml)
prod:
	@echo "Starting Production Environment..."
	docker compose up -d

# 停止 (共通)
down:
	@echo "Stopping resources..."
	docker compose -f docker-compose.dev.yml down --remove-orphans || true
	docker compose down --remove-orphans || true

# プロジェクトのクリーンアップ (コンテナ、ボリューム、ローカルイメージを削除)
clean: down
	@echo "Cleaning up project Docker resources..."
	docker compose -f docker-compose.dev.yml down --volumes --rmi local || true
	docker compose down --volumes --rmi local || true
	@echo "Cleanup complete."

# ログ表示
logs:
	docker compose -f docker-compose.dev.yml logs -f || docker compose logs -f

# コンテナシェル
shell:
	docker compose -f docker-compose.dev.yml exec hope-dev /bin/sh || docker compose exec hope /bin/sh

# -----------------------------------------------------------------------------
# ユーティリティ
# -----------------------------------------------------------------------------

format:
	docker compose -f docker-compose.dev.yml exec hope-dev npm run format

lint:
	docker compose -f docker-compose.dev.yml exec hope-dev npm run lint

# 再起動ショートカット (停止 → 起動)
restart-dev: down dev

restart-prod: down prod
