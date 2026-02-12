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
	const originalGetContext = HTMLCanvasElement.prototype.getContext

	HTMLCanvasElement.prototype.getContext = vi.fn(function (
		this: HTMLCanvasElement,
		contextId: string,
		...args: any[]
	) {
		if (contextId === "webgl" || contextId === "webgl2") {
			return {
				// 最小限のWebGLコンテキストモック
				getParameter: vi.fn(() => 0),
				getExtension: vi.fn(() => ({})),
				createTexture: vi.fn(() => ({})),
				bindTexture: vi.fn(),
				texParameteri: vi.fn(),
				texImage2D: vi.fn(),
				clearColor: vi.fn(),
				clear: vi.fn(),
				enable: vi.fn(),
				disable: vi.fn(),
				blendFunc: vi.fn(),
				depthFunc: vi.fn(),
				viewport: vi.fn(),
				// 必要に応じてメソッドを追加
			}
		}

		// その他のコンテキスト（2dなど）は元の実装を使用
		return originalGetContext.apply(this, [contextId, ...args])
	}) as unknown as typeof HTMLCanvasElement.prototype.getContext
}
