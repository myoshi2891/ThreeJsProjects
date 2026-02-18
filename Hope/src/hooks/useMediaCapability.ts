import { useEffect, useState } from "react"

export interface MediaQuery {
	/** メディアクエリ文字列 (例: "(hover: hover)") */
	query: string
	/** true なら matches が true のとき有効、false なら matches が false のとき有効 */
	mustMatch: boolean
}

/**
 * メディアクエリの現在の状態を評価する関数
 */
function evaluateQueries(queries: MediaQuery[]): boolean {
	if (typeof window === "undefined") return false
	return queries.every(({ query, mustMatch }) => {
		const result = window.matchMedia(query).matches
		return mustMatch ? result : !result
	})
}

/**
 * 複数のメディアクエリをリアクティブに監視し、すべての条件を満たすかを返すフック。
 *
 * メディアクエリの変化（デバイス回転、外部ディスプレイ接続等）に自動追従し、
 * 条件が変わると再レンダリングをトリガーする。
 *
 * @param queries - 監視するメディアクエリ条件の配列
 * @returns すべての条件を満たす場合 true
 *
 * @example
 * ```ts
 * // ホバー可能 + ファインポインター + モーション制限なし
 * const canShow = useMediaCapability([
 *   { query: "(hover: hover)", mustMatch: true },
 *   { query: "(pointer: fine)", mustMatch: true },
 *   { query: "(prefers-reduced-motion: reduce)", mustMatch: false },
 * ])
 * ```
 */
export function useMediaCapability(queries: MediaQuery[]): boolean {
	const [isCapable, setIsCapable] = useState(() => evaluateQueries(queries))

	useEffect(() => {
		if (typeof window === "undefined") return

		const mediaQueryLists = queries.map(({ query }) => window.matchMedia(query))

		const handleChange = () => {
			setIsCapable(evaluateQueries(queries))
		}

		for (const mql of mediaQueryLists) {
			mql.addEventListener("change", handleChange)
		}

		return () => {
			for (const mql of mediaQueryLists) {
				mql.removeEventListener("change", handleChange)
			}
		}
	}, [queries])

	return isCapable
}
