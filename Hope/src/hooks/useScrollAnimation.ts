import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import { useSceneStore } from "../store"

gsap.registerPlugin(ScrollTrigger)

/** テキスト要素のパララックス移動量（負値 = 上方向 → 手前に浮く印象） */
const PARALLAX_DESCRIPTION_Y = -15
/** サムネイル要素のパララックス移動量（正値 = 下方向 → 奥にある印象） */
const PARALLAX_THUMBNAIL_Y = 10

/**
 * Initializes GSAP ScrollTrigger-based scroll interactions and visual updates for the page.
 *
 * Sets up: toggling a "scrolled" class on #nav during scroll, a parallax transform and dynamic brightness/saturation filter on #bg-image (and updates scroll progress in the scene store), visibility toggles for elements with .story-content and .experience-content, and a cleanup that kills all ScrollTriggers.
 *
 * @remarks
 * The hook guards against multiple initializations and resets that guard when cleaned up. Only meaningful parameters are stored via the scene store; no parameters are required.
 */
export function useScrollAnimation() {
	const setScrollProgress = useSceneStore((state) => state.setScrollProgress)
	const isInitialized = useRef(false)
	const lastBrightness = useRef(0)
	const lastSaturation = useRef(0)
	const lastScrollProgress = useRef(0)

	useEffect(() => {
		if (isInitialized.current) return
		isInitialized.current = true

		const bgImage = document.getElementById("bg-image")
		const nav = document.getElementById("nav")

		// Navigation scroll effect
		if (nav) {
			ScrollTrigger.create({
				start: "top -80",
				onUpdate: (self) => {
					if (self.direction === 1 && self.progress > 0) {
						nav.classList.add("scrolled")
					} else if (self.progress === 0) {
						nav.classList.remove("scrolled")
					}
				},
			})
		}

		// Background parallax effect
		if (bgImage) {
			gsap.to(bgImage, {
				y: "20%",
				ease: "none",
				scrollTrigger: {
					trigger: "body",
					start: "top top",
					end: "bottom bottom",
					scrub: 3,
				},
			})

			// Background brightness based on scroll
			ScrollTrigger.create({
				trigger: "body",
				start: "top top",
				end: "bottom bottom",
				scrub: 3,
				onUpdate: (self) => {
					const progress = self.progress

					// scrollProgress は差分が十分な場合のみ更新（React再レンダリング抑制）
					const progressDiff = Math.abs(progress - lastScrollProgress.current)
					if (progressDiff >= 0.005) {
						lastScrollProgress.current = progress
						setScrollProgress(progress)
					}

					const brightness = 0.4 + progress * 0.4
					const saturation = 0.8 + progress * 0.3

					const brightnessDiff = Math.abs(brightness - lastBrightness.current)
					const saturationDiff = Math.abs(saturation - lastSaturation.current)

					// フィルタ更新も差分が十分な場合のみ（GPUラスタライズ抑制）
					if (brightnessDiff < 0.05 && saturationDiff < 0.05) {
						return
					}

					lastBrightness.current = brightness
					lastSaturation.current = saturation

					bgImage.style.filter = `brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)})`
				},
			})
		}

		// Story section animations
		const storyContents = document.querySelectorAll(".story-content")
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

		for (const content of storyContents) {
			ScrollTrigger.create({
				trigger: content,
				start: "top 80%",
				end: "bottom 20%",
				onEnter: () => content.classList.add("visible"),
				onLeave: () => content.classList.remove("visible"),
				onEnterBack: () => content.classList.add("visible"),
				onLeaveBack: () => content.classList.remove("visible"),
			})

			// パララックス深度: テキストと画像が異なるスクロール速度で動く
			if (!prefersReducedMotion) {
				const description = content.querySelector(".story-description")
				if (description) {
					gsap.to(description, {
						y: PARALLAX_DESCRIPTION_Y,
						ease: "none",
						scrollTrigger: {
							trigger: content,
							start: "top bottom",
							end: "bottom top",
							scrub: 2,
						},
					})
				}

				const thumbnail = content.querySelector(".story-thumbnail")
				if (thumbnail) {
					gsap.to(thumbnail, {
						y: PARALLAX_THUMBNAIL_Y,
						ease: "none",
						scrollTrigger: {
							trigger: content,
							start: "top bottom",
							end: "bottom top",
							scrub: 3,
						},
					})
				}
			}
		}

		// Experience section animation
		const experienceContent = document.querySelector(".experience-content")
		if (experienceContent) {
			ScrollTrigger.create({
				trigger: experienceContent,
				start: "top 80%",
				onEnter: () => experienceContent.classList.add("visible"),
				onLeaveBack: () => experienceContent.classList.remove("visible"),
			})
		}

		return () => {
			for (const trigger of ScrollTrigger.getAll()) {
				trigger.kill()
			}
			isInitialized.current = false
		}
	}, [setScrollProgress])
}
