import { Canvas } from "@react-three/fiber"
import { FogEffect } from "./three/FogEffect"
import { GodRaysEffect } from "./three/GodRaysEffect"
import { LightParticlesEffect } from "./three/LightParticlesEffect"
import { MouseParallax } from "./three/MouseParallax"
import { RainEffect } from "./three/RainEffect"
import { SceneSetup } from "./three/SceneSetup"

/**
 * Renders a configured Three.js Canvas with scene setup and layered visual effects.
 *
 * @returns The JSX element containing a Canvas (camera and WebGL configured) wrapped in a div with id "canvas-container", including SceneSetup, MouseParallax, RainEffect, FogEffect, LightParticlesEffect, and GodRaysEffect.
 */
export function ThreeCanvas() {
	return (
		<div id="canvas-container">
			<Canvas
				camera={{ fov: 75, position: [0, 3, 10], near: 0.1, far: 1000 }}
				gl={{
					antialias: true,
					alpha: true,
					powerPreference: "high-performance",
				}}
				style={{ background: "transparent" }}
			>
				<SceneSetup />
				<MouseParallax />
				<RainEffect />
				<FogEffect />
				<LightParticlesEffect />
				<GodRaysEffect />
			</Canvas>
		</div>
	)
}
