import { gsap } from "gsap"
import type { WebGLRenderer } from "three"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { GodRays } from "../../effects/GodRays"
import type { PostProcessing } from "../../effects/PostProcessing"
import type { AssetLoader } from "../../loaders/AssetLoader"
import type { Fog } from "../../scene/objects/Fog"
import type { LightParticles } from "../../scene/objects/LightParticles"
import type { Rain } from "../../scene/objects/Rain"
import type { SceneParams } from "../../types"
import { HopeAnimation } from "../HopeAnimation"

// 共通GSAPモックを使用
// 共通GSAPモックを使用
vi.mock("gsap", async () => {
	const { createGSAPMock } = await import("../../test/mocks/gsap")
	const mocks = createGSAPMock()
	return {
		gsap: mocks.gsap,
	}
})

describe("HopeAnimation", () => {
	let hopeAnimation: HopeAnimation
	let params: SceneParams
	let mockRain: Rain
	let mockPostProcessing: PostProcessing
	let mockAssetLoader: AssetLoader
	let mockRenderer: WebGLRenderer
	let mockFog: Fog
	let mockLightParticles: LightParticles
	let mockGodRays: GodRays
	let mockBgImage: HTMLElement

	beforeEach(() => {
		// DOM環境のセットアップ（既存の要素をクリア）
		document.getElementById("bg-image")?.remove()
		document.body.classList.remove("hope-mode")

		mockBgImage = document.createElement("div")
		mockBgImage.id = "bg-image"
		document.body.appendChild(mockBgImage)

		// SceneParams初期化
		params = {
			hopeFactor: 0,
			bloomStrength: 0,
			envIntensity: 0,
		}

		// Rainモック
		mockRain = {
			setOpacity: vi.fn(),
		} as unknown as Rain

		// PostProcessingモック
		mockPostProcessing = {
			updateBloom: vi.fn(),
		} as unknown as PostProcessing

		// AssetLoaderモック
		mockAssetLoader = {
			updateEnvironmentIntensity: vi.fn(),
			updateBackgroundBlur: vi.fn(),
		} as unknown as AssetLoader

		// Rendererモック
		mockRenderer = {
			toneMappingExposure: 0,
		} as unknown as WebGLRenderer

		// 未使用のモック（型の一貫性のため）
		mockFog = {} as Fog
		mockLightParticles = {} as LightParticles
		mockGodRays = {} as GodRays

		// HopeAnimationインスタンス作成
		hopeAnimation = new HopeAnimation(
			params,
			mockRain,
			mockPostProcessing,
			mockAssetLoader,
			mockRenderer,
			mockFog,
			mockLightParticles,
			mockGodRays,
		)

		vi.clearAllMocks()
	})

	it("start()を実行するとbody要素にhope-modeクラスが追加される", () => {
		expect(document.body.classList.contains("hope-mode")).toBe(false)

		hopeAnimation.start()

		expect(document.body.classList.contains("hope-mode")).toBe(true)
	})

	it("start()を実行するとGSAPタイムラインが作成され、hopeFactorが更新される", () => {
		hopeAnimation.start()

		// hopFactorが更新されることを確認
		expect(params.hopeFactor).toBeGreaterThan(0)
		expect(params.hopeFactor).toBeLessThanOrEqual(1)
	})

	it("背景画像が存在する場合、フィルタアニメーションが適用される（GSAP呼び出し確認）", async () => {
		const bgImageElement = document.getElementById("bg-image")
		expect(bgImageElement).toBeTruthy()

		hopeAnimation.start()

		// GSAPのモック呼び出しを取得（vi.mockedを使用）
		const mockedGsap = vi.mocked(gsap)

		// gsap.to が背景要素に対して呼ばれたことを確認
		expect(mockedGsap.to).toHaveBeenCalledWith(
			bgImageElement,
			expect.objectContaining({
				filter: expect.stringContaining("brightness"),
			}),
		)
	})

	it("背景画像が存在しない場合でもエラーが発生しない", () => {
		// bg-imageを削除
		const bgImage = document.getElementById("bg-image")
		if (bgImage) {
			bgImage.remove()
		}

		// 新しいインスタンスを作成（bg-imageがない状態で）
		const animationWithoutBg = new HopeAnimation(
			params,
			mockRain,
			mockPostProcessing,
			mockAssetLoader,
			mockRenderer,
			mockFog,
			mockLightParticles,
			mockGodRays,
		)

		expect(() => animationWithoutBg.start()).not.toThrow()
	})

	it("updateScene()でRainのopacityが更新される", () => {
		hopeAnimation.start()

		// GSAPのonUpdateコールバックが実行され、Rain.setOpacityが呼ばれる
		expect(mockRain.setOpacity).toHaveBeenCalled()
	})

	it("updateScene()でBloomエフェクトが更新される", () => {
		hopeAnimation.start()

		// GSAPのonUpdateコールバックが実行され、PostProcessing.updateBloomが呼ばれる
		expect(mockPostProcessing.updateBloom).toHaveBeenCalled()
	})

	it("updateScene()でEnvironment intensity/blurが更新される", () => {
		hopeAnimation.start()

		expect(mockAssetLoader.updateEnvironmentIntensity).toHaveBeenCalled()
		expect(mockAssetLoader.updateBackgroundBlur).toHaveBeenCalled()
	})

	it("updateScene()でTone mapping exposureが更新される", () => {
		const initialExposure = mockRenderer.toneMappingExposure

		hopeAnimation.start()

		// exposureが変更されていることを確認
		expect(mockRenderer.toneMappingExposure).not.toBe(initialExposure)
	})

	it("hopFactor変化が小さい場合、updateScene()による描画更新がスロットリングされる", () => {
		// モックの呼び出し回数をリセット
		vi.clearAllMocks()

		// 1. ベースラインStateの確率
		// 初期化のために一度呼ぶ（ここで lastHopeFactor = 0 になるはずだが、初期値も0なので強制的に更新させる）
		;(hopeAnimation as any).lastHopeFactor = -1
		params.hopeFactor = 0
		;(hopeAnimation as any).updateScene()
		expect(mockRain.setOpacity).toHaveBeenCalledTimes(1)

		// 2. 微小な変化（0.01未満）
		// 差分: 0.005 < 0.01 -> 更新されないはず
		params.hopeFactor = 0.005
		;(hopeAnimation as any).updateScene()
		expect(mockRain.setOpacity).toHaveBeenCalledTimes(1) // 回数は増えない

		// 3. 大きな変化（0.01以上）
		// 差分: 0.02 - 0 (lastHopeFactor) = 0.02 >= 0.01 -> 更新されるはず
		// ここで params.hopeFactor = 0.02 に変更
		params.hopeFactor = 0.02
		;(hopeAnimation as any).updateScene()
		expect(mockRain.setOpacity).toHaveBeenCalledTimes(2) // 回数が増える
	})
})
