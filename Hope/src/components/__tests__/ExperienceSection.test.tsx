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

		// 800ms後にボタンがDOMから削除される（条件付きレンダリング）
		act(() => {
			vi.advanceTimersByTime(800)
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

		// 800ms経過してもストア状態が変更されないことを確認
		act(() => {
			vi.advanceTimersByTime(800)
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

		// 800ms後にhopeModeがtrueになる
		act(() => {
			vi.advanceTimersByTime(800)
		})

		expect(useAppStore.getState().isHopeMode).toBe(true)
	})
})
