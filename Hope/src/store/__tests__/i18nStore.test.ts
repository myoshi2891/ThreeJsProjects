import { beforeEach, describe, expect, it } from "vitest"
import { useI18nStore } from "../i18nStore"

describe("i18nStore", () => {
	beforeEach(() => {
		// Reset store to default state before each test
		useI18nStore.setState({ locale: "en" })
	})

	describe("initial state", () => {
		it("should have locale set to 'en' by default in test environment", () => {
			const { locale } = useI18nStore.getState()
			expect(locale).toBe("en")
		})

		it("should have t function available", () => {
			const { t } = useI18nStore.getState()
			expect(typeof t).toBe("function")
		})
	})

	describe("setLocale", () => {
		it("should set locale to 'ja'", () => {
			useI18nStore.getState().setLocale("ja")
			expect(useI18nStore.getState().locale).toBe("ja")
		})

		it("should set locale to 'en'", () => {
			useI18nStore.setState({ locale: "ja" })
			useI18nStore.getState().setLocale("en")
			expect(useI18nStore.getState().locale).toBe("en")
		})
	})

	describe("toggleLocale", () => {
		it("should toggle from 'en' to 'ja'", () => {
			useI18nStore.setState({ locale: "en" })
			useI18nStore.getState().toggleLocale()
			expect(useI18nStore.getState().locale).toBe("ja")
		})

		it("should toggle from 'ja' to 'en'", () => {
			useI18nStore.setState({ locale: "ja" })
			useI18nStore.getState().toggleLocale()
			expect(useI18nStore.getState().locale).toBe("en")
		})
	})

	describe("t (translation function)", () => {
		it("should return English translation when locale is 'en'", () => {
			useI18nStore.setState({ locale: "en" })
			const { t } = useI18nStore.getState()
			expect(t("hero.title")).toBe("Hope Lights the Way")
		})

		it("should return Japanese translation when locale is 'ja'", () => {
			useI18nStore.setState({ locale: "ja" })
			const { t } = useI18nStore.getState()
			expect(t("hero.title")).toBe("希望は未来への道を導く")
		})

		it("should return nested translation using dot notation", () => {
			useI18nStore.setState({ locale: "en" })
			const { t } = useI18nStore.getState()
			expect(t("nav.skipLink")).toBe("Skip to main content")
		})

		it("should return key itself if translation not found", () => {
			const { t } = useI18nStore.getState()
			expect(t("nonexistent.key")).toBe("nonexistent.key")
		})
	})

	describe("getTranslations", () => {
		it("should return full English translations when locale is 'en'", () => {
			useI18nStore.setState({ locale: "en" })
			const translations = useI18nStore.getState().getTranslations()
			expect(translations.hero.title).toBe("Hope Lights the Way")
		})

		it("should return full Japanese translations when locale is 'ja'", () => {
			useI18nStore.setState({ locale: "ja" })
			const translations = useI18nStore.getState().getTranslations()
			expect(translations.hero.title).toBe("希望は未来への道を導く")
		})
	})
})
