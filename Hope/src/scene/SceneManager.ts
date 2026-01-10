import * as THREE from "three"
import { Rain } from "./objects/Rain"
import { Water } from "./objects/Water"
import { PostProcessing } from "../effects/PostProcessing"
import { Pier } from "./objects/Pier"
import { HopeAnimation } from "../animation/HopeAnimation"
import { AssetLoader } from "../loaders/AssetLoader"
import type { SceneParams } from "../types"

export class SceneManager {
	private readonly scene: THREE.Scene
	private readonly camera: THREE.PerspectiveCamera
	private readonly renderer: THREE.WebGLRenderer
	private readonly clock: THREE.Clock

	private readonly pier: Pier
	private readonly water: Water
	private readonly rain: Rain
	private readonly postProcessing: PostProcessing
	private readonly assetLoader: AssetLoader
	private readonly hopeAnimation: HopeAnimation

	private readonly params: SceneParams

	constructor(container: HTMLElement) {
		this.params = {
			hopeFactor: 0,
			bloomStrength: 0.2,
			envIntensity: 0.1,
		}

		this.scene = this.createScene()
		this.camera = this.createCamera()
		this.renderer = this.createRenderer(container)
		this.clock = new THREE.Clock()

		this.postProcessing = new PostProcessing(
			this.renderer,
			this.scene,
			this.camera
		)
		this.assetLoader = new AssetLoader(this.scene)

		this.pier = new Pier()
		this.scene.add(this.pier.getObject())

		this.water = new Water()
		this.scene.add(this.water.getObject())

		this.rain = new Rain()
		this.scene.add(this.rain.getObject())

		this.hopeAnimation = new HopeAnimation(
			this.params,
			this.water,
			this.rain,
			this.postProcessing,
			this.assetLoader,
			this.renderer
		)

		this.setupEventListeners()
	}

	private createScene(): THREE.Scene {
		const scene = new THREE.Scene()
		scene.background = new THREE.Color(0x05070a)
		return scene
	}

	private createCamera(): THREE.PerspectiveCamera {
		const camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		)
		camera.position.set(0, 3, 15)
		camera.lookAt(0, 1, 0)
		return camera
	}

	private createRenderer(container: HTMLElement): THREE.WebGLRenderer {
		const renderer = new THREE.WebGLRenderer({ antialias: false })
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMappingExposure = 0.5
		container.appendChild(renderer.domElement)
		return renderer
	}

	private setupEventListeners(): void {
		window.addEventListener("resize", () => this.onResize())
	}

	private onResize(): void {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.postProcessing.setSize(window.innerWidth, window.innerHeight)
	}

	public async loadAssets(onComplete?: () => void): Promise<void> {
		await this.assetLoader.loadHDRI({
			onComplete: () => {
				onComplete?.()
			},
		})
	}

	public startHopeAnimation(): void {
		this.hopeAnimation.start()
	}

	public update(): void {
		const time = this.clock.getElapsedTime()

		this.water.update(time)
		this.rain.update(this.params.hopeFactor)

		// カメラの微妙な揺れ
		this.camera.position.y = 3 + Math.sin(time * 0.3) * 0.2

		this.postProcessing.render()
	}

	public animate(): void {
		requestAnimationFrame(() => this.animate())
		this.update()
	}
}
