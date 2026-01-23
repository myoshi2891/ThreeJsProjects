import { useCallback, useEffect, useState } from "react"

interface ImageModalProps {
	isOpen: boolean
	imageSrc: string
	imageAlt: string
	onClose: () => void
}

/**
 * A fullscreen modal overlay for displaying images.
 * Closes on click outside the image, Escape key, or close button.
 */
export function ImageModal({ isOpen, imageSrc, imageAlt, onClose }: ImageModalProps) {
	const [isClosing, setIsClosing] = useState(false)

	const handleClose = useCallback(() => {
		setIsClosing(true)
		setTimeout(() => {
			setIsClosing(false)
			onClose()
		}, 400) // Match animation duration
	}, [onClose])

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") {
				handleClose()
			}
		},
		[handleClose],
	)

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("keydown", handleKeyDown)
			document.body.classList.add("no-scroll")
		}
		return () => {
			document.removeEventListener("keydown", handleKeyDown)
			document.body.classList.remove("no-scroll")
		}
	}, [isOpen, handleKeyDown])

	if (!isOpen) return null

	return (
		<dialog
			open
			className={`image-modal-overlay ${isClosing ? "closing" : ""}`}
			onClick={handleClose}
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					handleClose()
				}
			}}
			aria-modal="true"
			aria-label="Image viewer"
		>
			<button
				type="button"
				className="image-modal-close"
				onClick={handleClose}
				aria-label="Close modal"
			>
				✕
			</button>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: intentional event propagation stop */}
			<div
				className="image-modal-content"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<img
					src={imageSrc}
					alt={imageAlt}
					className={`image-modal-img ${isClosing ? "closing" : ""}`}
				/>
			</div>
		</dialog>
	)
}
