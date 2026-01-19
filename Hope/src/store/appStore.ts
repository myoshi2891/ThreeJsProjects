import { create } from "zustand"

interface AppState {
	// Loading state
	isLoading: boolean
	loadingProgress: number

	// UI visibility
	isHopeMode: boolean
	isVideoOverlayVisible: boolean
	isVideoThumbnailVisible: boolean

	// Actions
	setLoading: (loading: boolean) => void
	setLoadingProgress: (progress: number) => void
	setHopeMode: (enabled: boolean) => void
	showVideoOverlay: () => void
	hideVideoOverlay: () => void
	showVideoThumbnail: () => void
	hideVideoThumbnail: () => void
}

export const useAppStore = create<AppState>(set => ({
	// Initial state
	isLoading: true,
	loadingProgress: 0,
	isHopeMode: false,
	isVideoOverlayVisible: false,
	isVideoThumbnailVisible: false,

	// Actions
	setLoading: loading => set({ isLoading: loading }),
	setLoadingProgress: progress => set({ loadingProgress: progress }),
	setHopeMode: enabled => set({ isHopeMode: enabled }),
	showVideoOverlay: () => set({ isVideoOverlayVisible: true }),
	hideVideoOverlay: () => set({ isVideoOverlayVisible: false }),
	showVideoThumbnail: () => set({ isVideoThumbnailVisible: true }),
	hideVideoThumbnail: () => set({ isVideoThumbnailVisible: false }),
}))
