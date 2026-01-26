import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { useI18nStore } from "../../store"
import { LanguageToggle } from "../LanguageToggle"

describe("LanguageToggle", () => {
	beforeEach(() => {
		// Reset locale to default before each test
		useI18nStore.setState({ locale: "en" })
	})

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

	it("should toggle locale from 'en' to 'ja' when clicked", () => {
		render(<LanguageToggle />)
		const button = screen.getByRole("button")

		expect(useI18nStore.getState().locale).toBe("en")
		fireEvent.click(button)
		expect(useI18nStore.getState().locale).toBe("ja")
	})

	it("should toggle locale from 'ja' to 'en' when clicked", () => {
		useI18nStore.setState({ locale: "ja" })
		render(<LanguageToggle />)
		const button = screen.getByRole("button")

		expect(useI18nStore.getState().locale).toBe("ja")
		fireEvent.click(button)
		expect(useI18nStore.getState().locale).toBe("en")
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
