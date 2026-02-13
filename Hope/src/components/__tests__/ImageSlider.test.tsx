import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { resetAllStores } from "../../test/helpers/storeReset"
import { ImageSlider } from "../ImageSlider"

const mockImages = ["/images/test-01.webp", "/images/test-02.webp", "/images/test-03.webp"]

describe("ImageSlider", () => {
	beforeEach(() => {
		resetAllStores()
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should render all images", () => {
		render(<ImageSlider images={mockImages} sectionName="Test Section" />)

		const images = screen.getAllByRole("img")
		expect(images).toHaveLength(3)
	})

	it("should render arrow buttons when multiple images", () => {
		render(<ImageSlider images={mockImages} sectionName="Test Section" />)

		expect(screen.getByLabelText("Previous slide")).toBeInTheDocument()
		expect(screen.getByLabelText("Next slide")).toBeInTheDocument()
	})

	it("should not render arrow buttons for single image", () => {
		render(<ImageSlider images={[mockImages[0]]} sectionName="Test Section" />)

		expect(screen.queryByLabelText("Previous slide")).not.toBeInTheDocument()
		expect(screen.queryByLabelText("Next slide")).not.toBeInTheDocument()
	})

	it("should render dot indicators", () => {
		render(<ImageSlider images={mockImages} sectionName="Test Section" />)

		const dots = screen.getAllByRole("tab")
		expect(dots).toHaveLength(3)
	})

	it("should call onImageClick when image is clicked", () => {
		const handleClick = vi.fn()
		render(
			<ImageSlider images={mockImages} sectionName="Test Section" onImageClick={handleClick} />,
		)

		const buttons = screen.getAllByRole("button", { name: /View image/i })
		fireEvent.click(buttons[0])

		expect(handleClick).toHaveBeenCalledWith(0)
	})

	it("should have correct ARIA attributes for carousel", () => {
		render(<ImageSlider images={mockImages} sectionName="Test Section" />)

		const slider = screen.getByRole("region")
		expect(slider).toHaveAttribute("aria-roledescription", "carousel")
		expect(slider).toHaveAttribute("aria-label", expect.stringContaining("Test Section"))
	})

	it("should have correct ARIA attributes for slides", () => {
		render(<ImageSlider images={mockImages} sectionName="Test Section" />)

		const slides = screen.getAllByRole("group")
		expect(slides).toHaveLength(3)
		expect(slides[0]).toHaveAttribute("aria-roledescription", "slide")
	})

	it("should mark first dot as active initially", () => {
		render(<ImageSlider images={mockImages} sectionName="Test Section" />)

		const dots = screen.getAllByRole("tab")
		expect(dots[0]).toHaveAttribute("aria-selected", "true")
		expect(dots[1]).toHaveAttribute("aria-selected", "false")
	})

	it("should return null when images array is empty", () => {
		const { container } = render(<ImageSlider images={[]} sectionName="Test Section" />)

		expect(container.firstChild).toBeNull()
	})

	it("should lazy load images except the first one", () => {
		render(<ImageSlider images={mockImages} sectionName="Test Section" />)

		const images = screen.getAllByRole("img")
		expect(images[0]).toHaveAttribute("loading", "eager")
		expect(images[1]).toHaveAttribute("loading", "lazy")
		expect(images[2]).toHaveAttribute("loading", "lazy")
	})

	it("should change active slide on arrow button click", () => {
		render(<ImageSlider images={mockImages} sectionName="Test Section" />)

		// 最初は1番目がactive
		const slides = screen.getAllByRole("group")
		expect(slides[0]).toHaveClass("active")

		// Nextボタンクリック
		const nextBtn = screen.getByLabelText("Next slide")
		fireEvent.click(nextBtn)

		// 2番目がactiveになる
		const updatedSlides = screen.getAllByRole("group")
		expect(updatedSlides[1]).toHaveClass("active")
		expect(updatedSlides[0]).not.toHaveClass("active")
	})

	it("should navigate to target slide on dot click", () => {
		render(<ImageSlider images={mockImages} sectionName="Test Section" />)

		const dots = screen.getAllByRole("tab")

		// 3番目のドットをクリック
		fireEvent.click(dots[2])

		// 3番目がactiveになる
		const slides = screen.getAllByRole("group")
		expect(slides[2]).toHaveClass("active")
		expect(dots[2]).toHaveAttribute("aria-selected", "true")
	})

	it("should call onImageClick on Enter/Space key", () => {
		const handleClick = vi.fn()
		render(
			<ImageSlider images={mockImages} sectionName="Test Section" onImageClick={handleClick} />,
		)

		const buttons = screen.getAllByRole("button", { name: /View image/i })

		// Enterキー
		fireEvent.keyDown(buttons[0], { key: "Enter" })
		expect(handleClick).toHaveBeenCalledWith(0)

		// Spaceキー
		fireEvent.keyDown(buttons[1], { key: " " })
		expect(handleClick).toHaveBeenCalledWith(1)
	})

	it("should pause and resume autoplay on mouse hover", () => {
		render(<ImageSlider images={mockImages} sectionName="Test Section" />)

		const slider = screen.getByRole("region")

		// ホバーで一時停止
		fireEvent.mouseEnter(slider)

		// 5秒経過しても進まない
		act(() => {
			vi.advanceTimersByTime(5000)
		})
		const slides = screen.getAllByRole("group")
		expect(slides[0]).toHaveClass("active")

		// ホバー解除で再開
		fireEvent.mouseLeave(slider)

		// 5秒後に次へ進む
		act(() => {
			vi.advanceTimersByTime(5000)
		})
		const updatedSlides = screen.getAllByRole("group")
		expect(updatedSlides[1]).toHaveClass("active")
	})
})
