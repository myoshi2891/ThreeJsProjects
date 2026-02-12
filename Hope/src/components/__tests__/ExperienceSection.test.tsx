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
		expect(button).not.toHaveClass("hidden")

		// 1500ms後にhiddenクラスが適用される
		act(() => {
			vi.advanceTimersByTime(1500)
		})

		expect(button).toHaveClass("hidden")
	})

	it("should enable hope mode when button is clicked", () => {
		render(<ExperienceSection />)
		const button = screen.getByRole("button", {
			name: /Watch the short Film/i,
		})

		fireEvent.click(button)

		expect(useAppStore.getState().isHopeMode).toBe(true)
	})
})
