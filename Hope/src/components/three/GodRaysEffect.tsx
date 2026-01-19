import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useSceneStore } from "../../store/sceneStore"

const RAY_COUNT = 8

/**
 * Renders an animated god-rays light effect composed of multiple additive-blended ray quads.
 *
 * The effect animates over time and modulates ray opacity with the scene's `hopeFactor` state.
 *
 * @returns A React element containing the mesh that draws the god-ray quads with a custom shader.
 */
export function GodRaysEffect() {
	const hopeFactor = useSceneStore(state => state.hopeFactor)

	const { geometry, material } = useMemo(() => {
		const geo = new THREE.BufferGeometry()
		const positions: number[] = []
		const uvs: number[] = []
		const indices: number[] = []

		for (let i = 0; i < RAY_COUNT; i++) {
			const angle = (i / RAY_COUNT) * Math.PI * 0.5 - Math.PI * 0.25
			const width = 2 + Math.random() * 3
			const length = 30 + Math.random() * 20

			const x1 = Math.sin(angle) * width * -0.5
			const x2 = Math.sin(angle) * width * 0.5
			const z1 = Math.cos(angle) * width * -0.5
			const z2 = Math.cos(angle) * width * 0.5

			const baseIndex = i * 4

			positions.push(x1, 0, z1)
			positions.push(x2, 0, z2)
			positions.push(
				x1 + Math.sin(angle) * 5,
				-length,
				z1 + Math.cos(angle) * 5
			)
			positions.push(
				x2 + Math.sin(angle) * 5,
				-length,
				z2 + Math.cos(angle) * 5
			)

			uvs.push(0, 0)
			uvs.push(1, 0)
			uvs.push(0, 1)
			uvs.push(1, 1)

			indices.push(baseIndex, baseIndex + 1, baseIndex + 2)
			indices.push(baseIndex + 1, baseIndex + 3, baseIndex + 2)
		}

		geo.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(positions, 3)
		)
		geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
		geo.setIndex(indices)

		const mat = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uHopeFactor: { value: 0 },
				uColor: { value: new THREE.Color(0xf5d98a) },
			},
			vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
			fragmentShader: `
        uniform float uHopeFactor;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          float rayOpacity = 1.0 - vUv.y;
          rayOpacity = pow(rayOpacity, 1.5);

          float centerFade = 1.0 - abs(vUv.x - 0.5) * 2.0;
          centerFade = pow(centerFade, 0.5);

          float alpha = rayOpacity * centerFade;
          alpha *= uHopeFactor * 0.6;

          vec3 finalColor = mix(uColor, vec3(1.0, 0.95, 0.85), vUv.y * 0.3);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
			transparent: true,
			blending: THREE.AdditiveBlending,
			side: THREE.FrontSide,
			depthWrite: false,
		})

		return { geometry: geo, material: mat }
	}, [])

	useFrame(({ clock }) => {
		material.uniforms.uTime.value = clock.getElapsedTime()
		material.uniforms.uHopeFactor.value = hopeFactor
	})

	return (
		<mesh
			geometry={geometry}
			material={material}
			position={[5, 15, -20]}
			rotation={[Math.PI * 0.1, 0, 0]}
		/>
	)
}