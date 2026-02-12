import { useEffect, useState } from "react"
import { useAppStore, useI18nStore } from "../store"
import { YOUTUBE_VIDEO_ID } from "../utils/youtube"

/**
 * Renders a YouTube video thumbnail that fades in on mount and provides an expand control.
 *
 * The component embeds the video specified by the `VITE_YOUTUBE_VIDEO_ID` environment variable,
 * applies a visible CSS state on mount, and exposes an expand button that fades the thumbnail out
 * then calls the app store actions to hide the thumbnail and show the video overlay.
 *
 * @returns The React element for the video thumbnail and expand control.
 */
export function VideoThumbnail() {
	const [isVisible, setIsVisible] = useState(false)
	const showVideoOverlay = useAppStore(state => state.showVideoOverlay)
	const hideVideoThumbnail = useAppStore(state => state.hideVideoThumbnail)

	// Subscribe to both locale and t to ensure re-render on language change
	const locale = useI18nStore(state => state.locale)
	const t = useI18nStore(state => state.t)

	// Force re-evaluation when locale changes
	void locale

	// Trigger fade-in animation after mount
	useEffect(() => {
		requestAnimationFrame(() => {
			setIsVisible(true)
		})
	}, [])

	const handleExpand = () => {
		// Request fullscreen for the document
		document.documentElement.requestFullscreen().catch(err => {
			console.error(
				`Error attempting to enable full-screen mode: ${err.message} (${err.name})`
			)
		})

		setIsVisible(false)
		setTimeout(() => {
			hideVideoThumbnail()
			showVideoOverlay()
		}, 500)
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
					allow="autoplay; encrypted-media"
					allowFullScreen
				/>
				<button
					type="button"
					className="video-expand-btn"
					id="video-expand"
					aria-label={t("video.expand")}
					onClick={handleExpand}
				>
					<span>⛶</span>
				</button>
			</div>
		</div>
	)
}
