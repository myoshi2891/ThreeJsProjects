import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

export class PostProcessing {
	private readonly composer: EffectComposer
	private readonly bloomPass: UnrealBloomPass

	constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
		this.composer = new EffectComposer(renderer)

		const renderScene = new RenderPass(scene, camera)
		this.composer.addPass(renderScene)

		this.bloomPass = new UnrealBloomPass(
			new THREE.Vector2(window.innerWidth, window.innerHeight),
			1.5,
			0.4,
			0.85,
		)
		this.bloomPass.threshold = 0.2
		this.bloomPass.strength = 0.2
		this.bloomPass.radius = 0.5
		this.composer.addPass(this.bloomPass)

		const outputPass = new OutputPass()
		this.composer.addPass(outputPass)
	}

	public updateBloom(strength: number, threshold: number): void {
		this.bloomPass.strength = strength
		this.bloomPass.threshold = threshold
	}

	public render(): void {
		this.composer.render()
	}

	public setSize(width: number, height: number): void {
		this.composer.setSize(width, height)
	}
}
