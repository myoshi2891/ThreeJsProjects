import { useCallback } from "react"

/**
 * ボタンクリック時にソフトなリップルエフェクトを生成するフック
 *
 * クリック位置から有機的な光のグロー拡散アニメーションを作成。
 * animationend で自動的にDOM要素を削除。
 */
export function useRipple() {
	const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		const button = e.currentTarget
		const rect = button.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		const ripple = document.createElement("span")
		ripple.className = "ripple-effect"
		ripple.style.left = `${x}px`
		ripple.style.top = `${y}px`
		button.appendChild(ripple)

		ripple.addEventListener("animationend", () => ripple.remove())
	}, [])

	return { createRipple }
}
