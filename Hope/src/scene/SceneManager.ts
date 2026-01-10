import * as THREE from "three"
import { Rain } from "./objects/Rain"
import { Pier } from "./objects/Pier"
import { Water } from "./objects/Water"
import { AssetLoader } from "../loaders/AssetLoader"
import { HopeAnimation } from "../animation/HopeAnimation"
import { PostProcessing } from "../effects/PostProcessing"
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
			this.pier,
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
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		)
		camera.position.set(0, 3, 10)
		return camera
	}

	private createRenderer(container: HTMLElement): THREE.WebGLRenderer {
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: "high-performance",
		})
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMappingExposure = 1
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
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		this.postProcessing.setSize(window.innerWidth, window.innerHeight)
	}
	public async loadAssets(onComplete?: () => void): Promise<void> {
		await this.assetLoader.loadHDRI({
			onComplete,
		})
	}

	public startHopeAnimation(): void {
		this.hopeAnimation.start()
	}

	public update(): void {
		const time = this.clock.getElapsedTime()

		this.water.update(time)
		this.rain.update(this.params.hopeFactor)
		this.pier.updateHopeFactor(this.params.hopeFactor)

		// カメラの微妙な揺れ（希望が増すにつれて安定）
		const cameraShake = THREE.MathUtils.lerp(
			0.2,
			0.05,
			this.params.hopeFactor
		)
		this.camera.position.y = 3 + Math.sin(time * 0.3) * cameraShake

		this.postProcessing.render()
	}

	public animate(): void {
		requestAnimationFrame(() => this.animate())
		this.update()
	}
}
