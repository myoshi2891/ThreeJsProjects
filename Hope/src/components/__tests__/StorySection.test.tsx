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

		// スライダーのカルーセルが表示されている
		const slider = screen.getByRole("region", { name: /Hope/i })
		expect(slider).toBeInTheDocument()
		expect(slider).toHaveAttribute("aria-roledescription", "carousel")

		// 9枚の画像（Hopeセクション）
		const images = screen.getAllByRole("img")
		expect(images.length).toBe(9)
	})

	it("should open modal when slider image is clicked", () => {
		render(<StorySection type="hope" />)

		// 最初の画像をクリック
		const buttons = screen.getAllByRole("button", { name: /View image/i })
		expect(buttons.length).toBeGreaterThan(0)

		fireEvent.click(buttons[0])

		// モーダルが開く
		const modal = screen.getByRole("dialog", { name: /Image viewer/i })
		expect(modal).toBeInTheDocument()
	})

	it("should show navigation in modal when multiple images", () => {
		render(<StorySection type="hope" />)

		// 画像をクリックしてモーダルを開く
		const buttons = screen.getAllByRole("button", { name: /View image/i })
		fireEvent.click(buttons[0])

		// ナビゲーションボタンが表示される
		expect(screen.getByLabelText("Previous image")).toBeInTheDocument()
		expect(screen.getByLabelText("Next image")).toBeInTheDocument()

		// カウンターが表示される
		expect(screen.getByText(/1 of 9/)).toBeInTheDocument()
	})
})
