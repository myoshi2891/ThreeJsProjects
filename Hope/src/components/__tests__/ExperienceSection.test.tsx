import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { useAppStore } from "../../store/appStore"
import { ExperienceSection } from "../ExperienceSection"

describe("ExperienceSection", () => {
	beforeEach(() => {
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

		// Button should have hidden class after click
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
