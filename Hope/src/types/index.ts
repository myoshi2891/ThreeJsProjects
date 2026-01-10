import * as THREE from "three"

export interface SceneParams {
	hopeFactor: number
	bloomStrength: number
	envIntensity: number
}

export interface WaterUniforms {
	uTime: { value: number }
	uHopeFactor: { value: number }
	uStormColor: { value: THREE.Color }
	uHopeColor: { value: THREE.Color }
}

export interface LoadingCallbacks {
	onProgress?: (progress: number) => void
	onComplete?: () => void
	onError?: (error: Error) => void
}
