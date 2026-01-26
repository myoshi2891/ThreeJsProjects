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

	return (
		<>
			<a href="#hero" className="skip-link">
				{t("nav.skipLink")}
			</a>
			<nav className="nav" id="nav">
				<a href="#hero" className="nav-logo">
					<span className="nav-logo-icon">✧</span>
					<span>HOPE</span>
				</a>
				<ul className="nav-links">
					<li>
						<a href="#hope" className="nav-link">
							{t("nav.hope")}
						</a>
					</li>
					<li>
						<a href="#experience" className="nav-link">
							{t("nav.shortFilm")}
						</a>
					</li>
					<li>
						<a href="#light" className="nav-link">
							{t("nav.light")}
						</a>
					</li>
					<li>
						<LanguageToggle />
					</li>
				</ul>
			</nav>
		</>
	)
}
