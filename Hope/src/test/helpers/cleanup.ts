import { vi } from "vitest"

/**
 * 共通テストクリーンアップ処理
 * - タイマーをリアルタイマーに戻す
 * - 全モックをリストア
 * - happy-domのpending非同期タスクをクリーンアップ
 */
export const commonCleanup = async () => {
	vi.useRealTimers()
	vi.restoreAllMocks()

	// happy-domのpending非同期タスク（iframe navigation等）をクリーンアップ
	// biome-ignore lint/suspicious/noExplicitAny: happy-dom internal API
	const happyDOM = (window as any).happyDOM
	if (happyDOM?.abort) {
		await happyDOM.abort()
	}
}

/**
 * Fullscreen API クリーンアップ
 * VideoOverlay テスト用: fullscreenElement と exitFullscreen のリセット
 */
export const cleanupFullscreenAPI = () => {
	// Prevent fullscreenElement / exitFullscreen leaking between tests
	Object.defineProperty(document, "fullscreenElement", {
		value: null,
		configurable: true,
	})
	Object.defineProperty(document, "exitFullscreen", {
		value: undefined,
		configurable: true,
		writable: true,
	})
}
