import "./styles.css"
import { SceneManager } from "./scene/SceneManager"
import { ScrollAnimation } from "./animation/ScrollAnimation"

class App {
	private readonly sceneManager: SceneManager
	private readonly scrollAnimation: ScrollAnimation
	private readonly loadingElement: HTMLElement
	private readonly progressBar: HTMLElement
	private readonly startButton: HTMLButtonElement
	private readonly hopeButton: HTMLButtonElement

	constructor() {
		const container = document.getElementById("canvas-container")
		if (!container) {
			throw new Error("Canvas container not found")
		}

		this.loadingElement = document.getElementById("loading") as HTMLElement
		this.progressBar = document.getElementById(
			"progress-bar"
		) as HTMLElement
		this.startButton = document.getElementById(
			"start-btn"
		) as HTMLButtonElement
		this.hopeButton = document.getElementById(
			"hope-btn"
		) as HTMLButtonElement

		this.sceneManager = new SceneManager(container)

		this.scrollAnimation = new ScrollAnimation({
			onScrollProgress: progress => {
				this.sceneManager.setScrollProgress(progress)
			},
		})
	}

	public async init(): Promise<void> {
		await this.sceneManager.loadAssets(() => {
			this.hideLoading()
		})

		this.setupButtons()
		this.scrollAnimation.init()
		this.sceneManager.animate()
	}

	private hideLoading(): void {
		// Animate progress bar to 100%
		this.progressBar.style.width = "100%"

		setTimeout(() => {
			this.loadingElement.style.opacity = "0"
			setTimeout(() => {
				this.loadingElement.style.display = "none"
			}, 1000)
		}, 500)
	}

	private setupButtons(): void {
		// Hero CTA button - smooth scroll to experience section
		this.startButton.addEventListener("click", () => {
			const experienceSection = document.getElementById("experience")
			if (experienceSection) {
				experienceSection.scrollIntoView({ behavior: "smooth" })
			}
		})

		// Experience button - start the hope animation
		this.hopeButton.addEventListener("click", () => {
			this.hopeButton.classList.add("hidden")
			this.sceneManager.startHopeAnimation()

			// Scroll to top to fully experience the animation
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			})
		})
	}
}

// アプリケーション起動
const app = new App()
try {
	await app.init()
} catch (err) {
	console.error("App init failed:", err)
}
