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
				scrub: 1,
			},
		})

		// Background brightness based on scroll
		ScrollTrigger.create({
			trigger: "body",
			start: "top top",
			end: "bottom bottom",
			scrub: 1,
			onUpdate: self => {
				const progress = self.progress
				const brightness = 0.4 + progress * 0.4
				const saturation = 0.8 + progress * 0.3

				if (this.bgImage) {
					this.bgImage.style.filter = `brightness(${brightness}) saturate(${saturation})`
				}

				this.callbacks.onScrollProgress?.(progress)
			},
		})
	}

	private setupStoryAnimations(): void {
		const storyContents = document.querySelectorAll(".story-content")

		storyContents.forEach((content, index) => {
			const storyType = content.getAttribute("data-story")

			ScrollTrigger.create({
				trigger: content,
				start: "top 80%",
				end: "bottom 20%",
				onEnter: () => {
					content.classList.add("visible")
				},
				onLeave: () => {
					content.classList.remove("visible")
				},
				onEnterBack: () => {
					content.classList.add("visible")
				},
				onLeaveBack: () => {
					content.classList.remove("visible")
				},
				onUpdate: self => {
					const progress = self.progress

					switch (storyType) {
						case "storm":
							this.callbacks.onStormSection?.(progress)
							break
						case "change":
							this.callbacks.onChangeSection?.(progress)
							break
						case "hope":
							this.callbacks.onHopeSection?.(progress)
							break
					}
				},
			})
		})
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
