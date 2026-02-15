/**
 * デバイス性能評価ユーティリティ
 * デバイスの GPU 性能と CPU 並列処理能力に基づいて最適なパーティクル数を計算
 */

export type PerformanceTier = "low" | "medium" | "high"

const RAIN_COUNT_MAP: Record<PerformanceTier, number> = {
	low: 1500, // 低性能デバイス
	medium: 3000, // 中性能デバイス（デフォルト）
	high: 5000, // 高性能デバイス
}

const DEFAULT_RAIN_COUNT = 3000

/**
 * デバイス性能に基づいて最適な Rain パーティクル数を計算
 *
 * @returns 最適なパーティクル数 (1500 | 3000 | 5000)
 *
 * @remarks
 * - devicePixelRatio: GPU 性能の指標（60% の重み）
 * - hardwareConcurrency: CPU 並列処理能力の指標（40% の重み）
 * - 性能スコア < 0.75: 低性能（1500 パーティクル）
 * - 性能スコア 0.75 ~ 1.5: 中性能（3000 パーティクル）
 * - 性能スコア >= 1.5: 高性能（5000 パーティクル）
 */
export function calculateRainCount(): number {
	try {
		const dpr = window?.devicePixelRatio ?? 1
		const cores = navigator?.hardwareConcurrency ?? 4

		// GPU 性能（60%）と CPU 並列度（40%）を組み合わせて評価
		const score = (dpr / 2) * 0.6 + (cores / 8) * 0.4

		let tier: PerformanceTier
		if (score < 0.75) {
			tier = "low"
		} else if (score < 1.5) {
			tier = "medium"
		} else {
			tier = "high"
		}

		return RAIN_COUNT_MAP[tier]
	} catch {
		return DEFAULT_RAIN_COUNT
	}
}
