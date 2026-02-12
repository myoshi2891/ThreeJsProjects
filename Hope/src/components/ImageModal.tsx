import { isVisible } from "@testing-library/user-event/dist/cjs/utils/index.js"
import { useCallback, useEffect, useState } from "react"
import { useI18nStore } from "../store"

interface ImageModalProps {
	isOpen: boolean
	imageSrc: string | string[]
	imageAlt: string
	initialIndex?: number
	onClose: () => void
}

/**
 * 画像をフルスクリーンで表示するモーダルオーバーレイ
 * 画像の外側クリック、Escキー、閉じるボタンで閉じる
 * 画像配列が渡された場合、左右矢印で画像を切り替え可能
 */
export function ImageModal({
	isOpen,
	imageSrc,
	imageAlt,
	initialIndex = 0,
	onClose,
}: ImageModalProps) {
	// State for fade/scale animation
	const [isVisible, setIsVisible] = useState(false)
	// State for switching images
	const [isSwitching, setIsSwitching] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(initialIndex)
	const t = useI18nStore(state => state.t)

	// 配列かどうかを判定
	const images = Array.isArray(imageSrc) ? imageSrc : [imageSrc]
	const isMultiple = images.length > 1
	const currentImage = images[currentIndex]

	// initialIndexが変更されたらリセット
	useEffect(() => {
		setCurrentIndex(initialIndex)
	}, [initialIndex])

	// Trigger entry animation
	useEffect(() => {
		if (isOpen) {
			requestAnimationFrame(() => {
				setIsVisible(true)
			})
		} else {
			setIsVisible(false)
			setIsSwitching(false)
		}
	}, [isOpen])

	const handleClose = useCallback(() => {
		setIsVisible(false)
		setTimeout(() => {
			onClose()
		}, 500) // アニメーション時間に合わせる (CSS transition matches VideoOverlay)
	}, [onClose])

	const goNext = useCallback(() => {
		if (isSwitching) return
		setIsSwitching(true)
		setTimeout(() => {
			setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
			setIsSwitching(false)
		}, 300) // Wait for fade out
	}, [images.length, isSwitching])

	const goPrev = useCallback(() => {
		if (isSwitching) return
		setIsSwitching(true)
		setTimeout(() => {
			setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
			setIsSwitching(false)
		}, 300) // Wait for fade out
	}, [images.length, isSwitching])

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			switch (e.key) {
				case "Escape":
					handleClose()
					break
				case "ArrowLeft":
					if (isMultiple) {
						e.preventDefault()
						goPrev()
					}
					break
				case "ArrowRight":
					if (isMultiple) {
						e.preventDefault()
						goNext()
					}
					break
			}
		},
		[handleClose, goNext, goPrev, isMultiple]
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
			className={`image-modal-overlay ${isVisible ? "visible" : ""}`}
			onClick={handleClose}
			onKeyDown={e => {
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
				aria-label={t("imageModal.close")}
			>
				✕
			</button>

			{/* 前へボタン */}
			{isMultiple && (
				<button
					type="button"
					className="image-modal-nav image-modal-nav--prev"
					onClick={e => {
						e.stopPropagation()
						goPrev()
					}}
					aria-label={t("imageModal.previousImage")}
				>
					‹
				</button>
			)}

			{/* biome-ignore lint/a11y/noStaticElementInteractions: イベント伝播停止用のラッパー */}
			<div
				className="image-modal-content"
				onClick={e => e.stopPropagation()}
				onKeyDown={e => e.stopPropagation()}
				role="presentation"
			>
				<img
					src={currentImage}
					alt={`${imageAlt} ${currentIndex + 1}`}
					className={`image-modal-img ${isSwitching ? "switching" : ""}`}
				/>
			</div>

			{/* 次へボタン */}
			{isMultiple && (
				<button
					type="button"
					className="image-modal-nav image-modal-nav--next"
					onClick={e => {
						e.stopPropagation()
						goNext()
					}}
					aria-label={t("imageModal.nextImage")}
				>
					›
				</button>
			)}

			{/* カウンター */}
			{isMultiple && (
				<div className="image-modal-counter">
					{t("imageModal.counter")
						.replace("{current}", String(currentIndex + 1))
						.replace("{total}", String(images.length))}
				</div>
			)}
		</dialog>
	)
}
