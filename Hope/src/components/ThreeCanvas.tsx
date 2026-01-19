import { Canvas } from "@react-three/fiber"
import { RainEffect } from "./three/RainEffect"
import { FogEffect } from "./three/FogEffect"
import { LightParticlesEffect } from "./three/LightParticlesEffect"
import { GodRaysEffect } from "./three/GodRaysEffect"
import { SceneSetup } from "./three/SceneSetup"
import { MouseParallax } from "./three/MouseParallax"

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
