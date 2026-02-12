import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAppStore, useSceneStore } from "../../store"
import { resetAllStores } from "../../test/helpers/storeReset"
import { createGSAPMock } from "../../test/mocks/gsap"
import { useHopeAnimation } from "../useHopeAnimation"

// 共通GSAPモックを使用
vi.mock("gsap", () => {
	const mocks = createGSAPMock()
	return {
		gsap: mocks.gsap,
	}
})

describe("useHopeAnimation", () => {
	beforeEach(() => {
		resetAllStores()
		vi.clearAllMocks()
		// Fake timersの有効化（全テスト共通）
		vi.useFakeTimers()
	})

	// テスト終了後にタイマーを戻す
	afterEach(() => {
		vi.useRealTimers()
	})

	it("startAnimation関数を返す", () => {
		const { result } = renderHook(() => useHopeAnimation())

		expect(result.current.startAnimation).toBeDefined()
		expect(typeof result.current.startAnimation).toBe("function")
	})

	it("startAnimationを実行するとhope modeが有効化される", () => {
		const { result } = renderHook(() => useHopeAnimation())

		expect(useAppStore.getState().isHopeMode).toBe(false)

		result.current.startAnimation()

		expect(useAppStore.getState().isHopeMode).toBe(true)
	})

	it("4段階のhopFactor更新が行われる（0.1→0.4→0.8→1.0）", () => {
		const { result } = renderHook(() => useHopeAnimation())

		const hopFactorHistory: number[] = []
		const unsubscribe = useSceneStore.subscribe((state) => {
			if (state.hopeFactor > 0) {
				hopFactorHistory.push(state.hopeFactor)
			}
		})

		result.current.startAnimation()

		// GSAPモックは各to()呼び出しで即座にonUpdateを実行する
		expect(hopFactorHistory).toContain(0.1)
		expect(hopFactorHistory).toContain(0.4)
		expect(hopFactorHistory).toContain(0.8)
		expect(hopFactorHistory).toContain(1)

		unsubscribe()
	})

	it("アニメーション完了後にビデオオーバーレイが表示される", async () => {
		const { result } = renderHook(() => useHopeAnimation())

		expect(useAppStore.getState().isVideoOverlayVisible).toBe(false)

		result.current.startAnimation()

		// GSAPモックはonCompleteを即座に実行するが、showVideoOverlayはsetTimeout(0)で遅延
		// Fake timersを使って時間を進める
		vi.advanceTimersByTime(10)

		expect(useAppStore.getState().isVideoOverlayVisible).toBe(true)
	})

	it("startAnimation関数はメモ化されている", () => {
		const { result, rerender } = renderHook(() => useHopeAnimation())

		const firstRender = result.current.startAnimation

		rerender()

		const secondRender = result.current.startAnimation

		expect(firstRender).toBe(secondRender)
	})

	it("GSAPタイムラインオブジェクトが返される", () => {
		const { result } = renderHook(() => useHopeAnimation())

		const timeline = result.current.startAnimation()

		expect(timeline).toBeDefined()
		expect(timeline.to).toBeDefined()
		expect(typeof timeline.to).toBe("function")
	})
})
