import { useCallback, useEffect, useState } from "react"
import { useAppStore, useI18nStore } from "../store"
import { YOUTUBE_VIDEO_ID } from "../utils/youtube"

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
	// Local state for fade animation
	const [isVisible, setIsVisible] = useState(false)

	// Subscribe to both locale and t to ensure re-render on language change
	const locale = useI18nStore(state => state.locale)
	const t = useI18nStore(state => state.t)

	// Force re-evaluation when locale changes
	void locale

	useEffect(() => {
		if (isVideoOverlayVisible) {
			// Small delay to ensure render before adding visible class for transition
			requestAnimationFrame(() => {
				setIsVisible(true)
			})
		} else {
			setIsVisible(false)
		}
	}, [isVideoOverlayVisible])

	const handleClose = useCallback(() => {
		// Start fade out
		setIsVisible(false)

		// Exit fullscreen
		if (document.fullscreenElement) {
			document.exitFullscreen().catch(err => {
				console.error(
					`Error attempting to exit full-screen mode: ${err.message} (${err.name})`
				)
			})
		}

		// Wait for transition to finish before hiding/unmounting
		setTimeout(() => {
			hideVideoOverlay()
			showVideoThumbnail()
		}, 500) // Matches CSS transition duration
	}, [hideVideoOverlay, showVideoThumbnail])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isVideoOverlayVisible) {
				handleClose()
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [isVideoOverlayVisible, handleClose])

	if (!isVideoOverlayVisible) {
		return null
	}

	return (
		<div
			className={`video-overlay ${isVisible ? "visible" : ""}`}
			id="video-overlay"
		>
			<div className="video-fullscreen-wrapper">
				<iframe
					id="youtube-player"
					src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
					title="Hope Video"
					frameBorder="0"
					allow="autoplay; encrypted-media"
					allowFullScreen
				/>
			</div>
			<button
				type="button"
				className="video-close-btn"
				id="video-close"
				aria-label={t("video.close")}
				onClick={handleClose}
			>
				<span>✕</span>
			</button>
		</div>
	)
}
