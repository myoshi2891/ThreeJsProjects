import * as THREE from "three"

export class GodRays {
	private readonly mesh: THREE.Mesh
	private readonly material: THREE.ShaderMaterial
	private readonly rayCount = 8

	constructor() {
		const geometry = this.createGeometry()
		this.material = this.createMaterial()
		this.mesh = new THREE.Mesh(geometry, this.material)
		this.mesh.position.set(5, 15, -20)
		this.mesh.rotation.x = Math.PI * 0.1
	}

	private createGeometry(): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry()
		const positions: number[] = []
		const uvs: number[] = []
		const indices: number[] = []

		for (let i = 0; i < this.rayCount; i++) {
			const angle = (i / this.rayCount) * Math.PI * 0.5 - Math.PI * 0.25
			const width = 2 + Math.random() * 3
			const length = 30 + Math.random() * 20

			const x1 = Math.sin(angle) * width * -0.5
			const x2 = Math.sin(angle) * width * 0.5
			const z1 = Math.cos(angle) * width * -0.5
			const z2 = Math.cos(angle) * width * 0.5

			const baseIndex = i * 4

			// Top vertices (near light source)
			positions.push(x1, 0, z1)
			positions.push(x2, 0, z2)
			// Bottom vertices (extending down)
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

		geometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(positions, 3)
		)
		geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
		geometry.setIndex(indices)

		return geometry
	}

	private createMaterial(): THREE.ShaderMaterial {
		return new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uHopeFactor: { value: 0 },
				uColor: { value: new THREE.Color(0xf5d98a) },
			},
			vertexShader: `
				varying vec2 vUv;
				varying float vDistance;

				void main() {
					vUv = uv;
					vec4 worldPos = modelMatrix * vec4(position, 1.0);
					vDistance = length(worldPos.xyz);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform float uTime;
				uniform float uHopeFactor;
				uniform vec3 uColor;
				varying vec2 vUv;
				varying float vDistance;

				void main() {
					// Base ray opacity - stronger near source, fading with distance
					float rayOpacity = 1.0 - vUv.y;
					rayOpacity = pow(rayOpacity, 1.5);

					// Center fade - softer edges
					float centerFade = 1.0 - abs(vUv.x - 0.5) * 2.0;
					centerFade = pow(centerFade, 0.5);

					// Combine fades
					float alpha = rayOpacity * centerFade;

					// Animated shimmer effect
					float shimmer = sin(vUv.y * 20.0 - uTime * 2.0) * 0.1 + 0.9;
					alpha *= shimmer;

					// Apply hope factor - rays only visible when hope increases
					alpha *= uHopeFactor * 0.6;

					// Color with warm golden tone
					vec3 finalColor = uColor;
					
					// Add slight color variation along the ray
					finalColor = mix(finalColor, vec3(1.0, 0.95, 0.85), vUv.y * 0.3);

					gl_FragColor = vec4(finalColor, alpha);
				}
			`,
			transparent: true,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide,
			depthWrite: false,
		})
	}

	public update(time: number, hopeFactor: number): void {
		this.material.uniforms.uTime.value = time
		this.material.uniforms.uHopeFactor.value = hopeFactor

		// Subtle rotation animation
		this.mesh.rotation.y = Math.sin(time * 0.1) * 0.05
	}

	public getObject(): THREE.Mesh {
		return this.mesh
	}
}
