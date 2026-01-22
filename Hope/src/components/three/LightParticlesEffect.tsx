import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useSceneStore } from "../../store/sceneStore"

const PARTICLE_COUNT = 80

/**
 * Render an animated field of glowing particles whose brightness is modulated by the scene's `hopeFactor`.
 *
 * The component creates a buffer geometry with per-particle position, scale, and random attributes, and a custom
 * ShaderMaterial that animates particle positions over time and renders soft glowing point sprites. The material
 * exposes uniforms for time, hope factor, particle size, pixel ratio, and base color which are driven each frame.
 *
 * @returns A React <points> element containing the configured THREE.BufferGeometry and THREE.ShaderMaterial
 */
export function LightParticlesEffect() {
	const pointsRef = useRef<THREE.Points>(null)
	const hopeFactor = useSceneStore((state) => state.hopeFactor)

	const { geometry, material } = useMemo(() => {
		const geo = new THREE.BufferGeometry()
		const positions = new Float32Array(PARTICLE_COUNT * 3)
		const scales = new Float32Array(PARTICLE_COUNT)
		const randoms = new Float32Array(PARTICLE_COUNT)

		for (let i = 0; i < PARTICLE_COUNT; i++) {
			const i3 = i * 3

			const radius = Math.random() * 30
			const theta = Math.random() * Math.PI * 2
			const phi = Math.random() * Math.PI * 0.5

			positions[i3] = Math.sin(theta) * Math.cos(phi) * radius
			positions[i3 + 1] = Math.random() * 15 - 5
			positions[i3 + 2] = Math.cos(theta) * Math.cos(phi) * radius - 10

			scales[i] = Math.random() * 0.3 + 0.1
			randoms[i] = Math.random() * Math.PI * 2
		}

		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
		geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1))
		geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1))

		const mat = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uHopeFactor: { value: 0 },
				uSize: { value: 25 },
				uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
				uColor: { value: new THREE.Color(0xf5d98a) },
			},
			vertexShader: `
        uniform float uTime;
        uniform float uHopeFactor;
        uniform float uSize;
        uniform float uPixelRatio;
        
        attribute float aScale;
        attribute float aRandom;
        
        varying float vAlpha;

        void main() {
          vec3 pos = position;
          
          float floatSpeed = 0.5 + aRandom * 0.3;
          pos.y += sin(uTime * floatSpeed + aRandom * 10.0) * 2.0;
          pos.x += sin(uTime * 0.3 + aRandom * 5.0) * 1.5;
          pos.z += cos(uTime * 0.25 + aRandom * 7.0) * 1.0;
          
          vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectedPosition;
          gl_PointSize = uSize * aScale * uPixelRatio;
          gl_PointSize *= (1.0 / -viewPosition.z);
          
          vAlpha = uHopeFactor * 0.8;
        }
      `,
			fragmentShader: `
        uniform vec3 uColor;
        
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 2.0);
          
          float core = 1.0 - smoothstep(0.0, 0.15, dist);
          float alpha = (glow * 0.5 + core * 0.5) * vAlpha;
          
          vec3 color = uColor;
          color = mix(color, vec3(1.0, 1.0, 0.9), core * 0.5);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		})

		return { geometry: geo, material: mat }
	}, [])

	useFrame(({ clock }) => {
		material.uniforms.uTime.value = clock.getElapsedTime()
		material.uniforms.uHopeFactor.value = hopeFactor
	})

	return <points ref={pointsRef} geometry={geometry} material={material} />
}
