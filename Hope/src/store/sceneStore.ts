import { create } from "zustand"

interface SceneState {
	// Animation progress
	hopeFactor: number
	scrollProgress: number

	// Scene parameters
	bloomStrength: number
	envIntensity: number

	// Actions
	setHopeFactor: (factor: number) => void
	setScrollProgress: (progress: number) => void
	setBloomStrength: (strength: number) => void
	setEnvIntensity: (intensity: number) => void
}

export const useSceneStore = create<SceneState>((set) => ({
	// Initial state (matching original SceneParams)
	hopeFactor: 0,
	scrollProgress: 0,
	bloomStrength: 0.2,
	envIntensity: 0.1,

	// Actions
	setHopeFactor: (factor) => set({ hopeFactor: factor }),
	setScrollProgress: (progress) => set({ scrollProgress: progress }),
	setBloomStrength: (strength) => set({ bloomStrength: strength }),
	setEnvIntensity: (intensity) => set({ envIntensity: intensity }),
}))
