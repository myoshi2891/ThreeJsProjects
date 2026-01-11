import * as THREE from "three"

export class Water {
	private readonly mesh: THREE.Mesh
	private readonly material: THREE.ShaderMaterial

	constructor() {
		const geometry = new THREE.PlaneGeometry(100, 100, 128, 128)
		this.material = this.createMaterial()
		this.mesh = new THREE.Mesh(geometry, this.material)
		this.mesh.rotation.x = -Math.PI / 2
		this.mesh.position.y = -1
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

                // 嵐の時の激しい波
                float stormWave = sin(pos.x * 0.5 + uTime * 2.0) * 0.8 +
                                  cos(pos.z * 0.3 + uTime * 1.5) * 0.6;
                
                // 希望の時の穏やかな波
                float hopeWave = sin(pos.x * 0.2 + uTime * 0.5) * 0.15 +
                                 cos(pos.z * 0.15 + uTime * 0.3) * 0.1;

                // 波の高さを補間
                float wave = mix(stormWave, hopeWave, uHopeFactor);
                pos.y += wave;

                vElevation = wave;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `
	}

	private getFragmentShader(): string {
		return `
            uniform vec3 uStormColor;
            uniform vec3 uHopeColor;
            uniform float uHopeFactor;
            varying vec2 vUv;
            varying float vElevation;

            void main() {
                // 波の高さに基づいた色の変化（clampで0-1に制限）
                float colorMix = clamp((vElevation + 1.0) * 0.5, 0.0, 1.0);
                
                // 嵐の色（暗い灰色から深い青）
                vec3 stormDark = vec3(0.1, 0.1, 0.15);
                vec3 stormLight = vec3(0.2, 0.25, 0.35);
                vec3 stormColor = mix(stormDark, stormLight, colorMix);

                // 希望の色（明るい青から水色）
                vec3 hopeDark = vec3(0.2, 0.5, 0.8);
                vec3 hopeLight = vec3(0.4, 0.7, 1.0);
                vec3 hopeColor = mix(hopeDark, hopeLight, colorMix);

                // 最終的な色を補間
                vec3 finalColor = mix(stormColor, hopeColor, uHopeFactor);

                // 波の泡のような効果を追加
                float foam = smoothstep(0.6, 1.0, vElevation) * (1.0 - uHopeFactor);
                finalColor += vec3(foam * 0.3);

                gl_FragColor = vec4(finalColor, 1.0);
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
