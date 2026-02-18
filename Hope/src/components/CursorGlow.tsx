import { useEffect, useRef } from "react"
import { useMediaCapability } from "../hooks/useMediaCapability"

const TRAIL_COUNT = 6
const LERP_SPEED = 0.15

/** メインカーソルドットの半径 (px) — transform translate のオフセットに使用 */
const MAIN_DOT_RADIUS = 6
/** トレイルドットの最大サイズ (px) — 先頭のドットサイズ */
const TRAIL_MAX_SIZE = 8
/** トレイルドットの1つごとのサイズ減衰 (px) — 後方ほど小さくなる */
const TRAIL_SIZE_DECAY = 0.8
/** トレイルドットの先頭の不透明度 */
const TRAIL_BASE_OPACITY = 0.4
/** トレイルドットの1つごとの不透明度減衰 */
const TRAIL_OPACITY_DECAY = 0.05

interface TrailDot {
	x: number
	y: number
}

/** CursorGlow の表示条件: ホバー可能 + ファインポインター + モーション制限なし */
const CURSOR_MEDIA_QUERIES = [
	{ query: "(hover: hover)", mustMatch: true },
	{ query: "(pointer: fine)", mustMatch: true },
	{ query: "(prefers-reduced-motion: reduce)", mustMatch: false },
]

/**
 * デスクトップ向けカスタムカーソル + グロートレイル
 *
 * マウス移動に追従するソフトな発光ドットと、lerp補間で遅延追従するトレイルを描画。
 * タッチデバイスや prefers-reduced-motion 時は自動的に非表示。
 */
export function CursorGlow() {
	const mainRef = useRef<HTMLDivElement>(null)
	const trailRefs = useRef<(HTMLDivElement | null)[]>([])
	const mousePos = useRef<TrailDot>({ x: -100, y: -100 })
	const trailPositions = useRef<TrailDot[]>(
		Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 })),
	)
	const rafId = useRef<number>(0)
	const isVisible = useRef(false)

	const showCursor = useMediaCapability(CURSOR_MEDIA_QUERIES)

	useEffect(() => {
		if (!showCursor) return

		isVisible.current = true
		document.body.classList.add("custom-cursor")

		const handleMouseMove = (e: MouseEvent) => {
			mousePos.current = { x: e.clientX, y: e.clientY }
		}

		const animate = () => {
			if (!isVisible.current) return

			// メインカーソルを即座に更新
			if (mainRef.current) {
				mainRef.current.style.transform = `translate(${mousePos.current.x - MAIN_DOT_RADIUS}px, ${mousePos.current.y - MAIN_DOT_RADIUS}px)`
			}

			// トレイルをlerp補間で追従
			for (let i = 0; i < TRAIL_COUNT; i++) {
				const target = i === 0 ? mousePos.current : trailPositions.current[i - 1]
				const current = trailPositions.current[i]
				const speed = LERP_SPEED * (1 - i * 0.08)

				current.x += (target.x - current.x) * speed
				current.y += (target.y - current.y) * speed

				const el = trailRefs.current[i]
				if (el) {
					const size = Math.max(3, TRAIL_MAX_SIZE - i * TRAIL_SIZE_DECAY)
					const opacity = Math.max(0.1, TRAIL_BASE_OPACITY - i * TRAIL_OPACITY_DECAY)
					el.style.transform = `translate(${current.x - size / 2}px, ${current.y - size / 2}px)`
					el.style.width = `${size}px`
					el.style.height = `${size}px`
					el.style.opacity = String(opacity)
				}
			}

			rafId.current = requestAnimationFrame(animate)
		}

		window.addEventListener("mousemove", handleMouseMove)
		rafId.current = requestAnimationFrame(animate)

		return () => {
			isVisible.current = false
			document.body.classList.remove("custom-cursor")
			window.removeEventListener("mousemove", handleMouseMove)
			cancelAnimationFrame(rafId.current)
		}
	}, [showCursor])

	// hopeFactor変化でCSS変数を更新してテーマ色を切り替え（CSSで制御）
	// → body.hope-mode の切り替えで自動対応するため追加処理不要

	if (!showCursor) return null

	return (
		<div className="cursor-glow-container" aria-hidden="true">
			<div ref={mainRef} className="cursor-glow-dot cursor-glow-main" />
			{Array.from({ length: TRAIL_COUNT }, (_, i) => (
				<div
					key={`trail-${
						// biome-ignore lint/suspicious/noArrayIndexKey: トレイルドットは固定数のため
						i
					}`}
					ref={(el) => {
						trailRefs.current[i] = el
					}}
					className="cursor-glow-dot cursor-glow-trail"
				/>
			))}
		</div>
	)
}
