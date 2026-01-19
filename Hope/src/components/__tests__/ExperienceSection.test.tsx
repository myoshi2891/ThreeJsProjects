import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ExperienceSection } from "../ExperienceSection"
import { useAppStore } from "../../store/appStore"

describe("ExperienceSection", () => {
	beforeEach(() => {
		useAppStore.setState({
			isHopeMode: false,
			isVideoThumbnailVisible: false,
		})
	})

	it("should render hope button", () => {
		render(<ExperienceSection />)
		expect(
			screen.getByRole("button", { name: /希望を見つける/i })
		).toBeInTheDocument()
	})

	it("should hide hope button when it is clicked", () => {
		const { rerender } = render(<ExperienceSection />)
		const button = screen.getByRole("button", { name: /希望を見つける/i })

		fireEvent.click(button)

		// Button should have hidden class after click
		expect(button).toHaveClass("hidden")
	})

	it("should enable hope mode when button is clicked", () => {
		render(<ExperienceSection />)
		const button = screen.getByRole("button", { name: /希望を見つける/i })

		fireEvent.click(button)

		expect(useAppStore.getState().isHopeMode).toBe(true)
	})
})
