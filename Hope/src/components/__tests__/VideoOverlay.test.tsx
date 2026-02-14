import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useAppStore } from "../../store"
import { VideoOverlay } from "../VideoOverlay"

// Time utilities

describe("VideoOverlay", () => {
	beforeEach(() => {
		useAppStore.setState({
			isVideoOverlayVisible: false,
			isVideoThumbnailVisible: false,
		})
		vi.useFakeTimers()
		// Mock requestAnimationFrame for fade-in animation
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			cb(0)
			return 0
		})
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		// fullscreenElement/exitFullscreenのリーク防止
		Object.defineProperty(document, "fullscreenElement", {
			value: null,
			configurable: true,
		})
	})

	it("should not render when isVideoOverlayVisible is false", () => {
		render(<VideoOverlay />)
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
		// Or check for container ID
		const overlay = document.getElementById("video-overlay")
		expect(overlay).not.toBeInTheDocument()
	})

	it("should render when visible with correct iframe configuration", () => {
		useAppStore.setState({ isVideoOverlayVisible: true })
		render(<VideoOverlay />)

		// Check overlay element
		const overlay = document.getElementById("video-overlay")
		expect(overlay).toBeInTheDocument()
		expect(overlay).toHaveClass("visible")

		// Check Iframe
		const iframe = document.getElementById("youtube-player")
		expect(iframe).toBeInTheDocument()
		expect(iframe).toHaveAttribute("title", "Hope Video")
		expect(iframe).toHaveAttribute("allowFullScreen")

		// Check URL (with fallback check if env mock needed, but default behavior is used)
	})

	it("should handle close button click", () => {
		useAppStore.setState({ isVideoOverlayVisible: true })
		render(<VideoOverlay />)

		const closeBtn = screen.getByRole("button", { name: "Close video" })
		fireEvent.click(closeBtn)

		// フェードアウト中はストア状態はまだ変更されていない
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)

		// 500ms後にストア状態が更新される
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(useAppStore.getState().isVideoOverlayVisible).toBe(false)
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(true)
	})

	it("should handle Escape key to close", () => {
		useAppStore.setState({ isVideoOverlayVisible: true })
		render(<VideoOverlay />)

		fireEvent.keyDown(document, { key: "Escape" })

		// フェードアウト中はストア状態はまだ変更されていない
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)

		// 500ms後にストア状態が更新される
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(useAppStore.getState().isVideoOverlayVisible).toBe(false)
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(true)
	})

	it("should ignore Escape key when not visible", () => {
		// This is hard to test via store state change since component unmounts,
		// but we can verify that the listener is cleaned up.
		useAppStore.setState({ isVideoOverlayVisible: true })
		const { unmount } = render(<VideoOverlay />)

		// Unmount (simulating hiding state where component returns null)
		unmount()

		// Reset store manually to ensure we track if logic triggers accidentally
		useAppStore.setState({
			isVideoOverlayVisible: false,
			isVideoThumbnailVisible: false,
		}) // Reset target

		fireEvent.keyDown(document, { key: "Escape" })

		// Timers shouldn't matter as logic shouldn't run
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)
	})

	it("exitFullscreen失敗時でもストア状態が正常遷移する", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

		// fullscreenElementを設定してexitFullscreenが呼ばれるようにする
		Object.defineProperty(document, "fullscreenElement", {
			value: document.documentElement,
			configurable: true,
		})
		document.exitFullscreen = vi.fn(() => Promise.reject(new Error("Exit fullscreen failed")))

		useAppStore.setState({ isVideoOverlayVisible: true })
		render(<VideoOverlay />)

		const closeBtn = screen.getByRole("button", { name: "Close video" })
		fireEvent.click(closeBtn)

		await act(async () => {
			await vi.advanceTimersByTimeAsync(500)
		})

		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Exit fullscreen failed"))

		// ストア状態は正常遷移
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(false)
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(true)
	})

	it("closingRef二重発火防止: 連続クリックで1回のみ遷移する", () => {
		useAppStore.setState({ isVideoOverlayVisible: true })
		render(<VideoOverlay />)

		const closeBtn = screen.getByRole("button", { name: "Close video" })

		// 連続クリック
		fireEvent.click(closeBtn)
		fireEvent.click(closeBtn)
		fireEvent.click(closeBtn)

		act(() => {
			vi.advanceTimersByTime(500)
		})

		// ストア状態は1回のみ遷移
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(false)
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(true)
	})

	it("フルスクリーンでない時はexitFullscreenが呼ばれない", () => {
		const exitFn = vi.fn(() => Promise.resolve())
		document.exitFullscreen = exitFn

		useAppStore.setState({ isVideoOverlayVisible: true })
		render(<VideoOverlay />)

		const closeBtn = screen.getByRole("button", { name: "Close video" })
		fireEvent.click(closeBtn)

		expect(exitFn).not.toHaveBeenCalled()
	})

	it("unmount時にcloseTimeoutRefがクリーンアップされる", () => {
		useAppStore.setState({ isVideoOverlayVisible: true })
		const { unmount } = render(<VideoOverlay />)

		const closeBtn = screen.getByRole("button", { name: "Close video" })
		fireEvent.click(closeBtn)

		// タイムアウト完了前にアンマウント
		unmount()

		// タイムアウト経過してもストア状態が変化しない
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)
	})
})
