import * as THREE from "three"

export class Pier {
	private readonly mesh: THREE.Mesh
	private readonly material: THREE.MeshStandardMaterial
	private readonly darkColor = new THREE.Color(0x4a2511)
	private readonly lightColor = new THREE.Color(0xdaa520)
	private lastFactor = -1

	constructor() {
		const geometry = new THREE.BoxGeometry(2, 0.2, 20)
		this.material = new THREE.MeshStandardMaterial({
			color: 0x8b4513,
			roughness: 0.8,
			metalness: 0.2,
		})
		this.mesh = new THREE.Mesh(geometry, this.material)
		this.mesh.position.set(0, 0.1, 0)
		this.mesh.castShadow = true
		this.mesh.receiveShadow = true
	}

	public updateHopeFactor(factor: number): void {
		// 値が変わっていない場合はスキップ
		if (Math.abs(factor - this.lastFactor) < 0.001) return
		this.lastFactor = factor

		// factorを0-1にクランプ
		const clampedFactor = THREE.MathUtils.clamp(factor, 0, 1)

		// 橋の色を暗い茶色から明るい木の色へ
		this.material.color.lerpColors(
			this.darkColor,
			this.lightColor,
			clampedFactor
		)

		// 橋の質感を改善
		this.material.roughness = THREE.MathUtils.lerp(0.9, 0.4, clampedFactor)
		this.material.metalness = THREE.MathUtils.lerp(0.1, 0.3, clampedFactor)
	}

	public getObject(): THREE.Mesh {
		return this.mesh
	}
}
