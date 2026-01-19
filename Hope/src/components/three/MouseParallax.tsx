import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"

/**
 * Creates a subtle camera parallax effect driven by the user's mouse position.
 *
 * Listens for pointer movement, normalizes the cursor to a centered [-2, 2] range, and updates the Three.js camera position each frame to produce a horizontal and vertical parallax.
 *
 * @returns A React node that renders nothing (`null`).
 */
export function MouseParallax() {
	const { camera } = useThree()
	const mouseRef = useRef({ x: 0, y: 0 })

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
			mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
		}

		window.addEventListener("mousemove", handleMouseMove)
		return () => window.removeEventListener("mousemove", handleMouseMove)
	}, [])

	useFrame(() => {
		camera.position.x = mouseRef.current.x * 0.5
		camera.position.y = 3 - mouseRef.current.y * 0.3
	})

	return null
}