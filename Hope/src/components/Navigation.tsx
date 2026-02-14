import { useState } from "react"
import { useI18nStore } from "../store"
import { LanguageToggle } from "./LanguageToggle"

/**
 * Render the site's top navigation bar containing a logo and primary section links.
 *
 * @returns A JSX element: a <nav> with a logo anchor and links to `#story`, `#experience`, and `#about`.
 */
export function Navigation() {
	// Subscribe to both locale and t to ensure re-render on language change
	const locale = useI18nStore((state) => state.locale)
	const t = useI18nStore((state) => state.t)

	// Force re-evaluation when locale changes
	void locale

	// Mobile menu state
	const [isOpen, setIsOpen] = useState(false)

	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}

	const closeMenu = () => {
		setIsOpen(false)
	}

	return (
		<>
			<a href="#hero" className="skip-link">
				{t("nav.skipLink")}
			</a>
			<nav className={`nav ${isOpen ? "nav-open" : ""}`} id="nav">
				{/* biome-ignore lint/a11y/useValidAnchor: Navigation links for single page scroll */}
				<a href="#hero" className="nav-logo" onClick={closeMenu}>
					<span className="nav-logo-icon">✧</span>
					<span>HOPE</span>
				</a>

				<button
					className="nav-toggle"
					onClick={toggleMenu}
					type="button"
					aria-label="Toggle navigation"
					aria-expanded={isOpen}
				>
					<span className="nav-toggle-bar"></span>
					<span className="nav-toggle-bar"></span>
					<span className="nav-toggle-bar"></span>
				</button>

				<div className={`nav-menu ${isOpen ? "active" : ""}`}>
					<ul className="nav-links">
						<li>
							{/* biome-ignore lint/a11y/useValidAnchor: Navigation links for single page scroll */}
							<a href="#hope" className="nav-link" onClick={closeMenu}>
								{t("nav.hope")}
							</a>
						</li>
						<li>
							{/* biome-ignore lint/a11y/useValidAnchor: Navigation links for single page scroll */}
							<a href="#experience" className="nav-link" onClick={closeMenu}>
								{t("nav.shortFilm")}
							</a>
						</li>
						<li>
							{/* biome-ignore lint/a11y/useValidAnchor: Navigation links for single page scroll */}
							<a href="#light" className="nav-link" onClick={closeMenu}>
								{t("nav.light")}
							</a>
						</li>
						<li>
							<LanguageToggle />
						</li>
					</ul>
				</div>
			</nav>
		</>
	)
}
