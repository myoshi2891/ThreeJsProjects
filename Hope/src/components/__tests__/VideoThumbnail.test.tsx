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
})
