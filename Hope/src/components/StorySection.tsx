interface StorySectionProps {
	type: "storm" | "change" | "hope" | "about"
}

const storyContent = {
	storm: {
		number: "01",
		title: "嵐",
		description: (
			<>
				暗い雲が空を覆い、激しい雨が水面を叩く。
				<br />
				不安と混乱の中、私たちは立ち尽くす。
				<br />
				しかし、嵐は永遠には続かない。
			</>
		),
	},
	change: {
		number: "02",
		title: "変化",
		description: (
			<>
				雨が弱まり、雲が切れ始める。
				<br />
				微かな光が、水平線の向こうに見える。
				<br />
				変化は、いつも静かに訪れる。
			</>
		),
	},
	hope: {
		number: "03",
		title: "希望",
		description: (
			<>
				雲間から差し込む光が、世界を照らす。
				<br />
				静かな水面に映る光は、新しい始まりの象徴。
				<br />
				希望は、いつもそこにある。
			</>
		),
	},
	about: {
		number: "∞",
		title: "About",
		description: (
			<>
				このインタラクティブ体験は、Three.jsを使用した
				<br />
				没入型3Dウェブアプリケーションです。
				<br />
				静寂と希望をテーマに、視覚的な物語を紡ぎます。
			</>
		),
	},
}

/**
 * Renders a story section (number, title, and description) for the given section type.
 *
 * @param type - The section variant to render: "storm", "change", "hope", or "about"
 * @returns A <section> element containing the configured number, title, and description for the specified type
 */
export function StorySection({ type }: StorySectionProps) {
	const content = storyContent[type]
	const sectionId =
		type === "storm" ? "story" : type === "about" ? "about" : undefined

	return (
		<section className="story-section" id={sectionId}>
			<div className="story-content" data-story={type}>
				<span className="story-number">{content.number}</span>
				<h2 className="story-title">{content.title}</h2>
				<p className="story-description">{content.description}</p>
			</div>
		</section>
	)
}