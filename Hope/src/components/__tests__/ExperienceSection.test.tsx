import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useAppStore } from "../../store"
import { ExperienceSection } from "../ExperienceSection"

describe("ExperienceSection", () => {
	beforeEach(() => {
		vi.useFakeTimers()
		useAppStore.setState({
			isHopeMode: false,
			isVideoThumbnailVisible: false,
		})
	})

	afterEach(() => {
		vi.useRealTimers()
		useAppStore.setState({
			isHopeMode: false,
			isVideoThumbnailVisible: false,
		})
	})

	it("should render hope button", () => {
		render(<ExperienceSection />)
		expect(screen.getByRole("button", { name: /Watch the short Film/i })).toBeInTheDocument()
	})

	it("should hide hope button when it is clicked", () => {
		render(<ExperienceSection />)
		const button = screen.getByRole("button", {
			name: /Watch the short Film/i,
		})

		fireEvent.click(button)

		// クリック直後はfadingクラスが適用される
		expect(button).toHaveClass("fading")

		// 300ms後にボタンがDOMから削除される（条件付きレンダリング）
		act(() => {
			vi.advanceTimersByTime(300)
		})

		expect(screen.queryByRole("button", { name: /Watch the short Film/i })).not.toBeInTheDocument()
	})

	it("should cleanup timeout when unmounted before animation completes", () => {
		const { unmount } = render(<ExperienceSection />)
		const button = screen.getByRole("button", {
			name: /Watch the short Film/i,
		})

		fireEvent.click(button)

		// フェード中にアンマウント
		unmount()

		// 300ms経過してもストア状態が変更されないことを確認
		act(() => {
			vi.advanceTimersByTime(300)
		})

		expect(useAppStore.getState().isHopeMode).toBe(false)
	})

	it("should enable hope mode when button is clicked", () => {
		render(<ExperienceSection />)
		const button = screen.getByRole("button", {
			name: /Watch the short Film/i,
		})

		fireEvent.click(button)

		// クリック直後はまだhopeModeは変更されない
		expect(useAppStore.getState().isHopeMode).toBe(false)

		// 300ms後にhopeModeがtrueになる
		act(() => {
			vi.advanceTimersByTime(300)
		})

		expect(useAppStore.getState().isHopeMode).toBe(true)
	})

	it("isFadingガード: フェード中の連続クリックが無視される", () => {
		const setHopeModeSpy = vi.fn()
		useAppStore.setState({ setHopeMode: setHopeModeSpy })

		render(<ExperienceSection />)
		const button = screen.getByRole("button", {
			name: /Watch the short Film/i,
		})

		// 1回目クリック
		fireEvent.click(button)
		expect(button).toHaveClass("fading")

		// 2回目クリック（フェード中のためisFadingガードで無視される）
		fireEvent.click(button)

		// 300ms後にsetHopeModeが1回のみ呼ばれる
		act(() => {
			vi.advanceTimersByTime(300)
		})

		expect(setHopeModeSpy).toHaveBeenCalledTimes(1)
		expect(setHopeModeSpy).toHaveBeenCalledWith(true)
	})

	it("フェード中のボタンにdisabled属性が付与される", () => {
		render(<ExperienceSection />)
		const button = screen.getByRole("button", {
			name: /Watch the short Film/i,
		})

		// クリック前はdisabledでない
		expect(button).not.toBeDisabled()

		// クリック後はdisabled
		fireEvent.click(button)
		expect(button).toBeDisabled()
	})
})
