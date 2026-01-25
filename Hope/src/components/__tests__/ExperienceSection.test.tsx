import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { useAppStore } from "../../store"
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

	it("should hide hope button when it is clicked", async () => {
		const user = userEvent.setup()
		render(<ExperienceSection />)
		const button = screen.getByRole("button", {
			name: /Watch the short Film/i,
		})

		await user.click(button)

		// Button should have hidden class after click
		expect(button).toHaveClass("hidden")
	})

	it("should enable hope mode when button is clicked", async () => {
		const user = userEvent.setup()
		render(<ExperienceSection />)
		const button = screen.getByRole("button", {
			name: /Watch the short Film/i,
		})

		await user.click(button)

		expect(useAppStore.getState().isHopeMode).toBe(true)
	})
})
