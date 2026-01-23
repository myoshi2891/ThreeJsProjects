import { gsap } from "gsap"
import * as THREE from "three"
import type { GodRays } from "../effects/GodRays"
import type { PostProcessing } from "../effects/PostProcessing"
import type { AssetLoader } from "../loaders/AssetLoader"
import type { Fog } from "../scene/objects/Fog"
import type { LightParticles } from "../scene/objects/LightParticles"
import type { Rain } from "../scene/objects/Rain"
import type { SceneParams } from "../types"

export class HopeAnimation {
	private readonly params: SceneParams
	private readonly rain: Rain
	private readonly postProcessing: PostProcessing
	private readonly assetLoader: AssetLoader
	private readonly renderer: THREE.WebGLRenderer
	private readonly bgImage: HTMLElement | null
	private lastHopeFactor = 0 // For throttling updates

	constructor(
		params: SceneParams,
		rain: Rain,
		postProcessing: PostProcessing,
		assetLoader: AssetLoader,
		renderer: THREE.WebGLRenderer,
		_fog: Fog,
		_lightParticles: LightParticles,
		_godRays: GodRays,
	) {
		this.params = params
		this.rain = rain
		this.postProcessing = postProcessing
		this.assetLoader = assetLoader
		this.renderer = renderer
		this.bgImage = document.getElementById("bg-image")
	}

	public start(): void {
		// Add hope-mode class to enable light text colors
		document.body.classList.add("hope-mode")

		// Main hope animation timeline
		const timeline = gsap.timeline()

		// Phase 1: Initial dramatic pause
		timeline.to(this.params, {
			hopeFactor: 0.1,
			duration: 2,
			ease: "power1.out",
			onUpdate: () => this.updateScene(),
		})

		// Phase 2: Storm calming, rain stopping
		timeline.to(this.params, {
			hopeFactor: 0.4,
			duration: 3,
			ease: "power2.inOut",
			onUpdate: () => this.updateScene(),
		})

		// Phase 3: Light breaking through - main hope reveal
		timeline.to(this.params, {
			hopeFactor: 0.8,
			duration: 4,
			ease: "power2.inOut",
			onUpdate: () => this.updateScene(),
		})

		// Phase 4: Full hope
		timeline.to(this.params, {
			hopeFactor: 1,
			duration: 3,
			ease: "power1.out",
			onUpdate: () => this.updateScene(),
		})

		// Animate background image simultaneously
		if (this.bgImage) {
			gsap.to(this.bgImage, {
				filter: "brightness(0.9) saturate(1.2)",
				duration: 12,
				ease: "power2.inOut",
			})
		}
	}

	private updateScene(): void {
		const hopeFactor = this.params.hopeFactor

		// Skip update if change is too small (reduces flickering)
		if (Math.abs(hopeFactor - this.lastHopeFactor) < 0.01) {
			return
		}
		this.lastHopeFactor = hopeFactor

		// Rain fading
		const rainOpacity = THREE.MathUtils.lerp(1, 0, hopeFactor)
		this.rain.setOpacity(rainOpacity)

		// Bloom effect - stronger with hope
		const bloomStrength = THREE.MathUtils.lerp(0.2, 1.5, hopeFactor)
		const bloomThreshold = THREE.MathUtils.lerp(0.3, 0.1, hopeFactor)
		this.postProcessing.updateBloom(bloomStrength, bloomThreshold)

		// Environment intensity
		const envIntensity = THREE.MathUtils.lerp(0.1, 1, hopeFactor)
		this.assetLoader.updateEnvironmentIntensity(envIntensity)

		// Background blur reduction
		const bgBlur = THREE.MathUtils.lerp(0.3, 0, hopeFactor)
		this.assetLoader.updateBackgroundBlur(bgBlur)

		// Tone mapping exposure
		const exposure = THREE.MathUtils.lerp(0.8, 1.5, hopeFactor)
		this.renderer.toneMappingExposure = exposure
	}
}
