/**
 * Renders a decorative background layer containing a full-width image, an overlay, and an image mask.
 *
 * @returns A JSX element containing the background image (`/images/Hope_threejs.jpg`), a `.background-overlay` element, and a `.background-image-mask` element
 */
export function BackgroundLayer() {
	return (
		<div className="background-layer">
			<img
				src="/images/Hope_threejs.jpg"
				alt="Serene lake with wooden pier and dramatic sky"
				className="background-image"
				id="bg-image"
			/>
			<div className="background-overlay" />
			<div className="background-image-mask" />
		</div>
	)
}
