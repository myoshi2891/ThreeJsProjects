import { useTranslation } from "../hooks"
import { useAppStore } from "../store"

/**
 * Renders a loading UI that reflects application loading progress.
 *
 * Displays a spinner, the static label "Loading Experience", and a progress bar whose width is driven by the app store's `loadingProgress` value (expressed as a percentage).
 *
 * @returns A JSX element containing the loading spinner, label, and progress bar.
 */
export function Loading() {
	const loadingProgress = useAppStore((state) => state.loadingProgress)

	const { t } = useTranslation()

	return (
		<div id="loading">
			<div className="loading-spinner" data-testid="loading-spinner" />
			<p className="loading-text">{t("loading.text")}</p>
			<div className="loading-progress">
				<div
					className="loading-progress-bar"
					id="progress-bar"
					data-testid="progress-bar"
					style={
						{
							"--progress-width": `${loadingProgress}%`,
						} as React.CSSProperties
					}
				/>
			</div>
		</div>
	)
}
