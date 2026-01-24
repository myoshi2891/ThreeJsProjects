import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StorySection } from "../StorySection"

describe("StorySection", () => {
	it("should render correct content for 'hope' section", () => {
		render(<StorySection type="hope" />)
		expect(screen.getByText("Hope")).toBeInTheDocument()
		expect(screen.getByText("01")).toBeInTheDocument()
		expect(screen.getByText(/Hope is the pillar/)).toBeInTheDocument()

		// ID check unique to hope/light
		// ID check unique to hope/light
		// Better strategy: select by ID to verify it exists
		// The component renders a <section> with id="hope"
		const sectionElement = document.getElementById("hope")
		expect(sectionElement).toBeInTheDocument()
	})

	it("should render correct content for 'life' section", () => {
		render(<StorySection type="life" />)
		expect(screen.getByText("Life")).toBeInTheDocument()
		expect(screen.getByText("02")).toBeInTheDocument()

		// ID should NOT match specific hope/light IDs
		const sectionElement = document.getElementById("life")
		expect(sectionElement).not.toBeInTheDocument()
	})

	it("should open modal when thumbnail is clicked", () => {
		render(<StorySection type="hope" />)

		const button = screen.getByRole("button", { name: /View Hope image/i })
		expect(button).toBeInTheDocument()

		// Verify Image Alt
		const img = screen.getByAltText("Hope")
		expect(img).toBeInTheDocument()
		expect(img).toHaveAttribute("src", "/images/hope-pillar.webp")

		fireEvent.click(button)

		// Modal verification
		const modal = screen.getByRole("dialog", { name: /Image viewer/i })
		expect(modal).toBeInTheDocument()

		// Verify modal content matches section
		const modalImg = screen.getAllByAltText("Hope")[1] // One in thumbnail, one in modal
		expect(modalImg).toBeInTheDocument()
	})
})
