import { useState } from "react"
import { useI18nStore } from "../store"
import { ImageModal } from "./ImageModal"
import { ImageSlider } from "./ImageSlider"

interface StorySectionProps {
	type: "hope" | "life" | "possibility" | "light"
}

const sectionIdMap: Record<string, string | undefined> = {
	hope: "hope",
	light: "light",
}

// 各セクションの画像配列
const imageMap: Record<string, string[]> = {
	hope: [
		"/images/Hope/hope-pillar.webp",
		"/images/Hope/hope-02-tearful-bond.webp",
		"/images/Hope/hope-03-united-horizon.webp",
		"/images/Hope/hope-04-writing-wisdom.webp",
		"/images/Hope/hope-05-prayer-cell.webp",
		"/images/Hope/hope-06-sunflower-ruins.webp",
		"/images/Hope/hope-07-ocean-peace.webp",
	],
	life: [
		"/images/Life/live-learn-forever.webp",
		"/images/Life/life-02-standing-firm.webp",
		"/images/Life/life-03-family-joy.webp",
		"/images/Life/life-04-desert-journey.webp",
		"/images/Life/life-05-aurora-trek.webp",
		"/images/Life/life-06-prison-light.webp",
		"/images/Life/life-07-sharing-bread.webp",
	],
	possibility: [
		"/images/Possibility/never-too-late.webp",
		"/images/Possibility/possibility-02-first-steps.webp",
		"/images/Possibility/possibility-03-urban-vision.webp",
		"/images/Possibility/possibility-04-fairy-rain.webp",
		"/images/Possibility/possibility-05-begin-today.webp",
		"/images/Possibility/possibility-06-saxophone-dream.webp",
		"/images/Possibility/possibility-07-writing-hope.webp",
	],
	light: [
		"/images/Light/light-a-candle.webp",
		"/images/Light/light-02-inner-calm.webp",
		"/images/Light/light-03-joyful-wisdom.webp",
		"/images/Light/light-04-storm-rainbow.webp",
		"/images/Light/light-05-candle-smile.webp",
		"/images/Light/light-06-lamp-learning.webp",
	],
}

/**
 * ストーリーセクション（番号、タイトル、説明、画像スライダー）を描画
 *
 * @param type - 描画するセクションの種類: "hope", "life", "possibility", "light"
 * @returns 指定されたタイプの番号、タイトル、説明を含む<section>要素
 */
export function StorySection({ type }: StorySectionProps) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedImageIndex, setSelectedImageIndex] = useState(0)

	// 言語変更時に再レンダリングするため両方を購読
	const locale = useI18nStore((state) => state.locale)
	const t = useI18nStore((state) => state.t)

	// localeの変更で再評価を強制
	void locale

	const sectionId = sectionIdMap[type]
	const images = imageMap[type]

	const number = t(`story.${type}.number`)
	const title = t(`story.${type}.title`)

	// タイプに基づいて説明を構築
	const renderDescription = () => {
		if (type === "life") {
			return (
				<>
					{t(`story.${type}.quote1`)}
					<br />
					{t(`story.${type}.quote2`)}
					<br />- {t(`story.${type}.author`)}
				</>
			)
		}
		return (
			<>
				{t(`story.${type}.quote`)}
				<br />- {t(`story.${type}.author`)}
			</>
		)
	}

	const handleImageClick = (index: number) => {
		setSelectedImageIndex(index)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	return (
		<>
			<section className="story-section" id={sectionId}>
				<div className="story-content" data-story={type}>
					<span className="story-number">{number}</span>
					<h2 className="story-title">{title}</h2>
					<p className="story-description">{renderDescription()}</p>
					<div className="story-thumbnail">
						<ImageSlider images={images} sectionName={title} onImageClick={handleImageClick} />
					</div>
				</div>
			</section>
			<ImageModal
				isOpen={isModalOpen}
				imageSrc={images}
				imageAlt={title}
				initialIndex={selectedImageIndex}
				onClose={handleCloseModal}
			/>
		</>
	)
}
