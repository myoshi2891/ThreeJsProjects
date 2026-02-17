import { useCallback, useEffect, useRef } from "react"
import { useAppStore } from "../store"

interface Particle {
	x: number
	y: number
	vy: number
	opacity: number
	size: number
	life: number
}

const MAX_PARTICLES = 15
const THROTTLE_MS = 50

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
	const rafId = useRef<number>(0)
	const lastSpawn = useRef<number>(0)

	const isHopeMode = useAppStore((state) => state.isHopeMode)

	const canShow = useCallback(() => {
		if (typeof window === "undefined") return false
		const hasHover = window.matchMedia("(hover: hover)").matches
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		return hasHover && !prefersReducedMotion
	}, [])

	const spawnParticle = useCallback((x: number, y: number) => {
		if (particles.current.length >= MAX_PARTICLES) return

		particles.current.push({
			x,
			y,
			vy: -(0.5 + Math.random() * 1.0),
			opacity: 0.6 + Math.random() * 0.4,
			size: 2 + Math.random() * 3,
			life: 60 + Math.random() * 30,
		})
	}, [])

	useEffect(() => {
		if (!canShow()) return

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
			spawnParticle(x, y)
		}

		parent.addEventListener("mousemove", handleMouseMove)

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			const color = isHopeMode ? "13, 148, 136" : "244, 162, 97"

			particles.current = particles.current.filter((p) => {
				p.y += p.vy
				p.x += (Math.random() - 0.5) * 0.3
				p.life--
				p.opacity *= 0.98

				if (p.life <= 0 || p.opacity < 0.01) return false

				ctx.beginPath()
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
				ctx.fillStyle = `rgba(${color}, ${p.opacity})`
				ctx.shadowColor = `rgba(${color}, ${p.opacity * 0.5})`
				ctx.shadowBlur = p.size * 3
				ctx.fill()
				ctx.shadowBlur = 0

				return true
			})

			rafId.current = requestAnimationFrame(animate)
		}

		rafId.current = requestAnimationFrame(animate)

		return () => {
			parent.removeEventListener("mousemove", handleMouseMove)
			cancelAnimationFrame(rafId.current)
			observer.disconnect()
		}
	}, [canShow, isHopeMode, spawnParticle])

	if (!canShow()) return null

	return <canvas ref={canvasRef} className="hover-particles-canvas" />
}
