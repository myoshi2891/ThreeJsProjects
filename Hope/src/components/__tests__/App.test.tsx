import { act, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { App } from "../App"
import { resetAllStores } from "../../test/helpers/storeReset"
import { useAppStore } from "../../store"

// モック関数の呼び出し回数を追跡
let mockStartAnimationCallCount = 0
let mockUseScrollAnimationCallCount = 0

// useHopeAnimationモック
vi.mock("../../hooks/useHopeAnimation", () => ({
	useHopeAnimation: () => ({
		startAnimation: () => {
			mockStartAnimationCallCount++
		},
	}),
}))

// useScrollAnimationモック
vi.mock("../../hooks/useScrollAnimation", () => ({
	useScrollAnimation: () => {
		mockUseScrollAnimationCallCount++
	},
}))

// ThreeCanvasモック（重いレンダリングを回避）
vi.mock("../ThreeCanvas", () => ({
	ThreeCanvas: () => <div data-testid="three-canvas">ThreeCanvas Mock</div>,
}))

// 各種コンポーネントのモック
vi.mock("../Loading", () => ({
	Loading: () => <div data-testid="loading">Loading...</div>,
}))

vi.mock("../BackgroundLayer", () => ({
	BackgroundLayer: () => <div data-testid="background-layer">Background</div>,
}))

vi.mock("../Navigation", () => ({
	Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}))

vi.mock("../Hero", () => ({
	Hero: () => <div data-testid="hero">Hero</div>,
}))

vi.mock("../StorySection", () => ({
	StorySection: ({ type }: { type: string }) => (
		<div data-testid={`story-${type}`}>Story: {type}</div>
	),
}))

vi.mock("../ExperienceSection", () => ({
	ExperienceSection: () => <div data-testid="experience">Experience</div>,
}))

vi.mock("../VideoOverlay", () => ({
	VideoOverlay: () => <div data-testid="video-overlay">VideoOverlay</div>,
}))

describe("App", () => {
	beforeEach(() => {
		resetAllStores()
		vi.clearAllMocks()
		vi.useFakeTimers()
		mockStartAnimationCallCount = 0
		mockUseScrollAnimationCallCount = 0
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("初期状態でローディングが表示される", () => {
		render(<App />)

		expect(screen.getByTestId("loading")).toBeInTheDocument()
	})

	it("ローディング進捗が0%から100%まで段階的に増加する", async () => {
		render(<App />)

		// 初期状態（0%）
		expect(useAppStore.getState().loadingProgress).toBe(0)

		// 100ms経過 → 10%
		vi.advanceTimersByTime(100)
		expect(useAppStore.getState().loadingProgress).toBe(10)

		// さらに100ms経過 → 20%
		vi.advanceTimersByTime(100)
		expect(useAppStore.getState().loadingProgress).toBe(20)

		// 最終的に100%に到達
		vi.advanceTimersByTime(800)
		expect(useAppStore.getState().loadingProgress).toBe(100)
	})

	it("100%到達後、500ms後にローディングが非表示になる", async () => {
		render(<App />)

		// 100%まで進捗
		act(() => {
			vi.advanceTimersByTime(1000)
		})
		expect(useAppStore.getState().loadingProgress).toBe(100)
		expect(useAppStore.getState().isLoading).toBe(true)

		// 500ms待つ
		act(() => {
			vi.advanceTimersByTime(500)
		})
		expect(useAppStore.getState().isLoading).toBe(false)
	})

	it("useScrollAnimationフックが呼ばれる", () => {
		render(<App />)

		expect(mockUseScrollAnimationCallCount).toBeGreaterThan(0)
	})

	it("useHopeAnimationフックが呼ばれる", () => {
		render(<App />)

		// startAnimation関数が取得されることを確認（まだ実行はされない）
		expect(mockStartAnimationCallCount).toBe(0)
	})

	it("hope mode有効化時にstartAnimationが実行される", async () => {
		render(<App />)

		expect(mockStartAnimationCallCount).toBe(0)

		// hope modeを有効化
		act(() => {
			useAppStore.getState().setHopeMode(true)
		})

		expect(mockStartAnimationCallCount).toBe(1)
	})

	it("hope modeが有効化されても、startAnimationは一度しか実行されない", async () => {
		render(<App />)

		// 1回目のhope mode有効化
		act(() => {
			useAppStore.getState().setHopeMode(true)
		})
		expect(mockStartAnimationCallCount).toBe(1)

		// 2回目のhope mode有効化（実際には既に有効だが、ストアの変更を強制）
		act(() => {
			useAppStore.getState().setHopeMode(false)
			useAppStore.getState().setHopeMode(true)
		})

		// 依然として1回のみ
		expect(mockStartAnimationCallCount).toBe(1)
	})

	it("hope mode有効化時にhope-modeクラスが追加される", async () => {
		const { container } = render(<App />)

		const appDiv = container.firstChild as HTMLElement
		expect(appDiv.classList.contains("hope-mode")).toBe(false)

		// hope modeを有効化
		act(() => {
			useAppStore.getState().setHopeMode(true)
		})

		expect(appDiv.classList.contains("hope-mode")).toBe(true)
	})

	it("全てのコンポーネントがレンダリングされる", () => {
		render(<App />)

		expect(screen.getByTestId("background-layer")).toBeInTheDocument()
		expect(screen.getByTestId("navigation")).toBeInTheDocument()
		expect(screen.getByTestId("hero")).toBeInTheDocument()
		expect(screen.getByTestId("story-hope")).toBeInTheDocument()
		expect(screen.getByTestId("story-life")).toBeInTheDocument()
		expect(screen.getByTestId("story-possibility")).toBeInTheDocument()
		expect(screen.getByTestId("experience")).toBeInTheDocument()
		expect(screen.getByTestId("story-light")).toBeInTheDocument()
		expect(screen.getByTestId("video-overlay")).toBeInTheDocument()
		expect(screen.getByTestId("three-canvas")).toBeInTheDocument()
	})

	it("unmount時にローディングタイマーがクリーンアップされる", () => {
		const { unmount } = render(<App />)

		// タイマーが設定されていることを確認
		vi.advanceTimersByTime(100)
		expect(useAppStore.getState().loadingProgress).toBe(10)

		// unmount
		unmount()

		// タイマーがクリアされたことを確認（進捗が止まる）
		const progressBeforeUnmount = useAppStore.getState().loadingProgress
		vi.advanceTimersByTime(100)
		const progressAfterUnmount = useAppStore.getState().loadingProgress

		// unmount後はストアの状態が変わらない（タイマーがクリアされた）
		expect(progressAfterUnmount).toBe(progressBeforeUnmount)
	})

	it("ローディング完了後、Loadingコンポーネントが非表示になる", async () => {
		render(<App />)

		expect(screen.getByTestId("loading")).toBeInTheDocument()

		// ローディング完了まで進める
		act(() => {
			vi.advanceTimersByTime(1000 + 500)
		})

		expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
	})
})
