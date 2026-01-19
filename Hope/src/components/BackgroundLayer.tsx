export function BackgroundLayer() {
	return (
		<div className="background-layer">
			<img
				src="/images/Hope_threejs.jpg"
				alt="Serene lake with wooden pier and dramatic sky"
				className="background-image"
				id="bg-image"
			/>
			<div className="background-overlay"></div>
			<div className="background-image-mask"></div>
		</div>
	)
}
