import * as THREE from "three"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import type { LoadingCallbacks } from "../types"

export class AssetLoader {
	private readonly scene: THREE.Scene
	private readonly hdriUrl =
		"https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_48d_partly_cloudy_puresky_1k.hdr"

	constructor(scene: THREE.Scene) {
		this.scene = scene
	}

	public async loadHDRI(callbacks?: LoadingCallbacks): Promise<void> {
		return new Promise((resolve, reject) => {
			new RGBELoader().load(
				this.hdriUrl,
				texture => {
					texture.mapping = THREE.EquirectangularReflectionMapping
					this.scene.environment = texture
					this.scene.background = texture

					this.scene.backgroundBlurriness = 0.5
					this.scene.backgroundIntensity = 0.1
					this.scene.environmentIntensity = 0.1

					callbacks?.onComplete?.()
					resolve()
				},
				progress => {
					const percentComplete =
						(progress.loaded / progress.total) * 100
					callbacks?.onProgress?.(percentComplete)
				},
				error => {
					console.error("HDRi loading error:", error)
					callbacks?.onError?.(error as Error)
					// HDRiが読み込めなくても続行
					callbacks?.onComplete?.()
					resolve()
				}
			)
		})
	}

	public updateEnvironmentIntensity(intensity: number): void {
		if (
			this.scene.background &&
			(this.scene.background as THREE.Texture).isTexture
		) {
			this.scene.backgroundIntensity = intensity
			this.scene.environmentIntensity = intensity
		}
	}

	public updateBackgroundBlur(blur: number): void {
		if (
			this.scene.background &&
			(this.scene.background as THREE.Texture).isTexture
		) {
			this.scene.backgroundBlurriness = blur
		}
	}
}
