import * as THREE from "three"

export class Fog {
	private readonly particles: THREE.Points
	private readonly geometry: THREE.BufferGeometry
	private readonly material: THREE.ShaderMaterial
	private readonly particleCount = 100 // Reduced from 500 to prevent large visible squares
	private readonly velocities: Float32Array

	constructor() {
		this.velocities = new Float32Array(this.particleCount * 3)
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

			// Position - spread around the scene
			positions[i3] = (Math.random() - 0.5) * 80
			positions[i3 + 1] = Math.random() * 8 - 2
			positions[i3 + 2] = (Math.random() - 0.5) * 60 - 10

			// Velocity - slow drifting motion
			this.velocities[i3] = (Math.random() - 0.5) * 0.02
			this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.01
			this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.02

			// Scale variation - much smaller to avoid large squares
			scales[i] = Math.random() * 0.8 + 0.3

			// Random offset for animation
			randoms[i] = Math.random()
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
				uSize: { value: 30 }, // Reduced from 100
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
				varying float vRandom;

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
					
					// Size attenuation
					gl_PointSize = uSize * aScale * uPixelRatio;
					gl_PointSize *= (1.0 / -viewPosition.z);
					
					// Alpha based on distance and hope factor
					// Fog is more visible in storm, less in hope (reduced opacity)
					float stormAlpha = 0.15;
					float hopeAlpha = 0.05;
					vAlpha = mix(stormAlpha, hopeAlpha, uHopeFactor);
					vRandom = aRandom;
				}
			`,
			fragmentShader: `
				uniform float uTime;
				uniform float uHopeFactor;
				
				varying float vAlpha;
				varying float vRandom;

				void main() {
					// Circular particle shape with soft edges
					float dist = length(gl_PointCoord - vec2(0.5));
					if (dist > 0.5) discard;
					
					float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
					alpha *= vAlpha;
					
					// Color - grayish in storm, slightly warm in hope
					vec3 stormColor = vec3(0.5, 0.55, 0.6);
					vec3 hopeColor = vec3(0.8, 0.75, 0.7);
					vec3 color = mix(stormColor, hopeColor, uHopeFactor);
					
					// Subtle pulsing (slower and less intense)
					alpha *= 0.9 + sin(uTime * 0.3 + vRandom * 10.0) * 0.1;
					
					gl_FragColor = vec4(color, alpha);
				}
			`,
			transparent: true,
			depthWrite: false,
			blending: THREE.NormalBlending,
		})
	}

	public update(time: number, hopeFactor: number): void {
		this.material.uniforms.uTime.value = time
		this.material.uniforms.uHopeFactor.value = hopeFactor

		// Update particle positions for drifting effect
		const positions = this.geometry.attributes.position
			.array as Float32Array

		for (let i = 0; i < this.particleCount; i++) {
			const i3 = i * 3

			positions[i3] += this.velocities[i3]
			positions[i3 + 1] += this.velocities[i3 + 1]
			positions[i3 + 2] += this.velocities[i3 + 2]

			// Wrap around boundaries
			if (positions[i3] > 40) positions[i3] = -40
			if (positions[i3] < -40) positions[i3] = 40
			if (positions[i3 + 2] > 20) positions[i3 + 2] = -40
			if (positions[i3 + 2] < -40) positions[i3 + 2] = 20
		}

		this.geometry.attributes.position.needsUpdate = true
	}

	public getObject(): THREE.Points {
		return this.particles
	}
}
