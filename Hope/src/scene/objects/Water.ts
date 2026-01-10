import * as THREE from "three"

export class Water {
	private readonly mesh: THREE.Mesh
	private readonly material: THREE.ShaderMaterial

	constructor() {
		const geometry = new THREE.PlaneGeometry(100, 100, 256, 256)
		this.material = this.createMaterial()
		this.mesh = new THREE.Mesh(geometry, this.material)

		this.mesh.rotation.x = -Math.PI / 2
		this.mesh.position.y = -0.5
	}

	private createMaterial(): THREE.ShaderMaterial {
		return new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uHopeFactor: { value: 0 },
				uStormColor: { value: new THREE.Color(0x051020) },
				uHopeColor: { value: new THREE.Color(0x0088ff) },
			},
			vertexShader: this.getVertexShader(),
			fragmentShader: this.getFragmentShader(),
			transparent: true,
		})
	}

	private getVertexShader(): string {
		return `
            uniform float uTime;
            uniform float uHopeFactor;
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
                vUv = uv;
                vec3 pos = position;
                float stormIntensity = 1.0 - uHopeFactor;
                
                float wave = sin(pos.x * 0.5 + uTime) * 1.5;
                float wave2 = cos(pos.y * 0.3 + uTime * 0.8) * 1.0;
                float choppy = sin(pos.x * 4.0 + pos.y * 3.0 + uTime * 2.0) * 0.2;
                
                float elevation = (wave + wave2 + choppy) * stormIntensity;
                pos.z += elevation;
                vElevation = elevation;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `
	}

	private getFragmentShader(): string {
		return `
            uniform vec3 uStormColor;
            uniform vec3 uHopeColor;
            uniform float uHopeFactor;
            varying float vElevation;
            
            void main() {
                float foam = smoothstep(0.5, 2.0, vElevation);
                vec3 baseColor = mix(uStormColor, uHopeColor, uHopeFactor);
                vec3 finalColor = mix(baseColor, vec3(1.0), foam * (1.0 - uHopeFactor)); 
                
                gl_FragColor = vec4(finalColor, 0.9);
            }
        `
	}

	public update(time: number): void {
		this.material.uniforms.uTime.value = time
	}

	public updateHopeFactor(factor: number): void {
		this.material.uniforms.uHopeFactor.value = factor
	}

	public getObject(): THREE.Mesh {
		return this.mesh
	}
}
