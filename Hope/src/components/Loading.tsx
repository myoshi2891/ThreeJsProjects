import { useAppStore } from "../store/appStore"

export function Loading() {
	const loadingProgress = useAppStore(state => state.loadingProgress)

	return (
		<div id="loading">
			<div
				className="loading-spinner"
				data-testid="loading-spinner"
			></div>
			<p className="loading-text">Loading Experience</p>
			<div className="loading-progress">
				<div
					className="loading-progress-bar"
					id="progress-bar"
					data-testid="progress-bar"
					style={{ width: `${loadingProgress}%` }}
				></div>
			</div>
		</div>
	)
}
