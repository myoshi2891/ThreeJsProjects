import * as THREE from "three"
import { HopeAnimation } from "../animation/HopeAnimation"
import { GodRays } from "../effects/GodRays"
import { PostProcessing } from "../effects/PostProcessing"
import { AssetLoader } from "../loaders/AssetLoader"
import type { SceneParams } from "../types"
import { Fog } from "./objects/Fog"
import { LightParticles } from "./objects/LightParticles"
import { Rain } from "./objects/Rain"

export class SceneManager {
	private readonly scene: THREE.Scene
	private readonly camera: THREE.PerspectiveCamera
	private readonly renderer: THREE.WebGLRenderer
	private readonly clock: THREE.Clock

	private readonly rain: Rain
	private readonly fog: Fog
	private readonly lightParticles: LightParticles
	private readonly godRays: GodRays
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

		this.postProcessing = new PostProcessing(this.renderer, this.scene, this.camera)
		this.assetLoader = new AssetLoader(this.scene)

		// Create scene objects
		this.rain = new Rain()
		this.scene.add(this.rain.getObject())

		this.fog = new Fog()
		this.scene.add(this.fog.getObject())

		this.lightParticles = new LightParticles()
		this.scene.add(this.lightParticles.getObject())

		this.godRays = new GodRays()
		this.scene.add(this.godRays.getObject())

		// Setup hope animation
		this.hopeAnimation = new HopeAnimation(
			this.params,
			this.rain,
			this.postProcessing,
			this.assetLoader,
			this.renderer,
			this.fog,
			this.lightParticles,
			this.godRays,
		)

		this.setupEventListeners()
	}

	private createScene(): THREE.Scene {
		const scene = new THREE.Scene()
		// Transparent background to show the 2D photo behind
		scene.background = null
		return scene
	}

	private createCamera(): THREE.PerspectiveCamera {
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
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
		renderer.setClearColor(0x000000, 0) // Transparent background
		container.appendChild(renderer.domElement)
		return renderer
	}

	private setupEventListeners(): void {
		window.addEventListener("resize", () => this.onResize())

		// Mouse parallax for camera
		window.addEventListener("mousemove", (e) => this.onMouseMove(e))
	}

	private onMouseMove(event: MouseEvent): void {
		const x = (event.clientX / window.innerWidth - 0.5) * 2
		const y = (event.clientY / window.innerHeight - 0.5) * 2

		// Subtle camera movement based on mouse position
		this.camera.position.x = x * 0.5
		this.camera.position.y = 3 - y * 0.3
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

	public setScrollProgress(progress: number): void {
		// Apply scroll-based environmental changes
		const scrollHope = Math.min(progress * 0.3, 0.3) // Max 30% from scrolling
		this.updateEnvironmentFromScroll(scrollHope)
	}

	private updateEnvironmentFromScroll(scrollHope: number): void {
		// Gradual environmental changes based on scroll
		this.fog.update(this.clock.getElapsedTime(), 1 - scrollHope * 2)
	}

	public startHopeAnimation(): void {
		this.hopeAnimation.start()

		// Make canvas interactive during animation
		const container = document.getElementById("canvas-container")
		if (container) {
			container.classList.add("interactive")
		}
	}

	public update(): void {
		const time = this.clock.getElapsedTime()

		// Update all scene objects
		this.rain.update(this.params.hopeFactor)
		this.fog.update(time, this.params.hopeFactor)
		this.lightParticles.update(time, this.params.hopeFactor)
		this.godRays.update(time, this.params.hopeFactor)

		// Camera breathing effect removed - caused flickering
		// const cameraShake = THREE.MathUtils.lerp(0.15, 0.03, this.params.hopeFactor)
		// this.camera.position.y += Math.sin(time * 0.3) * cameraShake * 0.1

		this.postProcessing.render()
	}

	public animate(): void {
		requestAnimationFrame(() => this.animate())
		this.update()
	}
}
