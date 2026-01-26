import en from "./en.json"
import ja from "./ja.json"

export type Locale = "ja" | "en"

export type TranslationData = typeof en

export const translations: Record<Locale, TranslationData> = {
	en,
	ja,
}
