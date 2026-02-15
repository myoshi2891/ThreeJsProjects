import { useCallback, useEffect, useRef, useState } from "react"
import { useAppStore, useI18nStore } from "../store"
import { VideoThumbnail } from "./VideoThumbnail"

/**
 * Renders the experience section with a video thumbnail in the same style as StorySection.
 *
 * Clicking the button hides it and sets "hope mode" in the global app store; the parent App component
 * handles playing the hope animation and displaying the video.
 *
 * @returns The section's JSX element containing the number, title, description, and VideoThumbnail.
 */
export function ExperienceSection() {
	// State to track if the button should be in the DOM (for accessibility)
	const [isButtonHidden, setIsButtonHidden] = useState(false)
	// State for the slow fade-out animation
	const [isFading, setIsFading] = useState(false)
	const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

	const setHopeMode = useAppStore((state) => state.setHopeMode)
	const isVideoThumbnailVisible = useAppStore((state) => state.isVideoThumbnailVisible)

	// locale購読で言語変更時の再レンダリングを保証
	useI18nStore((state) => state.locale)
	const t = useI18nStore((state) => state.t)

	const handleHopeClick = useCallback(() => {
		if (isFading) return

		setIsFading(true)

		// Clear any existing timeout
		if (fadeTimeoutRef.current) {
			clearTimeout(fadeTimeoutRef.current)
		}

		fadeTimeoutRef.current = setTimeout(() => {
			setHopeMode(true)
			setIsButtonHidden(true)
		}, 500) // CSS transition: opacity 0.5s ease-out
	}, [setHopeMode, isFading])

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (fadeTimeoutRef.current) {
				clearTimeout(fadeTimeoutRef.current)
			}
		}
	}, [])

	return (
		<section className="experience-section" id="experience">
			<div className="story-content" data-story="experience">
				<span className="story-number">{t("experience.number")}</span>
				<h2 className="story-title">{t("experience.title")}</h2>
				<p className="story-description">
					{t("experience.quote")}
					<br />- {t("experience.author")}
				</p>
				<div className="experience-cta">
					{!isButtonHidden && (
						<button
							type="button"
							className={`experience-btn ${isFading ? "fading" : ""}`}
							id="hope-btn"
							onClick={handleHopeClick}
							aria-label={t("experience.cta")}
							disabled={isFading}
						>
							{t("experience.cta")}
						</button>
					)}
				</div>
				{isVideoThumbnailVisible && <VideoThumbnail />}
			</div>
		</section>
	)
}
