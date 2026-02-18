import { render, screen, waitFor } from "@testing-library/react"
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { useI18nStore } from "../../store"
import { LanguageToggle } from "../LanguageToggle"

describe("LanguageToggle", () => {
	beforeEach(() => {
		// Reset locale to default before each test
		useI18nStore.setState({ locale: "en" })
	})

	// user-event セットアップ（PointerEventsCheckLevel.Never: happy-dom 互換性のため無効化）
	const setupUser = () =>
		userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never })

	it("should render button with correct aria-label when locale is 'en'", () => {
		render(<LanguageToggle />)
		const button = screen.getByRole("button")
		expect(button).toHaveAttribute("aria-label", "日本語に切り替え")
	})

	it("should display '日本語' when current locale is 'en'", () => {
		render(<LanguageToggle />)
		expect(screen.getByText("日本語")).toBeInTheDocument()
	})

	it("should display 'EN' when current locale is 'ja'", () => {
		useI18nStore.setState({ locale: "ja" })
		render(<LanguageToggle />)
		expect(screen.getByText("EN")).toBeInTheDocument()
	})

	it("should toggle locale from 'en' to 'ja' when clicked", async () => {
		const user = setupUser()
		render(<LanguageToggle />)
		const button = screen.getByRole("button")

		expect(useI18nStore.getState().locale).toBe("en")
		await user.click(button)

		// フリップアニメーションの50%地点（200ms）でlocaleが切り替わる
		await waitFor(() => {
			expect(useI18nStore.getState().locale).toBe("ja")
		})
	})

	it("should toggle locale from 'ja' to 'en' when clicked", async () => {
		const user = setupUser()
		useI18nStore.setState({ locale: "ja" })
		render(<LanguageToggle />)
		const button = screen.getByRole("button")

		expect(useI18nStore.getState().locale).toBe("ja")
		await user.click(button)

		await waitFor(() => {
			expect(useI18nStore.getState().locale).toBe("en")
		})
	})

	it("should have correct aria-label when locale is 'ja'", () => {
		useI18nStore.setState({ locale: "ja" })
		render(<LanguageToggle />)
		const button = screen.getByRole("button")
		expect(button).toHaveAttribute("aria-label", "Switch to English")
	})

	it("should have language-toggle class", () => {
		render(<LanguageToggle />)
		const button = screen.getByRole("button")
		expect(button).toHaveClass("language-toggle")
	})
})
