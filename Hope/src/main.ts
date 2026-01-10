import { SceneManager } from "./scene/SceneManager"

class App {
	private readonly sceneManager: SceneManager
	private readonly loadingElement: HTMLElement
	private readonly buttonElement: HTMLButtonElement

	constructor() {
		const container = document.getElementById("canvas-container")
		if (!container) {
			throw new Error("Canvas container not found")
		}

		this.loadingElement = document.getElementById("loading") as HTMLElement
		this.buttonElement = document.getElementById(
			"hope-btn"
		) as HTMLButtonElement

		this.sceneManager = new SceneManager(container)
	}

	public async init(): Promise<void> {
		await this.sceneManager.loadAssets(() => {
			this.hideLoading()
		})

		this.setupButton()
		this.sceneManager.animate()
	}

	private hideLoading(): void {
		this.loadingElement.style.opacity = "0"
		setTimeout(() => {
			this.loadingElement.style.display = "none"
			this.buttonElement.classList.remove("hidden")
		}, 1000)
	}

	private setupButton(): void {
		this.buttonElement.addEventListener("click", () => {
			this.buttonElement.classList.add("hidden")
			this.sceneManager.startHopeAnimation()
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
