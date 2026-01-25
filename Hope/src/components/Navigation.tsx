/**
 * Render the site's top navigation bar containing a logo and primary section links.
 *
 * @returns A JSX element: a <nav> with a logo anchor and links to `#story`, `#experience`, and `#about`.
 */
export function Navigation() {
	return (
		<>
			<a href="#hero" className="skip-link">
				Skip to main content
			</a>
			<nav className="nav" id="nav">
				<a href="#hero" className="nav-logo">
					<span className="nav-logo-icon">✧</span>
					<span>HOPE</span>
				</a>
				<ul className="nav-links">
					<li>
						<a href="#hope" className="nav-link">
							Hope
						</a>
					</li>
					<li>
						<a href="#experience" className="nav-link">
							Short Film
						</a>
					</li>
					<li>
						<a href="#light" className="nav-link">
							Light
						</a>
					</li>
				</ul>
			</nav>
		</>
	)
}
