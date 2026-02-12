import { vi } from "vitest"

/**
 * GSAP & ScrollTrigger モックファクトリ
 * 全アニメーションテストの基盤となる共通モック
 */
export const createGSAPMock = () => {
	// ScrollTriggerインスタンスを保持
	const scrollTriggers: Array<{
		config: any
		kill: () => void
		killed: boolean
	}> = []

	const timelineMock = {
		to: vi.fn(function (this: unknown, target: unknown, config: unknown) {
			// onUpdate コールバックを即座に実行して hopeFactor 更新をシミュレート
			if (
				config &&
				typeof config === "object" &&
				"onUpdate" in config &&
				typeof config.onUpdate === "function"
			) {
				if (
					target &&
					typeof target === "object" &&
					"hopeFactor" in target &&
					"hopeFactor" in config
				) {
					;(target as { hopeFactor: number }).hopeFactor = config.hopeFactor as number
				}
				config.onUpdate()
			}

			// onComplete コールバックの実行
			if (
				config &&
				typeof config === "object" &&
				"onComplete" in config &&
				typeof config.onComplete === "function"
			) {
				config.onComplete()
			}

			return this
		}),
	}

	return {
		gsap: {
			timeline: vi.fn(() => timelineMock),
			to: vi.fn((_target: unknown, _config: unknown) => {
				// gsap.to()のモック動作（背景フィルタアニメーション等）
				// 必要に応じて実装
			}),
			registerPlugin: vi.fn(),
		},
		ScrollTrigger: {
			create: vi.fn((config) => {
				const trigger = {
					config,
					killed: false,
					kill: function (this: { killed: boolean }) {
						this.killed = true
					},
				}
				scrollTriggers.push(trigger)
				return trigger
			}),
			getAll: vi.fn(() => scrollTriggers),
		},
		// テスト検証用ヘルパー
		scrollTriggers,
	}
}
