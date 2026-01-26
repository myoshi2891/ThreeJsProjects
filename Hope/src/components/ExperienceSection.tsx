import { useState } from "react"
import { useAppStore } from "../store"
import { VideoThumbnail } from "./VideoThumbnail"

const experienceContent = {
	number: "04",
	title: "Short Film",
	description: (
		<>
			"Hope is being able to see that there is light despite all of the darkness."
			<br />- Desmond Tutu (South African Archbishop)
		</>
	),
}

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

	const handleHopeClick = () => {
		setIsButtonHidden(true)
		setHopeMode(true)
		// Note: Hope animation and video display will be triggered by the parent App component
	}

	return (
		<section className="experience-section" id="experience">
			<div className="story-content" data-story="experience">
				<span className="story-number">{experienceContent.number}</span>
				<h2 className="story-title">{experienceContent.title}</h2>
				<p className="story-description">{experienceContent.description}</p>
				<div className="story-thumbnail">
					<button
						type="button"
						className={`experience-btn ${isButtonHidden ? "hidden" : ""}`}
						id="hope-btn"
						onClick={handleHopeClick}
						aria-label="Watch the short film - start hope experience"
					>
						Watch the Short Film
					</button>

					{isVideoThumbnailVisible && <VideoThumbnail />}
				</div>
			</div>
		</section>
	)
}
