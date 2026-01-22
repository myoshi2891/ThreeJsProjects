import { gsap } from "gsap"
import { useCallback } from "react"
import { useAppStore } from "../store/appStore"
import { useSceneStore } from "../store/sceneStore"

/**
 * Provides a hook that exposes a function to run a staged "hope" animation sequence.
 *
 * The returned `startAnimation` sets hope mode active, animates the scene's `hopeFactor`
 * through a series of easing phases, and triggers the video overlay when the animation completes.
 *
 * @returns An object with `startAnimation` — a function that begins the staged hope animation and returns the created GSAP `Timeline`.
 */
export function useHopeAnimation() {
	const setHopeFactor = useSceneStore((state) => state.setHopeFactor)
	const setHopeMode = useAppStore((state) => state.setHopeMode)
	const showVideoOverlay = useAppStore((state) => state.showVideoOverlay)

	const startAnimation = useCallback(() => {
		setHopeMode(true)

		const params = { hopeFactor: 0 }

		const timeline = gsap.timeline()

		// Phase 1: Initial dramatic pause
		timeline.to(params, {
			hopeFactor: 0.1,
			duration: 2,
			ease: "power1.out",
			onUpdate: () => setHopeFactor(params.hopeFactor),
		})

		// Phase 2: Storm calming, rain stopping
		timeline.to(params, {
			hopeFactor: 0.4,
			duration: 3,
			ease: "power2.inOut",
			onUpdate: () => setHopeFactor(params.hopeFactor),
		})

		// Phase 3: Light breaking through
		timeline.to(params, {
			hopeFactor: 0.8,
			duration: 4,
			ease: "power2.inOut",
			onUpdate: () => setHopeFactor(params.hopeFactor),
		})

		// Phase 4: Full hope
		timeline.to(params, {
			hopeFactor: 1,
			duration: 3,
			ease: "power1.out",
			onUpdate: () => setHopeFactor(params.hopeFactor),
			onComplete: () => {
				// Show video after animation completes
				setTimeout(() => {
					showVideoOverlay()
				}, 0)
			},
		})

		return timeline
	}, [setHopeFactor, setHopeMode, showVideoOverlay])

	return { startAnimation }
}
