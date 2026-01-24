import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useAppStore } from "../../store/appStore"
import { VideoOverlay } from "../VideoOverlay"

// Time utilities

describe("VideoOverlay", () => {
	beforeEach(() => {
		useAppStore.setState({
			isVideoOverlayVisible: false,
			isVideoThumbnailVisible: false,
		})
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
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

		// Should hide overlay immediately
		expect(useAppStore.getState().isVideoOverlayVisible).toBe(false)

		// Should show thumbnail after delay
		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false) // Not yet

		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(useAppStore.getState().isVideoThumbnailVisible).toBe(true)
	})

	it("should handle Escape key to close", () => {
		useAppStore.setState({ isVideoOverlayVisible: true })
		render(<VideoOverlay />)

		fireEvent.keyDown(document, { key: "Escape" })

		expect(useAppStore.getState().isVideoOverlayVisible).toBe(false)

		act(() => {
			vi.advanceTimersByTime(500)
		})
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
})
