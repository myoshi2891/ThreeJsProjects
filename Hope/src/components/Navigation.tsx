/**
 * Render the site's top navigation bar containing a logo and primary section links.
 *
 * @returns A JSX element: a <nav> with a logo anchor and links to `#story`, `#experience`, and `#about`.
 */
export function Navigation() {
	return (
		<nav className="nav" id="nav">
			<a href="#hero" className="nav-logo">
				<span className="nav-logo-icon">✧</span>
				<span>HOPE</span>
			</a>
			<ul className="nav-links">
				<li>
					<a href="#story" className="nav-link">
						ストーリー
					</a>
				</li>
				<li>
					<a href="#experience" className="nav-link">
						体験
					</a>
				</li>
				<li>
					<a href="#about" className="nav-link">
						About
					</a>
				</li>
			</ul>
		</nav>
	)
}
