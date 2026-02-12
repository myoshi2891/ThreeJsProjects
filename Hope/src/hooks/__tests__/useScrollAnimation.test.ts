import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useSceneStore } from "../../store"
import { resetAllStores } from "../../test/helpers/storeReset"
import { createGSAPMock } from "../../test/mocks/gsap"
import { useScrollAnimation } from "../useScrollAnimation"

// 共通GSAPモック
// 注: vi.mock内で外部変数（mocks）を参照できないため、
// テスト内で検証するためのグローバルな参照用変数を用意するか、
// import("gsap/ScrollTrigger")して検証する
const scrollTriggersRef: any[] = []

vi.mock("gsap", () => {
	const mocks = createGSAPMock()
	return {
		gsap: mocks.gsap,
	}
})

// ScrollTrigger.createのモック
vi.mock("gsap/ScrollTrigger", () => {
	// 参照用に外に出すトリック（完全にsafeではないがテスト用）
	// ただし、vi.mockはhoistingされるため、ここでの副作用は期待通り動かない可能性がある。
	// 代わりに、createGSAPMockの挙動を再現するか、
	// モジュール全体をモックして、getMockImplementationでアクセスする。

	// ここではシンプルに、createGSAPMockを使って新しくインスタンスを作るが、
	// テストケースからその内部状態（scrollTriggers）にアクセスできない問題がある。

	// 解決策: createGSAPMockを直接使うのではなく、
	// テストファイル内で独自のモック定義を行うか、
	// あるいは __mocks__ ディレクトリを使うのが正攻法だが、
	// ここでは inline mock で createGSAPMock を呼んでいる。

	// scrollTriggers の参照を共有するために、
	// createGSAPMock が返す scrollTriggers 配列は
	// 毎回新しい配列である。

	// 共有状態を持つシングルトン的なモックファクトリが必要かもしれないが、
	// Vitestのhoisting制約があるため、外部変数の参照はNG。

	// 妥協案: このファイル内では createGSAPMock を使わず、
	// 以前のように inline で定義しつつ、
	// createGSAPMock のロジックをコピーするか、
	// createGSAPMock を改善して状態を共有できるようにする。

	// 今回は、テストファイル内で定義することで確実にアクセスできるようにする（以前のアプローチに戻す）。
	// ただし、createGSAPMock は使いたい。

	return {
		ScrollTrigger: {
			create: (config: any) => {
				const trigger = {
					config,
					killed: false,
					kill: function (this: { killed: boolean }) {
						this.killed = true
					},
				}
				scrollTriggersRef.push(trigger)
				return trigger
			},
			getAll: () => scrollTriggersRef,
		},
	}
})

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

		if (navTrigger?.config.onUpdate) {
			navTrigger.config.onUpdate({ progress: 0.5, direction: 1 })
		}

		expect(nav.classList.contains("scrolled")).toBe(true)
	})

	it("スクロールが最上部に戻るとnavからscrolledクラスが削除される", () => {
		renderHook(() => useScrollAnimation())

		// まずscrolledクラスを追加
		nav.classList.add("scrolled")

		const navTrigger = scrollTriggersRef.find((t) => t.config.start === "top -80")
		if (navTrigger?.config.onUpdate) {
			navTrigger.config.onUpdate({ progress: 0, direction: -1 })
		}

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

		if (bgTrigger?.config.onUpdate) {
			bgTrigger.config.onUpdate({ progress: 0.5, direction: 1 })
		}

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
		if (bgTrigger?.config.onUpdate) {
			bgTrigger.config.onUpdate({ progress: 0.5, direction: 1 })
		}

		const initialFilter = bgImage.style.filter

		// 微小な進捗変化（0.02未満）
		if (bgTrigger?.config.onUpdate) {
			bgTrigger.config.onUpdate({ progress: 0.501, direction: 1 })
		}

		// フィルタは更新されない（スロットリング）
		expect(bgImage.style.filter).toBe(initialFilter)
	})

	it("スクロール進捗がストアに保存される", () => {
		renderHook(() => useScrollAnimation())

		const bgTrigger = scrollTriggersRef.find(
			(t) => t.config.trigger === "body" && t.config.start === "top top" && t.config.onUpdate,
		)

		if (bgTrigger?.config.onUpdate) {
			bgTrigger.config.onUpdate({ progress: 0.75, direction: 1 })
		}

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

		// onEnterをシミュレート
		const trigger = storyTriggers[0]
		if (trigger.config.onEnter) {
			trigger.config.onEnter()
		}

		expect(storyContent1.classList.contains("visible")).toBe(true)

		// onLeaveをシミュレート
		if (trigger.config.onLeave) {
			trigger.config.onLeave()
		}

		expect(storyContent1.classList.contains("visible")).toBe(false)

		// onEnterBackをシミュレート
		if (trigger.config.onEnterBack) {
			trigger.config.onEnterBack()
		}

		expect(storyContent1.classList.contains("visible")).toBe(true)

		// onLeaveBackをシミュレート
		if (trigger.config.onLeaveBack) {
			trigger.config.onLeaveBack()
		}

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

		// onEnterをシミュレート
		if (experienceTrigger?.config.onEnter) {
			experienceTrigger.config.onEnter()
		}

		expect(experienceContent.classList.contains("visible")).toBe(true)

		// onLeaveBackをシミュレート
		if (experienceTrigger?.config.onLeaveBack) {
			experienceTrigger.config.onLeaveBack()
		}

		expect(experienceContent.classList.contains("visible")).toBe(false)
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

		// 背景パララックス用のトリガーが存在することを確認
		// 実装: scrollTrigger: { trigger: "#bg-image", scrub: true, ... } ではなく、
		// GSAP.to("#bg-image", { scrollTrigger: { ... } }) の形式かもしれないし、
		// ScrollTrigger.create({...}) かもしれない。
		// このテストファイル上部の定義では ScrollTrigger.create がフック内で呼ばれていると仮定。

		// 実装(useScrollAnimation.ts)を見ると:
		/*
		ScrollTrigger.create({
			trigger: "body",
			start: "top top",
			end: "bottom bottom",
			scrub: 0.5,
			onUpdate: (self) => { ... }
		})
		*/

		const bgTrigger = scrollTriggersRef.find(
			(t) => t.config.trigger === "body" && t.config.start === "top top",
		)

		expect(bgTrigger).toBeDefined()
		expect(bgTrigger?.config.scrub).toBe(3)
		expect(typeof bgTrigger?.config.onUpdate).toBe("function")
	})
})
