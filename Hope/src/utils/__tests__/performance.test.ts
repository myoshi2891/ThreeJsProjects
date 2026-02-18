import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { _resetMobileCache, calculateRainCount, isMobileDevice } from "../performance"

describe("isMobileDevice", () => {
	let originalMatchMedia: typeof window.matchMedia

	beforeEach(() => {
		_resetMobileCache()
		originalMatchMedia = window.matchMedia
	})

	afterEach(() => {
		// ontouchstart を削除（追加した場合のみ）
		if ("ontouchstart" in window) {
			delete (window as unknown as Record<string, unknown>).ontouchstart
		}
		Object.defineProperty(navigator, "maxTouchPoints", {
			value: 0,
			configurable: true,
		})
		window.matchMedia = originalMatchMedia
		_resetMobileCache()
	})

	it("should return false in test environment (no touch support)", () => {
		expect(isMobileDevice()).toBe(false)
	})

	it("should return true when ontouchstart is present", () => {
		;(window as unknown as Record<string, unknown>).ontouchstart = null
		expect(isMobileDevice()).toBe(true)
	})

	it("should return true when maxTouchPoints > 0", () => {
		Object.defineProperty(navigator, "maxTouchPoints", {
			value: 5,
			configurable: true,
		})
		expect(isMobileDevice()).toBe(true)
	})

	it("should return true when pointer is coarse", () => {
		window.matchMedia = vi.fn().mockImplementation((query: string) => ({
			matches: query === "(pointer: coarse)",
			media: query,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		}))
		expect(isMobileDevice()).toBe(true)
	})

	it("should cache result after first call", () => {
		// 1回目: false（デスクトップ環境）
		expect(isMobileDevice()).toBe(false)

		// ontouchstart を追加してもキャッシュが返る
		;(window as unknown as Record<string, unknown>).ontouchstart = null
		expect(isMobileDevice()).toBe(false)
	})

	it("should re-evaluate after cache reset", () => {
		expect(isMobileDevice()).toBe(false)

		_resetMobileCache()
		;(window as unknown as Record<string, unknown>).ontouchstart = null
		expect(isMobileDevice()).toBe(true)
	})

	describe("SSR environment (window unavailable)", () => {
		afterEach(() => {
			vi.unstubAllGlobals()
			_resetMobileCache()
		})

		it("should return false when window is undefined", () => {
			_resetMobileCache()
			vi.stubGlobal("window", undefined)

			expect(isMobileDevice()).toBe(false)
		})

		it("should cache false for SSR and retain cached value after window restoration", () => {
			_resetMobileCache()
			vi.stubGlobal("window", undefined)

			// SSR パスで false をキャッシュ
			expect(isMobileDevice()).toBe(false)

			vi.unstubAllGlobals()

			// window 復元後もキャッシュが返る（リセットなし）
			expect(isMobileDevice()).toBe(false)
		})
	})
})

describe("calculateRainCount", () => {
	let originalDPR: number
	let originalCores: number | undefined

	beforeEach(() => {
		_resetMobileCache()
		// 元の値を保存
		originalDPR = globalThis.devicePixelRatio
		originalCores = globalThis.navigator.hardwareConcurrency
	})

	afterEach(() => {
		// 元の値に復元
		Object.defineProperty(globalThis, "devicePixelRatio", {
			value: originalDPR,
			configurable: true,
			writable: true,
		})
		Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
			value: originalCores,
			configurable: true,
		})
		_resetMobileCache()
	})

	describe("Performance tier: low (score < 0.75)", () => {
		it("should return 800 for low-end device (dpr=1, cores=2)", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 1,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 2,
				configurable: true,
			})

			// score = (1/2) * 0.6 + (2/8) * 0.4 = 0.3 + 0.1 = 0.4
			expect(calculateRainCount()).toBe(800)
		})

		it("should return 800 for boundary case (dpr=1, cores=4)", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 1,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 4,
				configurable: true,
			})

			// score = (1/2) * 0.6 + (4/8) * 0.4 = 0.3 + 0.2 = 0.5
			expect(calculateRainCount()).toBe(800)
		})
	})

	describe("Performance tier: medium (0.75 <= score < 1.5)", () => {
		it("should return 2000 for mid-range device (dpr=2, cores=4)", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 2,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 4,
				configurable: true,
			})

			// score = (2/2) * 0.6 + (4/8) * 0.4 = 0.6 + 0.2 = 0.8
			expect(calculateRainCount()).toBe(2000)
		})

		it("should return 2000 for lower boundary (dpr=2.5, cores=4)", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 2.5,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 4,
				configurable: true,
			})

			// score = (2.5/2) * 0.6 + (4/8) * 0.4 = 0.75 + 0.2 = 0.95
			expect(calculateRainCount()).toBe(2000)
		})

		it("should return 2000 for upper boundary (dpr=2, cores=16)", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 2,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 16,
				configurable: true,
			})

			// score = (2/2) * 0.6 + (16/8) * 0.4 = 0.6 + 0.8 = 1.4
			expect(calculateRainCount()).toBe(2000)
		})
	})

	describe("Performance tier: high (1.5 <= score)", () => {
		it("should return 4000 for high-end device (dpr=3, cores=16)", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 3,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 16,
				configurable: true,
			})

			// score = (3/2) * 0.6 + (16/8) * 0.4 = 0.9 + 0.8 = 1.7
			expect(calculateRainCount()).toBe(4000)
		})

		it("should return 4000 for boundary case (dpr=4, cores=8)", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 4,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 8,
				configurable: true,
			})

			// score = (4/2) * 0.6 + (8/8) * 0.4 = 1.2 + 0.4 = 1.6
			expect(calculateRainCount()).toBe(4000)
		})
	})

	describe("Real device scenarios", () => {
		it("should return 800 for iPhone SE (dpr=2, cores=2)", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 2,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 2,
				configurable: true,
			})

			// score = (2/2) * 0.6 + (2/8) * 0.4 = 0.6 + 0.1 = 0.7
			expect(calculateRainCount()).toBe(800)
		})

		it("should return 2000 for MacBook Pro (dpr=2, cores=8)", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 2,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 8,
				configurable: true,
			})

			// score = (2/2) * 0.6 + (8/8) * 0.4 = 0.6 + 0.4 = 1.0
			expect(calculateRainCount()).toBe(2000)
		})

		it("should return 2000 for Gaming PC (dpr=1, cores=16)", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 1,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 16,
				configurable: true,
			})

			// score = (1/2) * 0.6 + (16/8) * 0.4 = 0.3 + 0.8 = 1.1
			expect(calculateRainCount()).toBe(2000)
		})

		it("should return 4000 for high-spec workstation (dpr=2, cores=32)", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 2,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 32,
				configurable: true,
			})

			// score = (2/2) * 0.6 + (32/8) * 0.4 = 0.6 + 1.6 = 2.2
			expect(calculateRainCount()).toBe(4000)
		})
	})

	describe("Fallback handling", () => {
		it("should return 800 when devicePixelRatio is undefined", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: undefined,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: 4,
				configurable: true,
			})

			// デフォルト値 dpr=1 が使われる
			// score = (1/2) * 0.6 + (4/8) * 0.4 = 0.3 + 0.2 = 0.5
			expect(calculateRainCount()).toBe(800)
		})

		it("should return 2000 when hardwareConcurrency is undefined", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: 2,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: undefined,
				configurable: true,
			})

			// デフォルト値 cores=4 が使われる
			// score = (2/2) * 0.6 + (4/8) * 0.4 = 0.6 + 0.2 = 0.8
			expect(calculateRainCount()).toBe(2000)
		})

		it("should return 800 when both values are undefined", () => {
			Object.defineProperty(globalThis, "devicePixelRatio", {
				value: undefined,
				configurable: true,
				writable: true,
			})
			Object.defineProperty(globalThis.navigator, "hardwareConcurrency", {
				value: undefined,
				configurable: true,
			})

			// デフォルト値 dpr=1, cores=4 が使われる
			// score = (1/2) * 0.6 + (4/8) * 0.4 = 0.3 + 0.2 = 0.5
			expect(calculateRainCount()).toBe(800)
		})

		it("should return 2000 when exception occurs", () => {
			// globalThis アクセスで例外を発生させる
			vi.spyOn(globalThis, "devicePixelRatio", "get").mockImplementation(() => {
				throw new Error("Test error")
			})

			expect(calculateRainCount()).toBe(2000)
		})
	})
})
