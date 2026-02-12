import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ImageModal } from "../ImageModal"

describe("ImageModal", () => {
	beforeEach(() => {
		vi.useFakeTimers()
		// Mock requestAnimationFrame for fade-in animation
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			cb(0)
			return 0
		})
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
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
		expect(screen.getByRole("img", { name: "Test Image 1" })).toHaveAttribute("src", "test.jpg")
		expect(document.body).toHaveClass("no-scroll")
	})

	it("should close on close button click with animation delay", () => {
		const onClose = vi.fn()
		render(<ImageModal isOpen={true} imageSrc="test.jpg" imageAlt="Test Image" onClose={onClose} />)

		const closeBtn = screen.getByRole("button", { name: "Close image" })
		fireEvent.click(closeBtn)

		// フェードアウト中はvisibleクラスが削除される
		const dialog = screen.getByRole("dialog")
		expect(dialog).not.toHaveClass("visible")

		// onCloseはまだ呼ばれていない
		expect(onClose).not.toHaveBeenCalled()

		// 500ms後にonCloseが呼ばれる
		act(() => {
			vi.advanceTimersByTime(500)
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
			vi.advanceTimersByTime(500)
		})

		expect(onClose).not.toHaveBeenCalled()
	})

	it("should close on overlay click", () => {
		const onClose = vi.fn()
		render(<ImageModal isOpen={true} imageSrc="test.jpg" imageAlt="Test Image" onClose={onClose} />)

		const dialog = screen.getByRole("dialog")
		fireEvent.click(dialog) // Click on the dialog overlay itself

		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(onClose).toHaveBeenCalled()
	})

	it("should close on Escape key", () => {
		const onClose = vi.fn()
		render(<ImageModal isOpen={true} imageSrc="test.jpg" imageAlt="Test Image" onClose={onClose} />)

		fireEvent.keyDown(document, { key: "Escape" })

		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(onClose).toHaveBeenCalled()
	})
})
