import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useSceneStore } from "../../store"
import { resetAllStores } from "../../test/helpers/storeReset"
import { useScrollAnimation } from "../useScrollAnimation"

// 共通GSAPモック
// テスト内で検証するためのグローバルな参照用変数
interface MockScrollTrigger {
	config: Record<string, unknown>
	killed: boolean
	kill: () => void
}

const { scrollTriggersRef } = vi.hoisted(() => {
	return { scrollTriggersRef: [] as MockScrollTrigger[] }
})

vi.mock("gsap", async () => {
	const { createGSAPMock } = await import("../../test/mocks/gsap")
	// scrollTriggersRef を注入してモックを作成
	const mocks = createGSAPMock(scrollTriggersRef)
	return {
		gsap: mocks.gsap,
	}
})

// ScrollTrigger.createのモック
vi.mock("gsap/ScrollTrigger", async () => {
	const { createGSAPMock } = await import("../../test/mocks/gsap")
	// 同じ scrollTriggersRef を使用して整合性を保つ
	const mocks = createGSAPMock(scrollTriggersRef)
	return {
		ScrollTrigger: mocks.ScrollTrigger,
	}
})

/** ScrollTriggerのonUpdateコールバックを型安全に呼び出すヘルパー */
function invokeOnUpdate(trigger: MockScrollTrigger, args: { progress: number; direction: number }) {
	const onUpdate = trigger.config.onUpdate as
		| ((args: { progress: number; direction: number }) => void)
		| undefined
	if (onUpdate) onUpdate(args)
}

/** ScrollTriggerのライフサイクルコールバックを型安全に呼び出すヘルパー */
function invokeCallback(trigger: MockScrollTrigger, name: string) {
	const cb = trigger.config[name] as (() => void) | undefined
	if (cb) cb()
}

describe("useScrollAnimation", () => {
	let nav: HTMLElement
	let bgImage: HTMLElement
	let storyContent1: HTMLElement
	let storyContent2: HTMLElement
	let experienceContent: HTMLElement

	beforeEach(() => {
		resetAllStores()
		vi.clearAllMocks()
		// ScrollTriggersの配列リセット
		scrollTriggersRef.length = 0

		// DOM要素のセットアップ
		document.body.innerHTML = ""

		nav = document.createElement("nav")
		nav.id = "nav"
		document.body.appendChild(nav)

		bgImage = document.createElement("div")
		bgImage.id = "bg-image"
		document.body.appendChild(bgImage)

		storyContent1 = document.createElement("div")
		storyContent1.className = "story-content"
		document.body.appendChild(storyContent1)

		storyContent2 = document.createElement("div")
		storyContent2.className = "story-content"
		document.body.appendChild(storyContent2)

		experienceContent = document.createElement("div")
		experienceContent.className = "experience-content"
		document.body.appendChild(experienceContent)
	})

	it("ScrollTriggerが初期化される", () => {
		renderHook(() => useScrollAnimation())

		// ScrollTriggerが作成されていることを確認
		expect(scrollTriggersRef.length).toBeGreaterThan(0)
	})

	it("複数回レンダリングしても初期化は一度のみ", () => {
		const { rerender } = renderHook(() => useScrollAnimation())

		const initialTriggerCount = scrollTriggersRef.length

		rerender()

		const afterRerenderTriggerCount = scrollTriggersRef.length

		expect(afterRerenderTriggerCount).toBe(initialTriggerCount)
	})

	it("スクロール時にnavにscrolledクラスが追加される", () => {
		renderHook(() => useScrollAnimation())

		expect(nav.classList.contains("scrolled")).toBe(false)

		// ScrollTriggerのonUpdateコールバックをシミュレート
		const navTrigger = scrollTriggersRef.find((t) => t.config.start === "top -80")
		expect(navTrigger).toBeDefined()

		if (navTrigger) invokeOnUpdate(navTrigger, { progress: 0.5, direction: 1 })

		expect(nav.classList.contains("scrolled")).toBe(true)
	})

	it("スクロールが最上部に戻るとnavからscrolledクラスが削除される", () => {
		renderHook(() => useScrollAnimation())

		// まずscrolledクラスを追加
		nav.classList.add("scrolled")

		const navTrigger = scrollTriggersRef.find((t) => t.config.start === "top -80")
		if (navTrigger) invokeOnUpdate(navTrigger, { progress: 0, direction: -1 })

		expect(nav.classList.contains("scrolled")).toBe(false)
	})

	it("背景画像のフィルタがスクロール進捗に応じて更新される", () => {
		renderHook(() => useScrollAnimation())

		// 修正: 確実にターゲットと一致するトリガーを見つける
		// 実装では trigger: "body", start: "top top" が背景用
		const bgTrigger = scrollTriggersRef.find(
			(t) => t.config.trigger === "body" && t.config.start === "top top" && t.config.onUpdate,
		)
		expect(bgTrigger).toBeDefined()
		expect(bgTrigger?.config.onUpdate).toBeDefined()

		if (bgTrigger) invokeOnUpdate(bgTrigger, { progress: 0.5, direction: 1 })

		// brightness: 0.4 + 0.5 * 0.4 = 0.6
		// saturation: 0.8 + 0.5 * 0.3 = 0.95
		expect(bgImage.style.filter).toContain("brightness(0.60)")
		expect(bgImage.style.filter).toContain("saturate(0.95)")
	})

	it("背景フィルタの変化が閾値未満の場合、DOM更新がスキップされる", () => {
		renderHook(() => useScrollAnimation())

		const bgTrigger = scrollTriggersRef.find(
			(t) => t.config.trigger === "body" && t.config.start === "top top" && t.config.onUpdate,
		)

		// 初回更新
		if (bgTrigger) invokeOnUpdate(bgTrigger, { progress: 0.5, direction: 1 })

		const initialFilter = bgImage.style.filter

		// 微小な進捗変化（0.02未満）
		if (bgTrigger) invokeOnUpdate(bgTrigger, { progress: 0.501, direction: 1 })

		// フィルタは更新されない（スロットリング）
		expect(bgImage.style.filter).toBe(initialFilter)
	})

	it("スクロール進捗がストアに保存される", () => {
		renderHook(() => useScrollAnimation())

		const bgTrigger = scrollTriggersRef.find(
			(t) => t.config.trigger === "body" && t.config.start === "top top" && t.config.onUpdate,
		)

		if (bgTrigger) invokeOnUpdate(bgTrigger, { progress: 0.75, direction: 1 })

		expect(useSceneStore.getState().scrollProgress).toBe(0.75)
	})

	it("Story要素にvisibleクラスがトグルされる", () => {
		renderHook(() => useScrollAnimation())

		const storyTriggers = scrollTriggersRef.filter(
			(t) =>
				t.config.trigger instanceof HTMLElement &&
				t.config.trigger.classList.contains("story-content"),
		)

		expect(storyTriggers.length).toBe(2)

		const trigger = storyTriggers[0]

		invokeCallback(trigger, "onEnter")
		expect(storyContent1.classList.contains("visible")).toBe(true)

		invokeCallback(trigger, "onLeave")
		expect(storyContent1.classList.contains("visible")).toBe(false)

		invokeCallback(trigger, "onEnterBack")
		expect(storyContent1.classList.contains("visible")).toBe(true)

		invokeCallback(trigger, "onLeaveBack")
		expect(storyContent1.classList.contains("visible")).toBe(false)
	})

	it("Experience要素にvisibleクラスがトグルされる", () => {
		renderHook(() => useScrollAnimation())

		const experienceTrigger = scrollTriggersRef.find(
			(t) =>
				t.config.trigger instanceof HTMLElement &&
				t.config.trigger.classList.contains("experience-content"),
		)

		expect(experienceTrigger).toBeDefined()

		if (experienceTrigger) {
			invokeCallback(experienceTrigger, "onEnter")
			expect(experienceContent.classList.contains("visible")).toBe(true)

			invokeCallback(experienceTrigger, "onLeaveBack")
			expect(experienceContent.classList.contains("visible")).toBe(false)
		}
	})

	it("unmount時に全てのScrollTriggerがクリーンアップされる", () => {
		const { unmount } = renderHook(() => useScrollAnimation())

		const triggerCount = scrollTriggersRef.length
		expect(triggerCount).toBeGreaterThan(0)

		unmount()

		// 全てのトリガーのkill()が呼ばれたことを確認
		for (const trigger of scrollTriggersRef) {
			expect(trigger.killed).toBe(true)
		}
	})

	it("bg-image要素が存在しない場合でもエラーが発生しない", () => {
		bgImage.remove()

		expect(() => renderHook(() => useScrollAnimation())).not.toThrow()
	})

	it("nav要素が存在しない場合でもエラーが発生しない", () => {
		nav.remove()

		expect(() => renderHook(() => useScrollAnimation())).not.toThrow()
	})

	it("背景パララックスアニメーションが設定されている（ScrollTriggerの設定確認）", () => {
		renderHook(() => useScrollAnimation())

		// 背景画像が存在する
		expect(bgImage).toBeTruthy()

		const bgTrigger = scrollTriggersRef.find(
			(t) => t.config.trigger === "body" && t.config.start === "top top",
		)

		expect(bgTrigger).toBeDefined()
		expect(bgTrigger?.config.scrub).toBe(3)
		expect(typeof bgTrigger?.config.onUpdate).toBe("function")
	})
})
