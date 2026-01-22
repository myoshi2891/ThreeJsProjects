export interface SceneParams {
	hopeFactor: number
	bloomStrength: number
	envIntensity: number
}

export interface LoadingCallbacks {
	onProgress?: (progress: number) => void
	onComplete?: () => void
	onError?: (error: Error) => void
}

// Three.js Scene型の拡張
declare module "three" {
	interface Scene {
		environmentIntensity: number
		backgroundIntensity: number
		backgroundBlurriness: number
	}
}
