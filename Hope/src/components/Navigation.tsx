export function Navigation() {
	return (
		<nav className="nav" id="nav">
			<a href="#" className="nav-logo">
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
