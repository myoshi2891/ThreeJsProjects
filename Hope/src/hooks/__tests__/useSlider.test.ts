import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useSlider } from "../useSlider"

describe("useSlider", () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should initialize with index 0", () => {
		const { result } = renderHook(() => useSlider({ totalSlides: 5 }))

		expect(result.current.currentIndex).toBe(0)
	})

	it("should increment index on goNext", () => {
		const { result } = renderHook(() => useSlider({ totalSlides: 5 }))

		act(() => {
			result.current.goNext()
		})

		expect(result.current.currentIndex).toBe(1)
	})

	it("should decrement index on goPrev", () => {
		const { result } = renderHook(() => useSlider({ totalSlides: 5 }))

		// 最初に次に進む
		act(() => {
			result.current.goNext()
		})

		// 戻る
		act(() => {
			result.current.goPrev()
		})

		expect(result.current.currentIndex).toBe(0)
	})

	it("should wrap around on goNext at last slide", () => {
		const { result } = renderHook(() => useSlider({ totalSlides: 3 }))

		// 最後まで進む（各callを個別のactで実行）
		act(() => {
			result.current.goNext() // 0 -> 1
		})
		act(() => {
			result.current.goNext() // 1 -> 2
		})
		act(() => {
			result.current.goNext() // 2 -> 0 (wrap)
		})

		expect(result.current.currentIndex).toBe(0)
	})

	it("should wrap around on goPrev at first slide", () => {
		const { result } = renderHook(() => useSlider({ totalSlides: 3 }))

		act(() => {
			result.current.goPrev()
		})

		expect(result.current.currentIndex).toBe(2) // 最後のスライドへ
	})

	it("should go to specific slide with goToSlide", () => {
		const { result } = renderHook(() => useSlider({ totalSlides: 5 }))

		act(() => {
			result.current.goToSlide(3)
		})

		expect(result.current.currentIndex).toBe(3)
	})

	it("should not go to invalid index", () => {
		const { result } = renderHook(() => useSlider({ totalSlides: 5 }))

		act(() => {
			result.current.goToSlide(-1)
		})
		expect(result.current.currentIndex).toBe(0)

		act(() => {
			result.current.goToSlide(10)
		})
		expect(result.current.currentIndex).toBe(0)
	})

	it("should auto-play when enabled", () => {
		const { result } = renderHook(() =>
			useSlider({ totalSlides: 3, autoPlay: true, autoPlayInterval: 1000 }),
		)

		expect(result.current.currentIndex).toBe(0)

		// 1秒後に次のスライドへ
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(result.current.currentIndex).toBe(1)

		// さらに1秒後
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(result.current.currentIndex).toBe(2)
	})

	it("should pause auto-play when pause is called", () => {
		const { result } = renderHook(() =>
			useSlider({ totalSlides: 3, autoPlay: true, autoPlayInterval: 1000 }),
		)

		act(() => {
			result.current.pause()
		})

		// 1秒経過しても進まない
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(result.current.currentIndex).toBe(0)
		expect(result.current.isPaused).toBe(true)
	})

	it("should resume auto-play when resume is called", () => {
		const { result } = renderHook(() =>
			useSlider({ totalSlides: 3, autoPlay: true, autoPlayInterval: 1000 }),
		)

		// 一時停止
		act(() => {
			result.current.pause()
		})

		// 再開
		act(() => {
			result.current.resume()
		})

		expect(result.current.isPaused).toBe(false)

		// 1秒後に進む
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(result.current.currentIndex).toBe(1)
	})

	it("should not auto-play when totalSlides is 1", () => {
		const { result } = renderHook(() =>
			useSlider({ totalSlides: 1, autoPlay: true, autoPlayInterval: 1000 }),
		)

		act(() => {
			vi.advanceTimersByTime(5000)
		})

		expect(result.current.currentIndex).toBe(0)
	})
})
