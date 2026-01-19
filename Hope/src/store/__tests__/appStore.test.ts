import { describe, it, expect, beforeEach } from "vitest"
import { useAppStore } from "../appStore"

describe("appStore", () => {
	beforeEach(() => {
		// Reset store state before each test
		useAppStore.setState({
			isLoading: true,
			loadingProgress: 0,
			isHopeMode: false,
			isVideoOverlayVisible: false,
			isVideoThumbnailVisible: false,
		})
	})

	describe("loading state", () => {
		it("should have initial loading state as true", () => {
			const state = useAppStore.getState()
			expect(state.isLoading).toBe(true)
		})

		it("should have initial loading progress as 0", () => {
			const state = useAppStore.getState()
			expect(state.loadingProgress).toBe(0)
		})

		it("should set loading to false", () => {
			useAppStore.getState().setLoading(false)
			expect(useAppStore.getState().isLoading).toBe(false)
		})

		it("should update loading progress", () => {
			useAppStore.getState().setLoadingProgress(50)
			expect(useAppStore.getState().loadingProgress).toBe(50)
		})
	})

	describe("hope mode", () => {
		it("should have initial hope mode as false", () => {
			const state = useAppStore.getState()
			expect(state.isHopeMode).toBe(false)
		})

		it("should enable hope mode", () => {
			useAppStore.getState().setHopeMode(true)
			expect(useAppStore.getState().isHopeMode).toBe(true)
		})

		it("should disable hope mode", () => {
			useAppStore.getState().setHopeMode(true)
			useAppStore.getState().setHopeMode(false)
			expect(useAppStore.getState().isHopeMode).toBe(false)
		})
	})

	describe("video overlay", () => {
		it("should have initial video overlay visibility as false", () => {
			const state = useAppStore.getState()
			expect(state.isVideoOverlayVisible).toBe(false)
		})

		it("should show video overlay", () => {
			useAppStore.getState().showVideoOverlay()
			expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
		})

		it("should hide video overlay", () => {
			useAppStore.getState().showVideoOverlay()
			useAppStore.getState().hideVideoOverlay()
			expect(useAppStore.getState().isVideoOverlayVisible).toBe(false)
		})
	})

	describe("video thumbnail", () => {
		it("should have initial video thumbnail visibility as false", () => {
			const state = useAppStore.getState()
			expect(state.isVideoThumbnailVisible).toBe(false)
		})

		it("should show video thumbnail", () => {
			useAppStore.getState().showVideoThumbnail()
			expect(useAppStore.getState().isVideoThumbnailVisible).toBe(true)
		})

		it("should hide video thumbnail", () => {
			useAppStore.getState().showVideoThumbnail()
			useAppStore.getState().hideVideoThumbnail()
			expect(useAppStore.getState().isVideoThumbnailVisible).toBe(false)
		})
	})
})
