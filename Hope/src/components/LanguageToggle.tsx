import { useI18nStore } from "../store/i18nStore"

/**
 * Language toggle button for switching between Japanese and English.
 * Displays the opposite language name to indicate what clicking will switch to.
 */
export function LanguageToggle() {
	const { locale, toggleLocale } = useI18nStore()

	return (
		<button
			type="button"
			className="language-toggle"
			onClick={toggleLocale}
			aria-label={locale === "ja" ? "Switch to English" : "日本語に切り替え"}
		>
			{locale === "ja" ? "EN" : "日本語"}
		</button>
	)
}
