import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useSceneStore } from "../../store/sceneStore"

const FOG_COUNT = 50

/**
 * Renders a drifting, particle-based fog effect using Three.js shaders that blends between stormy and hopeful visuals.
 *
 * The component creates a BufferGeometry and ShaderMaterial with per-particle attributes (position, scale, random seed),
 * updates particle positions each frame with lightweight velocities and wrapping, and drives visual blending via the scene's
 * `hopeFactor`.
 *
 * @returns A React element containing a THREE.Points mesh that displays the animated fog field.
 */
export function FogEffect() {
	const pointsRef = useRef<THREE.Points>(null)
	const hopeFactor = useSceneStore(state => state.hopeFactor)
	const velocities = useRef<Float32Array>(new Float32Array(FOG_COUNT * 3))

	const { geometry, material } = useMemo(() => {
		const geo = new THREE.BufferGeometry()
		const positions = new Float32Array(FOG_COUNT * 3)
		const scales = new Float32Array(FOG_COUNT)
		const randoms = new Float32Array(FOG_COUNT)

		for (let i = 0; i < FOG_COUNT; i++) {
			const i3 = i * 3

			// Position - spread far from camera
			positions[i3] = (Math.random() - 0.5) * 100
			positions[i3 + 1] = Math.random() * 10 - 5
			positions[i3 + 2] = -30 - Math.random() * 50

			// Velocity for drifting
			velocities.current[i3] = (Math.random() - 0.5) * 0.02
			velocities.current[i3 + 1] = (Math.random() - 0.5) * 0.01
			velocities.current[i3 + 2] = (Math.random() - 0.5) * 0.02

			scales[i] = Math.random() * 0.3 + 0.1
			randoms[i] = Math.random()
		}

		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
		geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1))
		geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1))

		const mat = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uHopeFactor: { value: 0 },
				uSize: { value: 15 },
				uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
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
          
          // Gentle floating motion
          pos.x += sin(uTime * 0.3 + aRandom * 10.0) * 0.5;
          pos.y += sin(uTime * 0.2 + aRandom * 8.0) * 0.3;
          pos.z += cos(uTime * 0.25 + aRandom * 6.0) * 0.4;
          
          vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectedPosition;
          gl_PointSize = uSize * aScale * uPixelRatio;
          gl_PointSize *= (1.0 / -viewPosition.z);
          
          float stormAlpha = 0.08;
          float hopeAlpha = 0.02;
          vAlpha = mix(stormAlpha, hopeAlpha, uHopeFactor);
        }
      `,
			fragmentShader: `
        uniform float uHopeFactor;
        
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= vAlpha;
          
          vec3 stormColor = vec3(0.5, 0.55, 0.6);
          vec3 hopeColor = vec3(0.8, 0.75, 0.7);
          vec3 color = mix(stormColor, hopeColor, uHopeFactor);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
			transparent: true,
			depthWrite: false,
			blending: THREE.NormalBlending,
		})

		return { geometry: geo, material: mat }
	}, [])

	useFrame(({ clock }) => {
		if (!pointsRef.current) return

		const time = clock.getElapsedTime()
		material.uniforms.uTime.value = time
		material.uniforms.uHopeFactor.value = hopeFactor

		const positions = pointsRef.current.geometry.attributes.position
			.array as Float32Array

		for (let i = 0; i < FOG_COUNT; i++) {
			const i3 = i * 3
			positions[i3] += velocities.current[i3]
			positions[i3 + 1] += velocities.current[i3 + 1]
			positions[i3 + 2] += velocities.current[i3 + 2]

			if (positions[i3] > 40) positions[i3] = -40
			if (positions[i3] < -40) positions[i3] = 40
			if (positions[i3 + 2] > 20) positions[i3 + 2] = -40
			if (positions[i3 + 2] < -40) positions[i3 + 2] = 20
		}

		pointsRef.current.geometry.attributes.position.needsUpdate = true
	})

	return <points ref={pointsRef} geometry={geometry} material={material} />
}