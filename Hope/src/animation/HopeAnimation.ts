import { gsap } from "gsap"
import type { SceneParams } from "../types"
import type { Water } from "../scene/objects/Water"
import type { Rain } from "../scene/objects/Rain"
import type { PostProcessing } from "../effects/PostProcessing"
import type { AssetLoader } from "../loaders/AssetLoader"

export class HopeAnimation {
	private readonly params: SceneParams
	private readonly water: Water
	private readonly rain: Rain
	private readonly postProcessing: PostProcessing
	private readonly assetLoader: AssetLoader
	private readonly renderer: THREE.WebGLRenderer

	constructor(
		params: SceneParams,
		water: Water,
		rain: Rain,
		postProcessing: PostProcessing,
		assetLoader: AssetLoader,
		renderer: THREE.WebGLRenderer
	) {
		this.params = params
		this.water = water
		this.rain = rain
		this.postProcessing = postProcessing
		this.assetLoader = assetLoader
		this.renderer = renderer
	}

	public start(): void {
		gsap.to(this.params, {
			hopeFactor: 1,
			duration: 10,
			ease: "power2.inOut",
			onUpdate: () => {
				this.updateScene()
			},
		})
	}

	private updateScene(): void {
		const { hopeFactor } = this.params

		// 水のシェーダー更新
		this.water.updateHopeFactor(hopeFactor)

		// 環境マップの更新
		const envIntensity = 0.1 + hopeFactor * 1.5
		this.assetLoader.updateEnvironmentIntensity(envIntensity)

		const blur = 0.5 * (1 - hopeFactor)
		this.assetLoader.updateBackgroundBlur(blur)

		// Bloom効果の更新
		const bloomStrength = 0.2 + hopeFactor * 1.5
		const bloomThreshold = 0.2 + hopeFactor * 0.3
		this.postProcessing.updateBloom(bloomStrength, bloomThreshold)

		// トーンマッピング露出の更新
		this.renderer.toneMappingExposure = 0.5 + hopeFactor * 0.5

		// 雨の透明度更新
		this.rain.setOpacity(1 - hopeFactor)
	}
}
