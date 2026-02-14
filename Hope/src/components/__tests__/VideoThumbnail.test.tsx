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
			isVideoThumbnailVisible: false,
			isVideoOverlayVisible: false,
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

		// Verify requestFullscreen was called
		expect(document.documentElement.requestFullscreen).toHaveBeenCalled()

		// Should remove visible class immediately (fade out)
		const container = document.getElementById("video-thumbnail")
		expect(container).not.toHaveClass("visible")

		// Store state shouldn't change yet
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(true)

		// Fast forward 500ms (matches the component's timeout value)
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
	})

	it("should transition store state correctly when requestFullscreen is unsupported", () => {
		// Set requestFullscreen to undefined (e.g. iOS Safari)
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

		// Store state transitions correctly after 500ms
		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
	})

	it("should log error and transition store when requestFullscreen rejects with Error", async () => {
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

		// Flush promise rejection microtask
		await act(async () => {
			await vi.advanceTimersByTimeAsync(500)
		})

		// Error instance: log with message and name
		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Fullscreen not allowed"))

		// Store should transition correctly
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
	})

	it("should log fallback message when requestFullscreen rejects with non-Error", async () => {
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

		// Non-Error object: fallback log
		expect(consoleSpy).toHaveBeenCalledWith(
			"Error attempting to enable full-screen mode:",
			"string error",
		)

		// Store should transition correctly
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
	})

	it("should have correct aria-label on expand button", () => {
		render(<VideoThumbnail />)

		const expandBtn = screen.getByRole("button", {
			name: "Expand to fullscreen",
		})
		expect(expandBtn).toHaveAttribute("aria-label", "Expand to fullscreen")
	})

	it("should clean up expandTimeoutRef on unmount", () => {
		const { unmount } = render(<VideoThumbnail />)

		const expandBtn = screen.getByRole("button", {
			name: "Expand to fullscreen",
		})
		fireEvent.click(expandBtn)

		// Unmount before timeout completes
		unmount()

		// No error should occur after timeout elapses
		act(() => {
			vi.advanceTimersByTime(500)
		})
	})
})
