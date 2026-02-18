import { useEffect, useMemo, useState } from "react"

export interface MediaQuery {
	/** メディアクエリ文字列 (例: "(hover: hover)") */
	query: string
	/** true なら matches が true のとき有効、false なら matches が false のとき有効 */
	mustMatch: boolean
}

/**
 * メディアクエリの現在の状態を評価する関数（初期値算出用）
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
 * @param queries - 監視するメディアクエリ条件の配列。
 *   内部で `JSON.stringify` による値比較で安定化されるため、インライン配列を
 *   渡しても不要な再実行は発生しない。ただしパフォーマンスの観点から
 *   モジュールスコープ定数としての定義を推奨。
 * @returns すべての条件を満たす場合 true
 *
 * @example
 * ```ts
 * // 推奨: モジュールスコープで定義
 * const MEDIA_QUERIES = [
 *   { query: "(hover: hover)", mustMatch: true },
 *   { query: "(pointer: fine)", mustMatch: true },
 *   { query: "(prefers-reduced-motion: reduce)", mustMatch: false },
 * ]
 *
 * function MyComponent() {
 *   const canShow = useMediaCapability(MEDIA_QUERIES)
 * }
 * ```
 */
export function useMediaCapability(queries: MediaQuery[]): boolean {
	// queries 参照の安定化: インライン配列を渡しても値が同じなら再実行しない
	// biome-ignore lint/correctness/useExhaustiveDependencies: 値の同一性で比較するため意図的に JSON.stringify を使用
	const stableQueries = useMemo(() => queries, [JSON.stringify(queries)])

	const [isCapable, setIsCapable] = useState(() => evaluateQueries(stableQueries))

	useEffect(() => {
		if (typeof window === "undefined") return

		const mediaQueryLists = stableQueries.map(({ query }) => window.matchMedia(query))

		// mediaQueryLists を直接参照して再評価（matchMedia の再生成を回避）
		const handleChange = () => {
			const result = mediaQueryLists.every((mql, i) => {
				return stableQueries[i].mustMatch ? mql.matches : !mql.matches
			})
			setIsCapable(result)
		}

		// 初回同期: effect 実行時に最新のメディア状態を反映
		handleChange()

		for (const mql of mediaQueryLists) {
			mql.addEventListener("change", handleChange)
		}

		return () => {
			for (const mql of mediaQueryLists) {
				mql.removeEventListener("change", handleChange)
			}
		}
	}, [stableQueries])

	return isCapable
}
