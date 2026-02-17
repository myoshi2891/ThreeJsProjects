import { useTranslation } from "../hooks"
import { useAppStore } from "../store"

/** 放射状に伸びる光線の角度（8方向） */
const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const RAY_LENGTH = 28
const CENTER = 40

/**
 * 放射状光線SVGアニメーションによるローディングUI
 *
 * 中央の光点から8方向に光線が伸びるシンボル。進捗に同期して stroke-dashoffset が変化し、
 * 光線が徐々に描画される。完了時にスケールアップ + フェードアウト。
 */
export function Loading() {
	const loadingProgress = useAppStore((state) => state.loadingProgress)

	const { t } = useTranslation()

	const progressFactor = loadingProgress / 100

	return (
		<div id="loading">
			<svg
				className="loading-rays"
				viewBox="0 0 80 80"
				data-testid="loading-rays"
				aria-hidden="true"
			>
				{/* 中央の光点 */}
				<circle className="loading-rays-center" cx={CENTER} cy={CENTER} r={3} />
				{/* 8方向の光線 */}
				{RAY_ANGLES.map((angle) => {
					const rad = (angle * Math.PI) / 180
					const x2 = CENTER + Math.cos(rad) * RAY_LENGTH
					const y2 = CENTER + Math.sin(rad) * RAY_LENGTH
					return (
						<line
							key={angle}
							className="loading-rays-line"
							x1={CENTER}
							y1={CENTER}
							x2={x2}
							y2={y2}
							style={
								{
									"--progress-factor": progressFactor,
								} as React.CSSProperties
							}
						/>
					)
				})}
			</svg>
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
