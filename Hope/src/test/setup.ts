import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

// 各テスト後に自動クリーンアップ
afterEach(() => {
	cleanup()
})

// グローバルなrequestAnimationFrameのモック（アニメーション系テスト用）
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
	return setTimeout(() => callback(Date.now()), 0) as unknown as number
}

globalThis.cancelAnimationFrame = (id: number) => {
	clearTimeout(id)
}

// ResizeObserverのモック（Three.jsコンポーネント用）
globalThis.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

// WebGLのモック（Three.js用）
if (typeof HTMLCanvasElement !== "undefined") {
	HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
		if (contextId === "webgl" || contextId === "webgl2") {
			return {} // 最小限のモック
		}
		return null
	}) as unknown as typeof HTMLCanvasElement.prototype.getContext
}
