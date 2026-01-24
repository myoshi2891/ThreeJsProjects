import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ImageModal } from "../ImageModal"

describe("ImageModal", () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		document.body.className = "" // cleanup body class
	})

	it("should not render when isOpen is false", () => {
		render(
			<ImageModal isOpen={false} imageSrc="test.jpg" imageAlt="Test Image" onClose={() => {}} />,
		)
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
	})

	it("should render correctly when open", () => {
		const onClose = vi.fn()
		render(<ImageModal isOpen={true} imageSrc="test.jpg" imageAlt="Test Image" onClose={onClose} />)

		expect(screen.getByRole("dialog")).toBeInTheDocument()
		expect(screen.getByRole("img", { name: "Test Image" })).toHaveAttribute("src", "test.jpg")
		expect(document.body).toHaveClass("no-scroll")
	})

	it("should close on close button click with animation delay", () => {
		const onClose = vi.fn()
		render(<ImageModal isOpen={true} imageSrc="test.jpg" imageAlt="Test Image" onClose={onClose} />)

		const closeBtn = screen.getByRole("button", { name: "Close modal" })
		fireEvent.click(closeBtn)

		// Check for closing class
		const dialog = screen.getByRole("dialog")
		expect(dialog).toHaveClass("closing")

		// onClose shouldn't be called yet
		expect(onClose).not.toHaveBeenCalled()

		// Fast forward
		act(() => {
			vi.advanceTimersByTime(400)
		})

		expect(onClose).toHaveBeenCalled()
	})

	it("should NOT close when clicking the image (event propagation stop)", () => {
		const onClose = vi.fn()
		render(<ImageModal isOpen={true} imageSrc="test.jpg" imageAlt="Test Image" onClose={onClose} />)

		const img = screen.getByRole("img")
		// Trigger click on image wrapper div or image itself
		fireEvent.click(img)

		act(() => {
			vi.advanceTimersByTime(400)
		})

		expect(onClose).not.toHaveBeenCalled()
	})

	it("should close on overlay click", () => {
		const onClose = vi.fn()
		render(<ImageModal isOpen={true} imageSrc="test.jpg" imageAlt="Test Image" onClose={onClose} />)

		const dialog = screen.getByRole("dialog")
		fireEvent.click(dialog) // Click on the dialog overlay itself

		act(() => {
			vi.advanceTimersByTime(400)
		})

		expect(onClose).toHaveBeenCalled()
	})

	it("should close on Escape key", () => {
		const onClose = vi.fn()
		render(<ImageModal isOpen={true} imageSrc="test.jpg" imageAlt="Test Image" onClose={onClose} />)

		fireEvent.keyDown(document, { key: "Escape" })

		act(() => {
			vi.advanceTimersByTime(400)
		})

		expect(onClose).toHaveBeenCalled()
	})
})
