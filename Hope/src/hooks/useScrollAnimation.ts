import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useSceneStore } from "../store/sceneStore"

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimation() {
	const setScrollProgress = useSceneStore(state => state.setScrollProgress)
	const isInitialized = useRef(false)
	const lastBrightness = useRef(0)
	const lastSaturation = useRef(0)

	useEffect(() => {
		if (isInitialized.current) return
		isInitialized.current = true

		const bgImage = document.getElementById("bg-image")
		const nav = document.getElementById("nav")

		// Navigation scroll effect
		if (nav) {
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
				onUpdate: self => {
					const progress = self.progress
					const brightness = 0.4 + progress * 0.4
					const saturation = 0.8 + progress * 0.3

					const brightnessDiff = Math.abs(
						brightness - lastBrightness.current
					)
					const saturationDiff = Math.abs(
						saturation - lastSaturation.current
					)

					if (brightnessDiff < 0.02 && saturationDiff < 0.02) {
						setScrollProgress(progress)
						return
					}

					lastBrightness.current = brightness
					lastSaturation.current = saturation

					bgImage.style.filter = `brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)})`
					setScrollProgress(progress)
				},
			})
		}

		// Story section animations
		const storyContents = document.querySelectorAll(".story-content")
		storyContents.forEach(content => {
			ScrollTrigger.create({
				trigger: content,
				start: "top 80%",
				end: "bottom 20%",
				onEnter: () => content.classList.add("visible"),
				onLeave: () => content.classList.remove("visible"),
				onEnterBack: () => content.classList.add("visible"),
				onLeaveBack: () => content.classList.remove("visible"),
			})
		})

		// Experience section animation
		const experienceContent = document.querySelector(".experience-content")
		if (experienceContent) {
			ScrollTrigger.create({
				trigger: experienceContent,
				start: "top 80%",
				onEnter: () => experienceContent.classList.add("visible"),
				onLeaveBack: () =>
					experienceContent.classList.remove("visible"),
			})
		}

		return () => {
			ScrollTrigger.getAll().forEach(trigger => trigger.kill())
			isInitialized.current = false
		}
	}, [setScrollProgress])
}
