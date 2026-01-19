import { describe, it, expect, beforeEach } from "vitest"
import { useSceneStore } from "../sceneStore"

describe("sceneStore", () => {
	beforeEach(() => {
		// Reset store state before each test
		useSceneStore.setState({
			hopeFactor: 0,
			scrollProgress: 0,
			bloomStrength: 0.2,
			envIntensity: 0.1,
		})
	})

	describe("hopeFactor", () => {
		it("should have initial hopeFactor as 0", () => {
			const state = useSceneStore.getState()
			expect(state.hopeFactor).toBe(0)
		})

		it("should update hopeFactor", () => {
			useSceneStore.getState().setHopeFactor(0.5)
			expect(useSceneStore.getState().hopeFactor).toBe(0.5)
		})

		it("should update hopeFactor to 1 (full hope)", () => {
			useSceneStore.getState().setHopeFactor(1)
			expect(useSceneStore.getState().hopeFactor).toBe(1)
		})
	})

	describe("scrollProgress", () => {
		it("should have initial scrollProgress as 0", () => {
			const state = useSceneStore.getState()
			expect(state.scrollProgress).toBe(0)
		})

		it("should update scrollProgress", () => {
			useSceneStore.getState().setScrollProgress(0.75)
			expect(useSceneStore.getState().scrollProgress).toBe(0.75)
		})
	})

	describe("bloomStrength", () => {
		it("should have initial bloomStrength as 0.2", () => {
			const state = useSceneStore.getState()
			expect(state.bloomStrength).toBe(0.2)
		})

		it("should update bloomStrength", () => {
			useSceneStore.getState().setBloomStrength(1.5)
			expect(useSceneStore.getState().bloomStrength).toBe(1.5)
		})
	})

	describe("envIntensity", () => {
		it("should have initial envIntensity as 0.1", () => {
			const state = useSceneStore.getState()
			expect(state.envIntensity).toBe(0.1)
		})

		it("should update envIntensity", () => {
			useSceneStore.getState().setEnvIntensity(1)
			expect(useSceneStore.getState().envIntensity).toBe(1)
		})
	})
})
