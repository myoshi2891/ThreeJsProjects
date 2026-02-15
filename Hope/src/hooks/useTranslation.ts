import { useI18nStore } from "../store"

/**
 * locale購読と翻訳関数を統合したカスタムフック。
 *
 * locale を購読することで言語変更時の再レンダリングを保証しつつ、
 * 翻訳関数 t を返す。t 関数は内部で get() を使用するため
 * 参照が変わらず、locale のサブスクリプションが再レンダリングに必要。
 *
 * @returns 翻訳関数 t
 */
export function useTranslation() {
	useI18nStore((state) => state.locale)
	const t = useI18nStore((state) => state.t)
	return { t }
}
