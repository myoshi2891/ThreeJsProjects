import { useI18nStore } from "../store"

/**
 * Renders the page hero section containing a badge, title, subtitle, call-to-action button, and scroll indicator.
 *
 * The call-to-action button with id "start-btn" scrolls the element with id "experience" into view using smooth scrolling when clicked.
 *
 * @returns The hero section as a JSX element.
 */
export function Hero() {
	// Subscribe to both locale and t to ensure re-render on language change
	const locale = useI18nStore((state) => state.locale)
	const t = useI18nStore((state) => state.t)

	// Force re-evaluation when locale changes
	void locale

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
					<span>{t("hero.badge")}</span>
				</div>
				<h1 className="hero-title">{t("hero.title")}</h1>
				<p className="hero-subtitle">
					{t("hero.subtitle1")}
					<br />
					{t("hero.subtitle2")}
				</p>
				<button
					type="button"
					className="hero-cta"
					id="start-btn"
					onClick={handleStartClick}
					aria-label={t("hero.cta")}
				>
					<span>{t("hero.cta")}</span>
					<span className="hero-cta-icon">→</span>
				</button>
			</div>

			<div className="scroll-indicator">
				<span className="scroll-indicator-text">{t("hero.scroll")}</span>
				<div className="scroll-indicator-icon" />
			</div>
		</section>
	)
}
