import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useAppStore } from "../../store"
import { VideoOverlay } from "../VideoOverlay"

// happy-domがiframe srcをfetchしないようモック
vi.mock("../../utils/youtube", () => ({
	YOUTUBE_VIDEO_ID: "test-video-id",
}))

// barrelインポート経由でScrollTriggerが読み込まれ、_rafBugFixが
// 同期RAFモックと無限再帰を起こすのを防止
vi.mock("gsap/ScrollTrigger", () => ({
	ScrollTrigger: {
		create: vi.fn(),
		getAll: vi.fn(() => []),
		refresh: vi.fn(),
	},
}))

vi.mock("gsap", () => ({
	gsap: {
		timeline: vi.fn(),
		to: vi.fn(),
		registerPlugin: vi.fn(),
	},
}))

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

	afterEach(async () => {
		vi.useRealTimers()
		vi.restoreAllMocks()
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
		// happy-domのpending非同期タスク（iframe navigation等）をクリーンアップ
		// biome-ignore lint/suspicious/noExplicitAny: happy-dom internal API
		const happyDOM = (window as any).happyDOM
		if (happyDOM?.abort) {
			await happyDOM.abort()
		}
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

		// Store state should not change during fade-out
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)

		// Store state updates after 500ms
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

		// Store state should not change during fade-out
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)

		// Store state updates after 500ms
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

	it("should transition store state correctly even when exitFullscreen fails", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

		// Set fullscreenElement so exitFullscreen is called
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

		// Store should transition correctly
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(false)
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(true)
	})

	it("should transition only once on rapid consecutive close clicks", () => {
		useAppStore.setState({ isVideoOverlayVisible: true })
		render(<VideoOverlay />)

		const closeBtn = screen.getByRole("button", { name: "Close video" })

		// Rapid consecutive clicks
		fireEvent.click(closeBtn)
		fireEvent.click(closeBtn)
		fireEvent.click(closeBtn)

		act(() => {
			vi.advanceTimersByTime(500)
		})

		// Store should transition only once
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(false)
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(true)
	})

	it("should not call exitFullscreen when not in fullscreen mode", () => {
		const exitFn = vi.fn(() => Promise.resolve())
		document.exitFullscreen = exitFn

		useAppStore.setState({ isVideoOverlayVisible: true })
		render(<VideoOverlay />)

		const closeBtn = screen.getByRole("button", { name: "Close video" })
		fireEvent.click(closeBtn)

		expect(exitFn).not.toHaveBeenCalled()
	})

	it("should clean up closeTimeoutRef on unmount", () => {
		useAppStore.setState({ isVideoOverlayVisible: true })
		const { unmount } = render(<VideoOverlay />)

		const closeBtn = screen.getByRole("button", { name: "Close video" })
		fireEvent.click(closeBtn)

		// Unmount before timeout completes
		unmount()

		// Store state should not change after timeout elapses
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)
	})
})
