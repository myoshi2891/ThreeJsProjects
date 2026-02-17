import { useCallback } from "react"

/**
 * ボタンクリック時にソフトなリップルエフェクトを生成するフック
 *
 * クリック位置から有機的な光のグロー拡散アニメーションを作成。
 * animationend で自動的にDOM要素を削除。
 * prefers-reduced-motion 時はアニメーションをスキップ。
 */
export function useRipple() {
	const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		// prefers-reduced-motion チェック
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return
		}

		const button = e.currentTarget
		const rect = button.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		const ripple = document.createElement("span")
		ripple.className = "ripple-effect"
		ripple.style.left = `${x}px`
		ripple.style.top = `${y}px`
		button.appendChild(ripple)

		// animationend が発火しない場合のフォールバック削除
		const fallbackTimer = setTimeout(() => ripple.remove(), 400)

		ripple.addEventListener("animationend", () => {
			clearTimeout(fallbackTimer)
			ripple.remove()
		})
	}, [])

	return { createRipple }
}
