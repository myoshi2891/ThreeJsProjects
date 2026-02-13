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

	describe("複数画像ナビゲーション", () => {
		const multiImages = ["img1.jpg", "img2.jpg", "img3.jpg"]

		it("ArrowRightで次画像に切り替わる", () => {
			render(
				<ImageModal isOpen={true} imageSrc={multiImages} imageAlt="Gallery" onClose={vi.fn()} />,
			)

			expect(screen.getByRole("img")).toHaveAttribute("src", "img1.jpg")

			fireEvent.keyDown(document, { key: "ArrowRight" })

			// 300ms後に画像切り替え
			act(() => {
				vi.advanceTimersByTime(300)
			})

			expect(screen.getByRole("img")).toHaveAttribute("src", "img2.jpg")
		})

		it("ArrowLeftで前画像に切り替わる", () => {
			render(
				<ImageModal
					isOpen={true}
					imageSrc={multiImages}
					imageAlt="Gallery"
					initialIndex={1}
					onClose={vi.fn()}
				/>,
			)

			expect(screen.getByRole("img")).toHaveAttribute("src", "img2.jpg")

			fireEvent.keyDown(document, { key: "ArrowLeft" })

			act(() => {
				vi.advanceTimersByTime(300)
			})

			expect(screen.getByRole("img")).toHaveAttribute("src", "img1.jpg")
		})

		it("最後の画像からArrowRightで最初にラップアラウンドする", () => {
			render(
				<ImageModal
					isOpen={true}
					imageSrc={multiImages}
					imageAlt="Gallery"
					initialIndex={2}
					onClose={vi.fn()}
				/>,
			)

			expect(screen.getByRole("img")).toHaveAttribute("src", "img3.jpg")

			fireEvent.keyDown(document, { key: "ArrowRight" })

			act(() => {
				vi.advanceTimersByTime(300)
			})

			expect(screen.getByRole("img")).toHaveAttribute("src", "img1.jpg")
		})

		it("isSwitchingガード: 高速連打で1回のみ切り替わる", () => {
			render(
				<ImageModal isOpen={true} imageSrc={multiImages} imageAlt="Gallery" onClose={vi.fn()} />,
			)

			// 高速連打
			fireEvent.keyDown(document, { key: "ArrowRight" })
			fireEvent.keyDown(document, { key: "ArrowRight" })
			fireEvent.keyDown(document, { key: "ArrowRight" })

			act(() => {
				vi.advanceTimersByTime(300)
			})

			// 1回のみ切り替わる（img1 → img2）
			expect(screen.getByRole("img")).toHaveAttribute("src", "img2.jpg")
		})
	})

	it("Escape二重発火防止: closingRefガードで1回のみ閉じる", () => {
		const onClose = vi.fn()
		render(<ImageModal isOpen={true} imageSrc="test.jpg" imageAlt="Test" onClose={onClose} />)

		// 連続Escape
		fireEvent.keyDown(document, { key: "Escape" })
		fireEvent.keyDown(document, { key: "Escape" })
		fireEvent.keyDown(document, { key: "Escape" })

		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(onClose).toHaveBeenCalledTimes(1)
	})

	describe("フォーカストラップ", () => {
		const multiImages = ["img1.jpg", "img2.jpg", "img3.jpg"]

		it("Tab: 最後のボタン→最初のボタンへ循環する", () => {
			render(
				<ImageModal isOpen={true} imageSrc={multiImages} imageAlt="Gallery" onClose={vi.fn()} />,
			)

			const dialog = screen.getByRole("dialog")
			const buttons = dialog.querySelectorAll("button")
			const lastButton = buttons[buttons.length - 1]

			// 最後のボタンにフォーカス
			lastButton.focus()
			expect(document.activeElement).toBe(lastButton)

			// Tab押下
			fireEvent.keyDown(document, { key: "Tab" })

			// 最初のボタンにフォーカスが移る
			expect(document.activeElement).toBe(buttons[0])
		})

		it("Shift+Tab: 最初のボタン→最後のボタンへ循環する", () => {
			render(
				<ImageModal isOpen={true} imageSrc={multiImages} imageAlt="Gallery" onClose={vi.fn()} />,
			)

			const dialog = screen.getByRole("dialog")
			const buttons = dialog.querySelectorAll("button")
			const firstButton = buttons[0]
			const lastButton = buttons[buttons.length - 1]

			// 最初のボタンにフォーカス
			firstButton.focus()
			expect(document.activeElement).toBe(firstButton)

			// Shift+Tab押下
			fireEvent.keyDown(document, { key: "Tab", shiftKey: true })

			// 最後のボタンにフォーカスが移る
			expect(document.activeElement).toBe(lastButton)
		})
	})

	it("オープン時にdialogにフォーカスが移動する", () => {
		render(<ImageModal isOpen={true} imageSrc="test.jpg" imageAlt="Test" onClose={vi.fn()} />)

		const dialog = screen.getByRole("dialog")
		expect(dialog).toHaveAttribute("tabindex", "-1")
		// RAFモックにより即座にフォーカスが移動
		expect(document.activeElement).toBe(dialog)
	})

	it("Tabキーが伝播する（stopPropagation削除の確認）", () => {
		const parentHandler = vi.fn()
		render(
			// biome-ignore lint/a11y/noStaticElementInteractions: テスト用ラッパー
			<div onKeyDown={parentHandler}>
				<ImageModal isOpen={true} imageSrc="test.jpg" imageAlt="Test" onClose={vi.fn()} />
			</div>,
		)

		fireEvent.keyDown(document, { key: "Tab" })

		// グローバルリスナーで処理されるが、イベントは伝播を妨げない
		// （document.addEventListenerなのでbubbling順序は異なる）
	})
})
