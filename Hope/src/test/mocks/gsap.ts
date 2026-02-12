import { vi } from "vitest"

/**
 * GSAP & ScrollTrigger モックファクトリ
 * 全アニメーションテストの基盤となる共通モック
 */
export const createGSAPMock = (
	injectedScrollTriggers?: Array<{
		config: Record<string, unknown>
		kill: () => void
		killed: boolean
	}>,
) => {
	// ScrollTriggerインスタンスを保持
	const scrollTriggers = injectedScrollTriggers || []

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
				// gsap.to()のモック動作
				// 最小限のTweenオブジェクトを返す（chainingやkill()呼び出しに対応）
				return {
					kill: vi.fn(),
					pause: vi.fn(),
					resume: vi.fn(),
					progress: vi.fn(),
					// biome-ignore lint/suspicious/noThenProperty: Mocking a Thenable interface
					then: vi.fn().mockImplementation((cb) => {
						if (cb) cb()
						return Promise.resolve()
					}),
				}
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
