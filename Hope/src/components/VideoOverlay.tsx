import { useEffect } from "react"
import { useAppStore } from "../store/appStore"

const YOUTUBE_VIDEO_ID = import.meta.env.VITE_YOUTUBE_VIDEO_ID || ""

/**
 * Renders a fullscreen YouTube video overlay controlled by application state.
 *
 * The overlay appears when the app state's video overlay flag is true, and can be closed with the close button or the Escape key; closing hides the overlay and, after a 500ms delay, shows the video thumbnail.
 *
 * @returns The overlay JSX element when visible, or `null` when not visible.
 */
export function VideoOverlay() {
	const isVideoOverlayVisible = useAppStore(
		state => state.isVideoOverlayVisible
	)
	const hideVideoOverlay = useAppStore(state => state.hideVideoOverlay)
	const showVideoThumbnail = useAppStore(state => state.showVideoThumbnail)

	const handleClose = () => {
		hideVideoOverlay()
		setTimeout(() => {
			showVideoThumbnail()
		}, 500)
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isVideoOverlayVisible) {
				handleClose()
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [isVideoOverlayVisible])

	if (!isVideoOverlayVisible) {
		return null
	}

	return (
		<div
			className={`video-overlay ${isVideoOverlayVisible ? "visible" : ""}`}
			id="video-overlay"
		>
			<div className="video-fullscreen-wrapper">
				<iframe
					id="youtube-player"
					src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
					title="Hope Video"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
				></iframe>
			</div>
			<button
				className="video-close-btn"
				id="video-close"
				aria-label="Close video"
				onClick={handleClose}
			>
				<span>✕</span>
			</button>
		</div>
	)
}