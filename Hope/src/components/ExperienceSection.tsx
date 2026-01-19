import { useState } from "react"
import { useAppStore } from "../store/appStore"
import { VideoThumbnail } from "./VideoThumbnail"

export function ExperienceSection() {
	const [isButtonHidden, setIsButtonHidden] = useState(false)
	const setHopeMode = useAppStore(state => state.setHopeMode)
	const isVideoThumbnailVisible = useAppStore(
		state => state.isVideoThumbnailVisible
	)

	const handleHopeClick = () => {
		setIsButtonHidden(true)
		setHopeMode(true)
		// Note: Hope animation and video display will be triggered by the parent App component
	}

	return (
		<section className="experience-section" id="experience">
			<div className="experience-content">
				<button
					className={`experience-btn ${isButtonHidden ? "hidden" : ""}`}
					id="hope-btn"
					onClick={handleHopeClick}
				>
					希望を見つける
				</button>

				{isVideoThumbnailVisible && <VideoThumbnail />}
			</div>
		</section>
	)
}
