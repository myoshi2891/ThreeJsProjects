import { useEffect, useState } from "react"
import {
	BackgroundLayer,
	CursorGlow,
	ExperienceSection,
	Hero,
	Loading,
	Navigation,
	StorySection,
	VideoOverlay,
} from "../components"
import { ThreeCanvas } from "../components/ThreeCanvas"
import { useHopeAnimation } from "../hooks/useHopeAnimation"
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import { useAppStore, useSceneStore } from "../store"

/**
 * Root application component that composes the UI and coordinates initial loading and hope-mode animation.
 *
 * Simulates loading progress on mount and hides the loading UI after completion. When hope mode becomes active, triggers a one-time hope animation.
 *
 * @returns The App component's JSX tree
 */
export function App() {
	const isLoading = useAppStore((state) => state.isLoading)
	const setLoading = useAppStore((state) => state.setLoading)
	const setLoadingProgress = useAppStore((state) => state.setLoadingProgress)
	const isHopeMode = useAppStore((state) => state.isHopeMode)
	const [isHopeButtonClicked, setIsHopeButtonClicked] = useState(false)

	const scrollProgress = useSceneStore((state) => state.scrollProgress)

	const { startAnimation } = useHopeAnimation()
	useScrollAnimation()

	// Simulate loading progress
	useEffect(() => {
		let progress = 0
		const interval = setInterval(() => {
			progress += 10
			setLoadingProgress(progress)

			if (progress >= 100) {
				clearInterval(interval)
				setTimeout(() => {
					setLoading(false)
				}, 500)
			}
		}, 100)

		return () => clearInterval(interval)
	}, [setLoading, setLoadingProgress])

	// Handle hope animation when button is clicked
	useEffect(() => {
		if (isHopeMode && !isHopeButtonClicked) {
			setIsHopeButtonClicked(true)
			startAnimation()
		}
	}, [isHopeMode, isHopeButtonClicked, startAnimation])

	return (
		<div className={isHopeMode ? "hope-mode" : ""}>
			{isLoading && <Loading />}
			<div
				className="scroll-progress-bar"
				style={{ width: `${scrollProgress * 100}%` }}
				aria-hidden="true"
			/>
			<BackgroundLayer />
			<Navigation />
			<Hero />
			<StorySection type="hope" />
			<StorySection type="life" />
			<StorySection type="possibility" />
			<ExperienceSection />
			<StorySection type="light" />
			<VideoOverlay />
			<ThreeCanvas />
			<CursorGlow />
		</div>
	)
}
