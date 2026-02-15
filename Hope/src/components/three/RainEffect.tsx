import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useSceneStore } from "../../store/sceneStore"
import { calculateRainCount } from "../../utils"

const RAIN_COUNT = calculateRainCount()

/**
 * Renders a Three.js Points-based rain particle system that fades as the scene's hope factor increases.
 *
 * The component creates a static buffer geometry of RAIN_COUNT particles with randomized positions,
 * animates their downward movement each frame (recycling particles that fall below a threshold),
 * and updates the geometry in-place. Opacity is linearly interpolated from 1 to 0 using the scene's `hopeFactor`.
 *
 * @returns A React element containing a <points> object with a <pointsMaterial> configured for the rain effect.
 */
export function RainEffect() {
	const pointsRef = useRef<THREE.Points>(null)
	const hopeFactor = useSceneStore((state) => state.hopeFactor)

	const geometry = useMemo(() => {
		const geo = new THREE.BufferGeometry()
		const positions = new Float32Array(RAIN_COUNT * 3)

		for (let i = 0; i < RAIN_COUNT * 3; i++) {
			positions[i] = (Math.random() - 0.5) * 60
		}

		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
		return geo
	}, [])

	const texture = useMemo(() => {
		const canvas = document.createElement("canvas")
		canvas.width = 32
		canvas.height = 32
		const ctx = canvas.getContext("2d")

		if (ctx) {
			// 円形のグラデーション（中心が明るく、外側に向かって透明に）
			const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
			gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
			gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)")
			gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

			ctx.fillStyle = gradient
			ctx.fillRect(0, 0, 32, 32)
		}

		return new THREE.CanvasTexture(canvas)
	}, [])

	// GPU メモリリーク防止: コンポーネントアンマウント時にテクスチャを破棄
	useEffect(() => {
		return () => {
			texture.dispose()
		}
	}, [texture])

	useFrame(() => {
		if (!pointsRef.current || hopeFactor >= 0.99) return

		const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

		for (let i = 1; i < RAIN_COUNT * 3; i += 3) {
			positions[i] -= 0.2 // Rain falling speed
			if (positions[i] < -10) {
				positions[i] = 20
			}
		}

		pointsRef.current.geometry.attributes.position.needsUpdate = true
	})

	const opacity = THREE.MathUtils.lerp(1, 0, hopeFactor)

	return (
		<points ref={pointsRef} geometry={geometry}>
			<pointsMaterial color={0xaaaaaa} size={0.05} transparent opacity={opacity} map={texture} />
		</points>
	)
}
