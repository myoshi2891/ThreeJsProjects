import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js"
import * as THREE from "three"
import type { LoadingCallbacks } from "../types"

export class AssetLoader {
	private readonly scene: THREE.Scene
	private readonly hdriUrl = "/textures/clear_puresky.exr"

	constructor(scene: THREE.Scene) {
		this.scene = scene
	}

	public async loadHDRI(callbacks?: LoadingCallbacks): Promise<void> {
		return new Promise((resolve, reject) => {
			new EXRLoader().load(
				this.hdriUrl,
				texture => {
					texture.mapping = THREE.EquirectangularReflectionMapping

					// ✅ テクスチャの品質設定を追加
					texture.minFilter = THREE.LinearFilter
					texture.magFilter = THREE.LinearFilter
					texture.generateMipmaps = false

					this.scene.environment = texture
					this.scene.background = texture
					this.scene.backgroundBlurriness = 0
					this.scene.backgroundIntensity = 1
					this.scene.environmentIntensity = 1

					callbacks?.onComplete?.()
					resolve()
				},
				progress => {
					const percentComplete =
						progress.total > 0
							? (progress.loaded / progress.total) * 100
							: 0
					callbacks?.onProgress?.(percentComplete)
				},
				error => {
					console.error("EXR loading error:", error)
					callbacks?.onError?.(error as Error)
					callbacks?.onComplete?.()
					resolve()
				}
			)
		})
	}

	public updateEnvironmentIntensity(intensity: number): void {
		this.scene.environmentIntensity = intensity
	}

	public updateBackgroundBlur(blur: number): void {
		this.scene.backgroundBlurriness = blur
	}
}
