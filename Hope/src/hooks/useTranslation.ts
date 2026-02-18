import { useI18nStore } from "../store"

/**
 * locale購読と翻訳関数・言語切替を統合したカスタムフック。
 *
 * locale を購読することで言語変更時の再レンダリングを保証しつつ、
 * 翻訳関数 t、現在の locale、言語切替関数 toggleLocale を返す。
 * t 関数は内部で get() を使用するため参照が変わらず、
 * locale のサブスクリプションが再レンダリングに必要。
 *
 * @returns `{ t, locale, toggleLocale }`
 */
export function useTranslation() {
	const locale = useI18nStore((state) => state.locale)
	const t = useI18nStore((state) => state.t)
	const toggleLocale = useI18nStore((state) => state.toggleLocale)
	return { t, locale, toggleLocale }
}
