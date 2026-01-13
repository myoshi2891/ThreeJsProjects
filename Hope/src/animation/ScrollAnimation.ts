import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export interface ScrollAnimationCallbacks {
	onStormSection?: (progress: number) => void
	onChangeSection?: (progress: number) => void
	onHopeSection?: (progress: number) => void
	onScrollProgress?: (progress: number) => void
}

export class ScrollAnimation {
	private readonly callbacks: ScrollAnimationCallbacks
	private readonly bgImage: HTMLElement | null
	private isInitialized = false
	private lastBrightness = 0
	private lastSaturation = 0
	private storyVisibilityState: Map<Element, boolean> = new Map()

	constructor(callbacks: ScrollAnimationCallbacks = {}) {
		this.callbacks = callbacks
		this.bgImage = document.getElementById("bg-image")
	}

	public init(): void {
		if (this.isInitialized) return
		this.isInitialized = true

		this.setupNavScroll()
		this.setupParallax()
		this.setupStoryAnimations()
		this.setupExperienceSection()
	}

	private setupNavScroll(): void {
		const nav = document.getElementById("nav")
		if (!nav) return

		ScrollTrigger.create({
			start: "top -80",
			onUpdate: self => {
				if (self.direction === 1 && self.progress > 0) {
					nav.classList.add("scrolled")
				} else if (self.progress === 0) {
					nav.classList.remove("scrolled")
				}
			},
		})
	}

	private setupParallax(): void {
		if (!this.bgImage) return

		// Background parallax effect
		gsap.to(this.bgImage, {
			y: "20%",
			ease: "none",
			scrollTrigger: {
				trigger: "body",
				start: "top top",
				end: "bottom bottom",
				scrub: 3, // Synchronized with filter scrub
			},
		})

		// Background brightness based on scroll
		ScrollTrigger.create({
			trigger: "body",
			start: "top top",
			end: "bottom bottom",
			scrub: 3, // Higher scrub for even smoother updates
			onUpdate: self => {
				const progress = self.progress
				const brightness = 0.4 + progress * 0.4
				const saturation = 0.8 + progress * 0.3

				// Only update if change is significant (threshold 0.02)
				const brightnessDiff = Math.abs(
					brightness - this.lastBrightness
				)
				const saturationDiff = Math.abs(
					saturation - this.lastSaturation
				)

				if (brightnessDiff < 0.02 && saturationDiff < 0.02) {
					this.callbacks.onScrollProgress?.(progress)
					return
				}

				this.lastBrightness = brightness
				this.lastSaturation = saturation

				if (this.bgImage) {
					this.bgImage.style.filter = `brightness(${brightness.toFixed(
						2
					)}) saturate(${saturation.toFixed(2)})`
				}

				this.callbacks.onScrollProgress?.(progress)
			},
		})
	}

	private setupStoryAnimations(): void {
		const storyContents = document.querySelectorAll(".story-content")

		storyContents.forEach((content, index) => {
			const storyType = content.getAttribute("data-story")

			// Initialize visibility state
			this.storyVisibilityState.set(content, false)

			ScrollTrigger.create({
				trigger: content,
				start: "top 80%",
				end: "bottom 20%",
				onEnter: () => this.setStoryVisible(content, true),
				onLeave: () => this.setStoryVisible(content, false),
				onEnterBack: () => this.setStoryVisible(content, true),
				onLeaveBack: () => this.setStoryVisible(content, false),
				// Removed onUpdate to reduce callback frequency
			})
		})
	}

	// Debounced visibility setter to prevent rapid toggles
	private setStoryVisible(content: Element, visible: boolean): void {
		const currentState = this.storyVisibilityState.get(content)
		if (currentState === visible) return // Skip if no change

		this.storyVisibilityState.set(content, visible)
		if (visible) {
			content.classList.add("visible")
		} else {
			content.classList.remove("visible")
		}
	}

	private setupExperienceSection(): void {
		const experienceContent = document.querySelector(".experience-content")

		if (experienceContent) {
			ScrollTrigger.create({
				trigger: experienceContent,
				start: "top 80%",
				onEnter: () => {
					experienceContent.classList.add("visible")
				},
				onLeaveBack: () => {
					experienceContent.classList.remove("visible")
				},
			})
		}
	}

	public destroy(): void {
		ScrollTrigger.getAll().forEach(trigger => trigger.kill())
		this.isInitialized = false
	}
}
