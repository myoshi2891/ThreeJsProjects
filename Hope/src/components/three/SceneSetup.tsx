import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { useSceneStore } from "../../store/sceneStore"

/**
 * Configures the WebGL renderer and a post-processing chain, then updates bloom and exposure each frame based on the scene's `hopeFactor`.
 *
 * This component sets tone mapping and clear color on the renderer, creates an EffectComposer with a RenderPass and UnrealBloomPass, keeps those references for dynamic updates, and disposes the composer on unmount. On every frame it lerps bloom strength/threshold and tone-mapping exposure according to `hopeFactor` and renders the composer.
 *
 * @returns `null` (the component does not render any JSX)
 */
export function SceneSetup() {
	const { gl, scene, camera, size } = useThree()
	const composerRef = useRef<EffectComposer | null>(null)
	const bloomPassRef = useRef<UnrealBloomPass | null>(null)
	const hopeFactor = useSceneStore((state) => state.hopeFactor)

	useEffect(() => {
		// Configure renderer
		gl.toneMapping = THREE.ACESFilmicToneMapping
		gl.toneMappingExposure = 1
		gl.setClearColor(0x000000, 0)

		// Setup post-processing
		const composer = new EffectComposer(gl)
		const renderPass = new RenderPass(scene, camera)
		composer.addPass(renderPass)

		const bloomPass = new UnrealBloomPass(
			new THREE.Vector2(size.width, size.height),
			0.2, // Initial strength
			0.4, // Radius
			0.3, // Threshold
		)
		composer.addPass(bloomPass)

		composerRef.current = composer
		bloomPassRef.current = bloomPass

		return () => {
			composer.dispose()
		}
	}, [gl, scene, camera, size])

	useEffect(() => {
		if (composerRef.current) {
			composerRef.current.setSize(size.width, size.height)
		}
	}, [size])

	useFrame(() => {
		if (bloomPassRef.current) {
			const bloomStrength = THREE.MathUtils.lerp(0.2, 1.5, hopeFactor)
			const bloomThreshold = THREE.MathUtils.lerp(0.3, 0.1, hopeFactor)
			bloomPassRef.current.strength = bloomStrength
			bloomPassRef.current.threshold = bloomThreshold
		}

		// Update tone mapping exposure
		const exposure = THREE.MathUtils.lerp(0.8, 1.5, hopeFactor)
		gl.toneMappingExposure = exposure

		if (composerRef.current) {
			composerRef.current.render()
		}
	}, 1) // Priority 1 to render after scene updates

	return null
}
