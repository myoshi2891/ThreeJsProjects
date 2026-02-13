import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useAppStore } from "../../store"
import { VideoThumbnail } from "../VideoThumbnail"

describe("VideoThumbnail", () => {
	beforeEach(() => {
		vi.useFakeTimers()
		// Mock requestAnimationFrame
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			cb(0)
			return 0
		})
		// Mock requestFullscreen API
		document.documentElement.requestFullscreen = vi.fn(() => Promise.resolve())
		useAppStore.setState({
			isVideoThumbnailVisible: false, // Note: Component ignores this prop and renders if parent mounts it, but good to reset logic
		})
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	it("should render and apply visible class on mount", () => {
		render(<VideoThumbnail />)

		const container = document.getElementById("video-thumbnail")
		expect(container).toBeInTheDocument()

		// RAF is mocked to run immediately
		expect(container).toHaveClass("visible")

		const iframe = document.getElementById("youtube-thumbnail-player")
		expect(iframe).toBeInTheDocument()
	})

	it("should handle expand button click", () => {
		useAppStore.setState({ isVideoThumbnailVisible: true })
		render(<VideoThumbnail />)

		const expandBtn = screen.getByRole("button", {
			name: "Expand to fullscreen",
		})
		fireEvent.click(expandBtn)

		// requestFullscreen が呼ばれたことを確認
		expect(document.documentElement.requestFullscreen).toHaveBeenCalled()

		// Should remove visible class immediately (fade out)
		const container = document.getElementById("video-thumbnail")
		expect(container).not.toHaveClass("visible")

		// Store state shouldn't change yet
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(true)

		// Fast forward (500msはコンポーネントのtimeout値と一致)
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
	})

	it("requestFullscreen未対応環境でもストア状態が正常遷移する", () => {
		// requestFullscreenをundefinedに設定（iOS Safari等）
		Object.defineProperty(document.documentElement, "requestFullscreen", {
			value: undefined,
			configurable: true,
			writable: true,
		})
		useAppStore.setState({ isVideoThumbnailVisible: true })

		render(<VideoThumbnail />)

		const expandBtn = screen.getByRole("button", {
			name: "Expand to fullscreen",
		})
		fireEvent.click(expandBtn)

		// 500ms後にストア状態が正常遷移する
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
	})

	it("requestFullscreen失敗時（Errorオブジェクト）にエラーログを出力しストアは正常遷移する", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
		document.documentElement.requestFullscreen = vi.fn(() =>
			Promise.reject(new TypeError("Fullscreen not allowed")),
		)
		useAppStore.setState({ isVideoThumbnailVisible: true })

		render(<VideoThumbnail />)

		const expandBtn = screen.getByRole("button", {
			name: "Expand to fullscreen",
		})
		fireEvent.click(expandBtn)

		// Promise rejectionのマイクロタスクを処理
		await act(async () => {
			await vi.advanceTimersByTimeAsync(500)
		})

		// Errorインスタンスの場合: メッセージとname付きのログ
		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Fullscreen not allowed"))

		// ストア状態は正常遷移
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
	})

	it("requestFullscreen失敗時（非Errorオブジェクト）にフォールバックログを出力する", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
		document.documentElement.requestFullscreen = vi.fn(() => Promise.reject("string error"))
		useAppStore.setState({ isVideoThumbnailVisible: true })

		render(<VideoThumbnail />)

		const expandBtn = screen.getByRole("button", {
			name: "Expand to fullscreen",
		})
		fireEvent.click(expandBtn)

		await act(async () => {
			await vi.advanceTimersByTimeAsync(500)
		})

		// 非Errorオブジェクトの場合: フォールバックログ
		expect(consoleSpy).toHaveBeenCalledWith(
			"Error attempting to enable full-screen mode:",
			"string error",
		)
	})

	it("expandボタンのaria-labelが正しく設定されている", () => {
		render(<VideoThumbnail />)

		const expandBtn = screen.getByRole("button", {
			name: "Expand to fullscreen",
		})
		expect(expandBtn).toHaveAttribute("aria-label", "Expand to fullscreen")
	})

	it("unmount時にexpandTimeoutRefがクリーンアップされる", () => {
		const { unmount } = render(<VideoThumbnail />)

		const expandBtn = screen.getByRole("button", {
			name: "Expand to fullscreen",
		})
		fireEvent.click(expandBtn)

		// タイムアウト完了前にアンマウント
		unmount()

		// タイムアウト経過してもエラーが発生しないことを確認
		act(() => {
			vi.advanceTimersByTime(500)
		})
	})
})
