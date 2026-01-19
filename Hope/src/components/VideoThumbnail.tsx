import { useEffect, useState } from "react"
import { useAppStore } from "../store/appStore"

const YOUTUBE_VIDEO_ID = import.meta.env.VITE_YOUTUBE_VIDEO_ID || ""

export function VideoThumbnail() {
	const [isVisible, setIsVisible] = useState(false)
	const showVideoOverlay = useAppStore(state => state.showVideoOverlay)
	const hideVideoThumbnail = useAppStore(state => state.hideVideoThumbnail)

	// Trigger fade-in animation after mount
	useEffect(() => {
		requestAnimationFrame(() => {
			setIsVisible(true)
		})
	}, [])

	const handleExpand = () => {
		setIsVisible(false)
		setTimeout(() => {
			hideVideoThumbnail()
			showVideoOverlay()
		}, 300)
	}

	return (
		<div
			className={`video-thumbnail ${isVisible ? "visible" : ""}`}
			id="video-thumbnail"
		>
			<div className="video-thumbnail-wrapper">
				<iframe
					id="youtube-thumbnail-player"
					src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
					title="Hope Video"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
				></iframe>
				<button
					className="video-expand-btn"
					id="video-expand"
					aria-label="Expand to fullscreen"
					onClick={handleExpand}
				>
					<span>⛶</span>
				</button>
			</div>
		</div>
	)
}
