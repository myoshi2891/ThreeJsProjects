import { useState } from "react"
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
	const [isButtonHidden, setIsButtonHidden] = useState(false)
	const setHopeMode = useAppStore((state) => state.setHopeMode)
	const isVideoThumbnailVisible = useAppStore((state) => state.isVideoThumbnailVisible)

	// Subscribe to both locale and t to ensure re-render on language change
	const locale = useI18nStore((state) => state.locale)
	const t = useI18nStore((state) => state.t)

	// Force re-evaluation when locale changes
	void locale

	const handleHopeClick = () => {
		setIsButtonHidden(true)
		setHopeMode(true)
		// Note: Hope animation and video display will be triggered by the parent App component
	}

	return (
		<section className="experience-section" id="experience">
			<div className="story-content" data-story="experience">
				<span className="story-number">{t("experience.number")}</span>
				<h2 className="story-title">{t("experience.title")}</h2>
				<p className="story-description">
					{t("experience.quote")}
					<br />- {t("experience.author")}
				</p>
				<div className="story-thumbnail">
					<button
						type="button"
						className={`experience-btn ${isButtonHidden ? "hidden" : ""}`}
						id="hope-btn"
						onClick={handleHopeClick}
						aria-label={t("experience.ctaLabel")}
					>
						{t("experience.cta")}
					</button>

					{isVideoThumbnailVisible && <VideoThumbnail />}
				</div>
			</div>
		</section>
	)
}
