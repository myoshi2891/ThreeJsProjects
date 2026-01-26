/**
 * Renders the page hero section containing a badge, title, subtitle, call-to-action button, and scroll indicator.
 *
 * The call-to-action button with id "start-btn" scrolls the element with id "experience" into view using smooth scrolling when clicked.
 *
 * @returns The hero section as a JSX element.
 */
export function Hero() {
	const handleStartClick = () => {
		const experienceSection = document.getElementById("experience")
		if (experienceSection) {
			experienceSection.scrollIntoView({ behavior: "smooth" })
		}
	}

	return (
		<section className="hero" id="hero" tabIndex={-1}>
			<div className="hero-content">
				<div className="hero-badge">
					<span className="hero-badge-icon">✦</span>
					<span>Design the Future</span>
				</div>
				<h1 className="hero-title">Hope Lights the Way</h1>
				<p className="hero-subtitle">
					Even in the darkest night, a single spark can guide us to a better tomorrow.
					<br />
					After the rain comes the sun. Find your strength to rise again.
				</p>
				<button
					type="button"
					className="hero-cta"
					id="start-btn"
					onClick={handleStartClick}
					aria-label="Learn more - scroll to experience section"
				>
					<span>Learn More</span>
					<span className="hero-cta-icon">→</span>
				</button>
			</div>

			<div className="scroll-indicator">
				<span className="scroll-indicator-text">Scroll to Explore</span>
				<div className="scroll-indicator-icon" />
			</div>
		</section>
	)
}
