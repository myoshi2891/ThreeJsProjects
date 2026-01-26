import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type Locale, type TranslationData, translations } from "../locales"

interface I18nState {
	locale: Locale
	setLocale: (locale: Locale) => void
	toggleLocale: () => void
	t: (key: string) => string
	getTranslations: () => TranslationData
}

/**
 * Detect browser language and return appropriate locale
 */
function detectBrowserLocale(): Locale {
	if (typeof navigator === "undefined") return "en"
	const browserLang = navigator.language.toLowerCase()
	return browserLang.startsWith("ja") ? "ja" : "en"
}

/**
 * Get nested value from object using dot notation key
 */
function getNestedValue(obj: Record<string, unknown>, key: string): string {
	const keys = key.split(".")
	let current: unknown = obj

	for (const k of keys) {
		if (current && typeof current === "object" && k in current) {
			current = (current as Record<string, unknown>)[k]
		} else {
			return key // Return key if not found
		}
	}

	return typeof current === "string" ? current : key
}

export const useI18nStore = create<I18nState>()(
	persist(
		(set, get) => ({
			locale: detectBrowserLocale(),

			setLocale: (locale) => set({ locale }),

			toggleLocale: () =>
				set((state) => ({
					locale: state.locale === "ja" ? "en" : "ja",
				})),

			t: (key) => {
				const { locale } = get()
				const data = translations[locale]
				return getNestedValue(data as unknown as Record<string, unknown>, key)
			},

			getTranslations: () => {
				const { locale } = get()
				return translations[locale]
			},
		}),
		{
			name: "hope-i18n",
			partialize: (state) => ({ locale: state.locale }),
		},
	),
)
