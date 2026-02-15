import { vi } from "vitest"

/**
 * YouTube ユーティリティモック
 * happy-domがiframe srcをfetchしないようモック
 */
export const mockYoutubeUtils = () => ({
	YOUTUBE_VIDEO_ID: "test-video-id",
})

/**
 * GSAP ScrollTrigger モック
 * barrelインポート経由でScrollTriggerが読み込まれ、_rafBugFixが
 * 同期RAFモックと無限再帰を起こすのを防止
 */
export const mockScrollTrigger = () => ({
	ScrollTrigger: {
		create: vi.fn(),
		getAll: vi.fn(() => []),
		refresh: vi.fn(),
	},
})

/**
 * GSAP コアライブラリモック
 */
export const mockGSAP = () => ({
	gsap: {
		timeline: vi.fn(),
		to: vi.fn(),
		registerPlugin: vi.fn(),
	},
})
