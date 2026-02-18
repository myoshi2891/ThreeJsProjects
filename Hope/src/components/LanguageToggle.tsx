import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "../hooks"

/**
 * 言語切り替えボタン（日英トグル）
 *
 * クリック時に3Dフリップアニメーション（rotateX）を実行。
 * フリップの50%地点でテキストが切り替わる。
 */
export function LanguageToggle() {
	const { locale, toggleLocale } = useTranslation()
	const [isFlipping, setIsFlipping] = useState(false)
	// isFlipping を ref でも保持し、handleClick 内のガード条件を安定化
	const isFlippingRef = useRef(false)
	const flipTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

	// アンマウント時にタイマーをクリーンアップ
	useEffect(() => {
		return () => {
			for (const id of flipTimersRef.current) {
				clearTimeout(id)
			}
		}
	}, [])

	const handleClick = useCallback(() => {
		if (isFlippingRef.current) return

		// 既存のタイマーをクリア（重複防止）
		for (const id of flipTimersRef.current) {
			clearTimeout(id)
		}
		flipTimersRef.current = []

		isFlippingRef.current = true
		setIsFlipping(true)

		// フリップの50%地点（0.2s）でlocaleを切り替え
		const localeTimer = setTimeout(() => {
			toggleLocale()
		}, 200)

		// フリップ完了（0.4s）で状態リセット
		const flipTimer = setTimeout(() => {
			isFlippingRef.current = false
			setIsFlipping(false)
		}, 400)

		flipTimersRef.current = [localeTimer, flipTimer]
	}, [toggleLocale])

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
