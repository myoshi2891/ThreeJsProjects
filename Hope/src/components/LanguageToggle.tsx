import { useCallback, useState } from "react"
import { useI18nStore } from "../store"

/**
 * 言語切り替えボタン（日英トグル）
 *
 * クリック時に3Dフリップアニメーション（rotateX）を実行。
 * フリップの50%地点でテキストが切り替わる。
 */
export function LanguageToggle() {
	const { locale, toggleLocale } = useI18nStore()
	const [isFlipping, setIsFlipping] = useState(false)

	const handleClick = useCallback(() => {
		if (isFlipping) return

		setIsFlipping(true)

		// フリップの50%地点（0.2s）でlocaleを切り替え
		setTimeout(() => {
			toggleLocale()
		}, 200)

		// フリップ完了（0.4s）で状態リセット
		setTimeout(() => {
			setIsFlipping(false)
		}, 400)
	}, [isFlipping, toggleLocale])

	return (
		<button
			type="button"
			className={`language-toggle ${isFlipping ? "flipping" : ""}`}
			onClick={handleClick}
			aria-label={locale === "ja" ? "Switch to English" : "日本語に切り替え"}
		>
			{locale === "ja" ? "EN" : "日本語"}
		</button>
	)
}
