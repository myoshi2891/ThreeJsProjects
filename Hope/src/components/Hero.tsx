export function Hero() {
	const handleStartClick = () => {
		const experienceSection = document.getElementById("experience")
		if (experienceSection) {
			experienceSection.scrollIntoView({ behavior: "smooth" })
		}
	}

	return (
		<section className="hero" id="hero">
			<div className="hero-content">
				<div className="hero-badge">
					<span className="hero-badge-icon">✦</span>
					<span>Interactive 3D Experience</span>
				</div>
				<h1 className="hero-title">HOPE</h1>
				<p className="hero-subtitle">
					静寂の水面に、希望の光が宿る
					<br />
					嵐の先に待つ光を、体感してください
				</p>
				<button
					className="hero-cta"
					id="start-btn"
					onClick={handleStartClick}
				>
					<span>体験を始める</span>
					<span className="hero-cta-icon">→</span>
				</button>
			</div>

			<div className="scroll-indicator">
				<span className="scroll-indicator-text">Scroll to Explore</span>
				<div className="scroll-indicator-icon"></div>
			</div>
		</section>
	)
}
