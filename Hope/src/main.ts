import "./styles.css"
import { SceneManager } from "./scene/SceneManager"
import { ScrollAnimation } from "./animation/ScrollAnimation"

const YOUTUBE_VIDEO_ID = import.meta.env.VITE_YOUTUBE_VIDEO_ID || ""

class App {
	private readonly sceneManager: SceneManager
	private readonly scrollAnimation: ScrollAnimation
	private readonly loadingElement: HTMLElement
	private readonly progressBar: HTMLElement
	private readonly startButton: HTMLButtonElement
	private readonly hopeButton: HTMLButtonElement
	private readonly videoOverlay: HTMLElement
	private readonly youtubePlayer: HTMLIFrameElement
	private readonly videoCloseButton: HTMLButtonElement
	private readonly videoThumbnail: HTMLElement
	private readonly youtubeThumbnailPlayer: HTMLIFrameElement
	private readonly videoExpandButton: HTMLButtonElement

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
		this.videoOverlay = document.getElementById(
			"video-overlay"
		) as HTMLElement
		this.youtubePlayer = document.getElementById(
			"youtube-player"
		) as HTMLIFrameElement
		this.videoCloseButton = document.getElementById(
			"video-close"
		) as HTMLButtonElement
		this.videoThumbnail = document.getElementById(
			"video-thumbnail"
		) as HTMLElement
		this.youtubeThumbnailPlayer = document.getElementById(
			"youtube-thumbnail-player"
		) as HTMLIFrameElement
		this.videoExpandButton = document.getElementById(
			"video-expand"
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

		// Experience button - start the hope animation (no scroll)
		this.hopeButton.addEventListener("click", () => {
			this.hopeButton.classList.add("hidden")
			this.sceneManager.startHopeAnimation()

			// Show video after animation completes (12 seconds)
			setTimeout(() => {
				this.showVideoPlayer()
			}, 12000)
		})

		// Video close button - closes fullscreen and shows thumbnail
		this.videoCloseButton.addEventListener("click", () => {
			this.hideVideoPlayer()
		})

		// Expand button - opens fullscreen from thumbnail
		this.videoExpandButton.addEventListener("click", () => {
			this.expandToFullscreen()
		})

		// Close video on Escape key
		document.addEventListener("keydown", e => {
			if (
				e.key === "Escape" &&
				this.videoOverlay.classList.contains("visible")
			) {
				this.hideVideoPlayer()
			}
		})
	}

	private showVideoPlayer(): void {
		// Set YouTube embed URL with autoplay
		this.youtubePlayer.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`

		this.videoOverlay.classList.remove("hidden")
		requestAnimationFrame(() => {
			this.videoOverlay.classList.add("visible")
		})
	}

	private hideVideoPlayer(): void {
		this.videoOverlay.classList.remove("visible")
		setTimeout(() => {
			this.videoOverlay.classList.add("hidden")
			this.youtubePlayer.src = "" // Stop fullscreen video

			// Show thumbnail video player
			this.showThumbnailPlayer()
		}, 500)
	}

	private showThumbnailPlayer(): void {
		// Set YouTube embed URL (no autoplay for thumbnail)
		this.youtubeThumbnailPlayer.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`

		this.videoThumbnail.classList.remove("hidden")
		requestAnimationFrame(() => {
			this.videoThumbnail.classList.add("visible")
		})
	}

	private expandToFullscreen(): void {
		// Hide thumbnail
		this.videoThumbnail.classList.remove("visible")
		setTimeout(() => {
			this.videoThumbnail.classList.add("hidden")
			this.youtubeThumbnailPlayer.src = "" // Stop thumbnail video

			// Show fullscreen player
			this.showVideoPlayer()
		}, 300)
	}
}

// アプリケーション起動
const app = new App()
try {
	await app.init()
} catch (err) {
	console.error("App init failed:", err)
}
