import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StorySection } from "../StorySection"

const HOPE_IMAGE_COUNT = 9

describe("StorySection", () => {
	it("should render correct content for 'hope' section", () => {
		render(<StorySection type="hope" />)
		expect(screen.getByText("Hope")).toBeInTheDocument()
		expect(screen.getByText("01")).toBeInTheDocument()
		expect(screen.getByText(/Hope is the pillar/)).toBeInTheDocument()

		// ID check unique to hope/light
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

	it("should render ImageSlider with all section images", () => {
		render(<StorySection type="hope" />)

		// Slider carousel should be rendered
		const slider = screen.getByRole("region", { name: /Hope/i })
		expect(slider).toBeInTheDocument()
		expect(slider).toHaveAttribute("aria-roledescription", "carousel")

		const images = screen.getAllByRole("img")
		expect(images.length).toBe(HOPE_IMAGE_COUNT)
	})

	it("should open modal when slider image is clicked", () => {
		render(<StorySection type="hope" />)

		// Click the first image
		const buttons = screen.getAllByRole("button", { name: /View image/i })
		expect(buttons.length).toBeGreaterThan(0)

		fireEvent.click(buttons[0])

		// Modal should open
		const modal = screen.getByRole("dialog", { name: /Image viewer/i })
		expect(modal).toBeInTheDocument()
	})

	it("should show navigation in modal when multiple images", () => {
		render(<StorySection type="hope" />)

		// Click an image to open modal
		const buttons = screen.getAllByRole("button", { name: /View image/i })
		fireEvent.click(buttons[0])

		// Navigation buttons should be visible
		expect(screen.getByLabelText("Previous image")).toBeInTheDocument()
		expect(screen.getByLabelText("Next image")).toBeInTheDocument()

		// Counter should be displayed
		expect(screen.getByText(new RegExp(`1 of ${HOPE_IMAGE_COUNT}`))).toBeInTheDocument()
	})
})
