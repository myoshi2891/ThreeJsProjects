/**
 * デバイス性能評価ユーティリティ
 * デバイスの GPU 性能と CPU 並列処理能力に基づいて最適なパーティクル数を計算
 */

export type PerformanceTier = "low" | "medium" | "high"

const RAIN_COUNT_MAP: Record<PerformanceTier, number> = {
	low: 800, // 低性能デバイス（モバイル含む）
	medium: 2000, // 中性能デバイス
	high: 4000, // 高性能デバイス
}

const DEFAULT_RAIN_COUNT = 2000

/** キャッシュ: デバイス種別はセッション中不変のため初回計算結果を保持 */
let cachedIsMobile: boolean | null = null

/**
 * タッチデバイス（モバイル）かどうかを判定
 *
 * 判定結果はモジュールレベルでキャッシュされ、2回目以降の呼び出しは即座に返す。
 *
 * @returns タッチデバイスの場合 true
 *
 * @remarks
 * 既知の制約: Surface Pro 等のタッチ対応デスクトップは true を返す（false positive）。
 * ただし low tier へのフォールバックなので安全側に倒れる。
 */
export function isMobileDevice(): boolean {
	if (cachedIsMobile !== null) return cachedIsMobile

	if (typeof window === "undefined") {
		cachedIsMobile = false
		return false
	}

	const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
	const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches
	cachedIsMobile = hasTouch || hasCoarsePointer
	return cachedIsMobile
}

/**
 * テスト用: isMobileDevice のキャッシュをリセット
 * @internal
 */
export function _resetMobileCache(): void {
	cachedIsMobile = null
}

/**
 * デバイス性能に基づいて最適な Rain パーティクル数を計算
 *
 * @returns 最適なパーティクル数 (800 | 2000 | 4000)
 *
 * @remarks
 * - モバイルデバイスは常に "low" ティア（GPUメモリ・バッテリー保護）
 * - devicePixelRatio: GPU 性能の指標（60% の重み）
 * - hardwareConcurrency: CPU 並列処理能力の指標（40% の重み）
 * - 性能スコア < 0.75: 低性能（800 パーティクル）
 * - 性能スコア 0.75 ~ 1.5: 中性能（2000 パーティクル）
 * - 性能スコア >= 1.5: 高性能（4000 パーティクル）
 */
export function calculateRainCount(): number {
	try {
		// モバイルデバイスは常に低性能ティアにフォールバック
		if (isMobileDevice()) {
			return RAIN_COUNT_MAP.low
		}

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
