import { useSlider } from "../hooks"
import { useI18nStore } from "../store"

interface ImageSliderProps {
	images: string[]
	sectionName: string
	onImageClick?: (index: number) => void
}

/**
 * 複数の画像をスライド表示するコンポーネント
 *
 * @param images - 表示する画像パスの配列
 * @param sectionName - セクション名（アクセシビリティ用）
 * @param onImageClick - 画像クリック時のコールバック
 */
export function ImageSlider({ images, sectionName, onImageClick }: ImageSliderProps) {
	const t = useI18nStore((state) => state.t)

	const { currentIndex, goToSlide, goNext, goPrev, containerRef, pause, resume } = useSlider({
		totalSlides: images.length,
		autoPlay: true,
		autoPlayInterval: 5000,
	})

	const handleImageClick = (index: number) => {
		onImageClick?.(index)
	}

	const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault()
			handleImageClick(index)
		}
	}

	if (images.length === 0) return null

	return (
		// biome-ignore lint/a11y/useSemanticElements: WAI-ARIA Carousel pattern requires role="region"
		<div
			className="image-slider"
			onMouseEnter={pause}
			onMouseLeave={resume}
			onFocus={pause}
			onBlur={resume}
			role="region"
			aria-roledescription="carousel"
			aria-label={t("slider.ariaLabel").replace("{section}", sectionName)}
		>
			{/* スライダートラック */}
			<div
				ref={containerRef}
				className="image-slider-track"
				// biome-ignore lint/a11y/noNoninteractiveTabindex: キーボードナビゲーションに必要
				tabIndex={0}
				aria-live="polite"
			>
				{images.map((image, index) => (
					// biome-ignore lint/a11y/useSemanticElements: WAI-ARIA Carousel slide pattern
					<div
						key={image}
						className={["image-slider-slide", index === currentIndex && "active"]
							.filter(Boolean)
							.join(" ")}
						role="group"
						aria-roledescription="slide"
						aria-label={t("slider.slideLabel")
							.replace("{current}", String(index + 1))
							.replace("{total}", String(images.length))}
					>
						<button
							type="button"
							className="image-slider-btn"
							onClick={() => handleImageClick(index)}
							onKeyDown={(e) => handleKeyDown(e, index)}
							aria-label={t("slider.viewImage").replace("{number}", String(index + 1))}
						>
							<img
								src={image}
								alt={`${sectionName} ${index + 1}`}
								className="image-slider-image"
								loading={index === 0 ? "eager" : "lazy"}
							/>
						</button>
					</div>
				))}
			</div>

			{/* 矢印ナビゲーション */}
			{images.length > 1 && (
				<>
					<button
						type="button"
						className="image-slider-arrow image-slider-arrow--prev"
						onClick={goPrev}
						aria-label={t("slider.previous")}
					>
						‹
					</button>
					<button
						type="button"
						className="image-slider-arrow image-slider-arrow--next"
						onClick={goNext}
						aria-label={t("slider.next")}
					>
						›
					</button>
				</>
			)}

			{/* ドットインジケーター */}
			{images.length > 1 && (
				<div className="image-slider-dots" role="tablist" aria-label={t("slider.dotsLabel")}>
					{images.map((image, index) => (
						<button
							key={`dot-${image}`}
							type="button"
							className={`image-slider-dot ${index === currentIndex ? "active" : ""}`}
							onClick={() => goToSlide(index)}
							role="tab"
							aria-selected={index === currentIndex}
							aria-label={t("slider.goToSlide").replace("{number}", String(index + 1))}
						/>
					))}
				</div>
			)}
		</div>
	)
}
