import { useEffect, useState } from "react"
import { useAppStore } from "../store/appStore"
import {
	Loading,
	Navigation,
	Hero,
	StorySection,
	ExperienceSection,
	VideoOverlay,
	BackgroundLayer,
} from "../components"
import { ThreeCanvas } from "../components/ThreeCanvas"
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import { useHopeAnimation } from "../hooks/useHopeAnimation"

export function App() {
	const isLoading = useAppStore(state => state.isLoading)
	const setLoading = useAppStore(state => state.setLoading)
	const setLoadingProgress = useAppStore(state => state.setLoadingProgress)
	const isHopeMode = useAppStore(state => state.isHopeMode)
	const [isHopeButtonClicked, setIsHopeButtonClicked] = useState(false)

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
			<BackgroundLayer />
			<Navigation />
			<Hero />
			<StorySection type="storm" />
			<StorySection type="change" />
			<StorySection type="hope" />
			<ExperienceSection />
			<StorySection type="about" />
			<VideoOverlay />
			<ThreeCanvas />
		</div>
	)
}
