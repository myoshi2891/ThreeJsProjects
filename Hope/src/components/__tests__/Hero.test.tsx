import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
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
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("HOPE")
	})

	it("should render hero subtitle", () => {
		render(<Hero />)
		expect(screen.getByText(/静寂の水面に/)).toBeInTheDocument()
	})

	it("should render start button", () => {
		render(<Hero />)
		expect(screen.getByRole("button", { name: /体験を始める/i })).toBeInTheDocument()
	})

	it("should render Interactive 3D Experience badge", () => {
		render(<Hero />)
		expect(screen.getByText("Interactive 3D Experience")).toBeInTheDocument()
	})

	it("should scroll to experience section when start button is clicked", () => {
		render(<Hero />)
		const button = screen.getByRole("button", { name: /体験を始める/i })
		fireEvent.click(button)
		expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" })
	})
})
