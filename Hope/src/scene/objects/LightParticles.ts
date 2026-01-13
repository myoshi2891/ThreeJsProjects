import * as THREE from "three"

export class LightParticles {
	private readonly particles: THREE.Points
	private readonly geometry: THREE.BufferGeometry
	private readonly material: THREE.ShaderMaterial
	private readonly particleCount = 80 // Reduced from 200
	private readonly basePositions: Float32Array

	constructor() {
		this.basePositions = new Float32Array(this.particleCount * 3)
		this.geometry = this.createGeometry()
		this.material = this.createMaterial()
		this.particles = new THREE.Points(this.geometry, this.material)
	}

	private createGeometry(): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry()
		const positions = new Float32Array(this.particleCount * 3)
		const scales = new Float32Array(this.particleCount)
		const randoms = new Float32Array(this.particleCount)

		for (let i = 0; i < this.particleCount; i++) {
			const i3 = i * 3

			// Start positions - scattered in a cone from the light source
			const radius = Math.random() * 30
			const theta = Math.random() * Math.PI * 2
			const phi = Math.random() * Math.PI * 0.5

			positions[i3] = Math.sin(theta) * Math.cos(phi) * radius
			positions[i3 + 1] = Math.random() * 15 - 5
			positions[i3 + 2] = Math.cos(theta) * Math.cos(phi) * radius - 10

			// Store base positions for animation
			this.basePositions[i3] = positions[i3]
			this.basePositions[i3 + 1] = positions[i3 + 1]
			this.basePositions[i3 + 2] = positions[i3 + 2]

			// Scale - very small glowing particles
			scales[i] = Math.random() * 0.3 + 0.1

			// Random offset for animation
			randoms[i] = Math.random() * Math.PI * 2
		}

		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3)
		)
		geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1))
		geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1))

		return geometry
	}

	private createMaterial(): THREE.ShaderMaterial {
		return new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uHopeFactor: { value: 0 },
				uSize: { value: 25 }, // Reduced from 60
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
				varying float vRandom;

				void main() {
					vec3 pos = position;
					
					// Floating upward motion - like fireflies or magical particles
					float floatSpeed = 0.5 + aRandom * 0.3;
					pos.y += sin(uTime * floatSpeed + aRandom * 10.0) * 2.0;
					
					// Gentle horizontal sway
					pos.x += sin(uTime * 0.3 + aRandom * 5.0) * 1.5;
					pos.z += cos(uTime * 0.25 + aRandom * 7.0) * 1.0;
					
					vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
					vec4 viewPosition = viewMatrix * modelPosition;
					vec4 projectedPosition = projectionMatrix * viewPosition;
					
					gl_Position = projectedPosition;
					
					// Size with attenuation
					gl_PointSize = uSize * aScale * uPixelRatio;
					gl_PointSize *= (1.0 / -viewPosition.z);
					
					// Only visible when hope factor is high (no pulsing)
					vAlpha = uHopeFactor * 0.8;
					vRandom = aRandom;
				}
			`,
			fragmentShader: `
				uniform float uTime;
				uniform vec3 uColor;
				
				varying float vAlpha;
				varying float vRandom;

				void main() {
					// Create glowing circular particle
					float dist = length(gl_PointCoord - vec2(0.5));
					if (dist > 0.5) discard;
					
					// Soft glow effect
					float glow = 1.0 - smoothstep(0.0, 0.5, dist);
					glow = pow(glow, 2.0);
					
					// Core brightness
					float core = 1.0 - smoothstep(0.0, 0.15, dist);
					
					float alpha = (glow * 0.5 + core * 0.5) * vAlpha;
					
					// Golden color with slight variation
					vec3 color = uColor;
					color = mix(color, vec3(1.0, 1.0, 0.9), core * 0.5);
					
					gl_FragColor = vec4(color, alpha);
				}
			`,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		})
	}

	public update(time: number, hopeFactor: number): void {
		this.material.uniforms.uTime.value = time
		this.material.uniforms.uHopeFactor.value = hopeFactor
	}

	public getObject(): THREE.Points {
		return this.particles
	}
}
