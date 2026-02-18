import { useCallback, useEffect, useRef } from "react"
import { useMediaCapability } from "../hooks/useMediaCapability"
import { useAppStore } from "../store"

interface Particle {
	x: number
	y: number
	vy: number
	opacity: number
	size: number
	life: number
}

const MAX_PARTICLES = 10
const THROTTLE_MS = 50

/** HoverParticles の表示条件: ホバー可能 + モーション制限なし */
const PARTICLES_MEDIA_QUERIES = [
	{ query: "(hover: hover)", mustMatch: true },
	{ query: "(prefers-reduced-motion: reduce)", mustMatch: false },
]

/**
 * 画像ホバー時に蛍のような発光パーティクルを表示するコンポーネント
 *
 * Canvas API で描画。マウス位置から小さな光の粒子が上方に漂い、
 * フェードアウトして消える。タッチデバイスや prefers-reduced-motion では非表示。
 * 親要素の mousemove イベントを useEffect で監視する。
 */
export function HoverParticles() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const particles = useRef<Particle[]>([])
	const rafId = useRef<number | null>(null)
	const lastSpawn = useRef<number>(0)

	const isHopeMode = useAppStore((state) => state.isHopeMode)
	// isHopeMode を ref で保持し、animate ループ内で最新値を参照
	// → useCallback の依存配列から除外でき、不要なエフェクト再実行を防止
	const isHopeModeRef = useRef(isHopeMode)
	useEffect(() => {
		isHopeModeRef.current = isHopeMode
	}, [isHopeMode])

	const canShow = useMediaCapability(PARTICLES_MEDIA_QUERIES)

	const startAnimationLoop = useCallback(
		(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
			if (rafId.current !== null) return // 既に実行中

			const animate = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height)

				const color = isHopeModeRef.current ? "13, 148, 136" : "244, 162, 97"

				particles.current = particles.current.filter((p) => {
					p.y += p.vy
					p.x += (Math.random() - 0.5) * 0.3
					p.life--
					p.opacity *= 0.98

					if (p.life <= 0 || p.opacity < 0.01) return false

					// radialGradient で発光表現（shadowBlurはiOS Safariで重いため不使用）
					const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
					gradient.addColorStop(0, `rgba(${color}, ${p.opacity})`)
					gradient.addColorStop(1, `rgba(${color}, 0)`)

					ctx.beginPath()
					ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
					ctx.fillStyle = gradient
					ctx.fill()

					return true
				})

				// パーティクルが空ならRAFを停止
				if (particles.current.length === 0) {
					rafId.current = null
					return
				}

				rafId.current = requestAnimationFrame(animate)
			}

			rafId.current = requestAnimationFrame(animate)
		},
		[],
	)

	const spawnParticle = useCallback(
		(x: number, y: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
			if (particles.current.length >= MAX_PARTICLES) return

			particles.current.push({
				x,
				y,
				vy: -(0.5 + Math.random() * 1.0),
				opacity: 0.6 + Math.random() * 0.4,
				size: 2 + Math.random() * 3,
				life: 60 + Math.random() * 30,
			})

			// RAFが停止していれば再開
			startAnimationLoop(ctx, canvas)
		},
		[startAnimationLoop],
	)

	useEffect(() => {
		if (!canShow) return

		const canvas = canvasRef.current
		if (!canvas) return

		const parent = canvas.parentElement
		if (!parent) return

		const ctx = canvas.getContext("2d")
		if (!ctx) return

		const resizeCanvas = () => {
			canvas.width = parent.clientWidth
			canvas.height = parent.clientHeight
		}
		resizeCanvas()

		const observer = new ResizeObserver(resizeCanvas)
		observer.observe(parent)

		// 親要素の mousemove をネイティブイベントで監視
		const handleMouseMove = (e: MouseEvent) => {
			const now = Date.now()
			if (now - lastSpawn.current < THROTTLE_MS) return
			lastSpawn.current = now

			const rect = parent.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top
			spawnParticle(x, y, ctx, canvas)
		}

		parent.addEventListener("mousemove", handleMouseMove)

		return () => {
			parent.removeEventListener("mousemove", handleMouseMove)
			if (rafId.current !== null) {
				cancelAnimationFrame(rafId.current)
				rafId.current = null
			}
			observer.disconnect()
		}
	}, [canShow, spawnParticle])

	if (!canShow) return null

	return <canvas ref={canvasRef} className="hover-particles-canvas" />
}
