import { vi } from "vitest"

/**
 * GSAP & ScrollTrigger モック
 * 全アニメーションテストの基盤となる共通モック
 */

export const createGSAPMock = () => {
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
			to: vi.fn(),
			registerPlugin: vi.fn(),
		},
		ScrollTrigger: {
			create: vi.fn((config) => ({
				kill: vi.fn(),
				config,
			})),
			getAll: vi.fn(() => []),
		},
	}
}
