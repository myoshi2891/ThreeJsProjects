import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Navigation } from "../Navigation"

describe("Navigation", () => {
	it("should render navigation with correct ID", () => {
		render(<Navigation />)
		const nav = screen.getByRole("navigation")
		expect(nav).toHaveAttribute("id", "nav")
	})

	it("should render logo with icon", () => {
		render(<Navigation />)
		expect(screen.getByText("HOPE")).toBeInTheDocument()
		expect(screen.getByText("✧")).toBeInTheDocument()

		// Check logo link
		const logoLink = screen.getByRole("link", { name: /HOPE/ })
		expect(logoLink).toHaveAttribute("href", "#hero")
	})

	it("should render section links", () => {
		render(<Navigation />)

		const hopeLink = screen.getByRole("link", { name: "Hope" })
		expect(hopeLink).toHaveAttribute("href", "#hope")

		const filmLink = screen.getByRole("link", { name: "Short Film" })
		expect(filmLink).toHaveAttribute("href", "#experience")

		const lightLink = screen.getByRole("link", { name: "Light" })
		expect(lightLink).toHaveAttribute("href", "#light")
	})
})
