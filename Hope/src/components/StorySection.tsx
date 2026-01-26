import { useState } from "react"
import { useI18nStore } from "../store"
import { ImageModal } from "./ImageModal"

interface StorySectionProps {
	type: "hope" | "life" | "possibility" | "light"
}

const sectionIdMap: Record<string, string | undefined> = {
	hope: "hope",
	light: "light",
}

const imageMap = {
	hope: "/images/hope-pillar.webp",
	life: "/images/live-learn-forever.webp",
	possibility: "/images/never-too-late.webp",
	light: "/images/light-a-candle.webp",
}

/**
 * Renders a story section (number, title, and description) for the given section type.
 *
 * @param type - The section variant to render: "hope", "life", "possibility", or "light"
 * @returns A <section> element containing the configured number, title, and description for the specified type
 */
export function StorySection({ type }: StorySectionProps) {
	const [isModalOpen, setIsModalOpen] = useState(false)

	// Subscribe to both locale and t to ensure re-render on language change
	const locale = useI18nStore((state) => state.locale)
	const t = useI18nStore((state) => state.t)

	// Force re-evaluation when locale changes
	void locale

	const sectionId = sectionIdMap[type]
	const image = imageMap[type]

	const number = t(`story.${type}.number`)
	const title = t(`story.${type}.title`)

	// Build description based on type
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

	const handleImageClick = () => {
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
						<button
							type="button"
							className="story-thumbnail-btn"
							onClick={handleImageClick}
							aria-label={t("imageModal.viewImage").replace("{title}", title)}
						>
							<img src={image} alt={title} className="story-thumbnail-image" />
						</button>
					</div>
				</div>
			</section>
			<ImageModal
				isOpen={isModalOpen}
				imageSrc={image}
				imageAlt={title}
				onClose={handleCloseModal}
			/>
		</>
	)
}
