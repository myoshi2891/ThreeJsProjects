import { gsap } from "gsap"
import * as THREE from "three"
import type { SceneParams } from "../types"
import type { Water } from "../scene/objects/Water"
import type { Rain } from "../scene/objects/Rain"
import type { Pier } from "../scene/objects/Pier"
import type { PostProcessing } from "../effects/PostProcessing"
import type { AssetLoader } from "../loaders/AssetLoader"

export class HopeAnimation {
	private readonly params: SceneParams
	private readonly water: Water
	private readonly rain: Rain
	private readonly pier: Pier
	private readonly postProcessing: PostProcessing
	private readonly assetLoader: AssetLoader
	private readonly renderer: THREE.WebGLRenderer

	constructor(
		params: SceneParams,
		water: Water,
		rain: Rain,
		pier: Pier,
		postProcessing: PostProcessing,
		assetLoader: AssetLoader,
		renderer: THREE.WebGLRenderer
	) {
		this.params = params
		this.water = water
		this.rain = rain
		this.pier = pier
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
		// waterのhopeFactor更新のみ（rain/pierはSceneManager.update()で処理）
		this.water.updateHopeFactor(this.params.hopeFactor)

		// Bloomエフェクトの更新
		const bloomStrength = THREE.MathUtils.lerp(
			0.2,
			1.2,
			this.params.hopeFactor
		)
		const bloomThreshold = THREE.MathUtils.lerp(
			0.2,
			0.1,
			this.params.hopeFactor
		)
		this.postProcessing.updateBloom(bloomStrength, bloomThreshold)

		// 環境光の更新
		this.assetLoader.updateEnvironmentIntensity(
			THREE.MathUtils.lerp(0.1, 1, this.params.hopeFactor)
		)

		// 背景のぼかし更新
		this.assetLoader.updateBackgroundBlur(
			THREE.MathUtils.lerp(0.3, 0, this.params.hopeFactor)
		)
	}
}
