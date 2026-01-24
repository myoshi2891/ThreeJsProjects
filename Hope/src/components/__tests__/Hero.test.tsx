import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Hero } from "../Hero"

const mockScrollIntoView = vi.fn()

describe("Hero", () => {
	beforeEach(() => {
		mockScrollIntoView.mockClear()
		// Mock getElementById and scrollIntoView
		vi.spyOn(document, "getElementById").mockReturnValue({
			scrollIntoView: mockScrollIntoView,
		} as unknown as HTMLElement)
	})

	it("should render hero title", () => {
		render(<Hero />)
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"Hope Lights the Way"
		)
	})

	it("should render hero subtitle", () => {
		render(<Hero />)
		expect(
			screen.getByText(/Even in the darkest night/)
		).toBeInTheDocument()
	})

	it("should render start button", () => {
		render(<Hero />)
		expect(
			screen.getByRole("button", { name: /Learn More/i })
		).toBeInTheDocument()
	})

	it("should render Design the Future badge", () => {
		render(<Hero />)
		expect(screen.getByText("Design the Future")).toBeInTheDocument()
	})

	it("should scroll to experience section when start button is clicked", () => {
		render(<Hero />)
		const button = screen.getByRole("button", { name: /Learn More/i })
		fireEvent.click(button)
		expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" })
	})
})
