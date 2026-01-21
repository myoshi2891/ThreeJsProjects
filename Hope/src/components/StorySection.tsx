import { useState } from "react"
import { ImageModal } from "./ImageModal"

interface StorySectionProps {
	type: "storm" | "change" | "hope" | "about"
}

const storyContent = {
	storm: {
		number: "01",
		title: "Hope",
		description: (
			<>
				"Hope is the pillar that holds up the world."
				<br />- Pliny the Elder (Roman Author)
			</>
		),
		image: "/images/Hope is the pillar that holds up the world.png",
	},
	change: {
		number: "02",
		title: "Life",
		description: (
			<>
				"Live as if you were to die tomorrow.
				<br />
				Learn as if you were to live forever."
				<br />- Mahatma Gandhi (Indian Lawyer & Ethicist)
			</>
		),
		image: "/images/Live as if you were to die tomorrow. Learn as if you were to live forever.png",
	},
	hope: {
		number: "03",
		title: "Possibility",
		description: (
			<>
				"It is never too late to be what you might have been."
				<br />- George Eliot (English Novelist)
			</>
		),
		image: "/images/It is never too late to be what you might have been.png",
	},
	about: {
		number: "∞",
		title: "Light",
		description: (
			<>
				"Better to light a candle than to curse the darkness."
				<br />- Chinese Proverb (Asian Wisdom)
			</>
		),
		image: "/images/Better to light a candle than to curse the darkness.png",
	},
}

/**
 * Renders a story section (number, title, and description) for the given section type.
 *
 * @param type - The section variant to render: "storm", "change", "hope", or "about"
 * @returns A <section> element containing the configured number, title, and description for the specified type
 */
export function StorySection({ type }: StorySectionProps) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const content = storyContent[type]
	const sectionId =
		type === "storm" ? "story" : type === "about" ? "about" : undefined

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
					<span className="story-number">{content.number}</span>
					<h2 className="story-title">{content.title}</h2>
					<p className="story-description">{content.description}</p>
					<div className="story-thumbnail">
						<img
							src={content.image}
							alt={content.title}
							className="story-thumbnail-image"
							onClick={handleImageClick}
							role="button"
							tabIndex={0}
							onKeyDown={e => {
								if (e.key === "Enter" || e.key === " ") {
									handleImageClick()
								}
							}}
						/>
					</div>
				</div>
			</section>
			<ImageModal
				isOpen={isModalOpen}
				imageSrc={content.image}
				imageAlt={content.title}
				onClose={handleCloseModal}
			/>
		</>
	)
}
