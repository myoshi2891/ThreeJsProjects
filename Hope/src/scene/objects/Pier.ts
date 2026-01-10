import * as THREE from "three"

export class Pier {
	private readonly mesh: THREE.Mesh
	private readonly material: THREE.MeshStandardMaterial

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
		// 橋の色を暗い茶色から明るい木の色へ
		const darkColor = new THREE.Color(0x4a2511)
		const lightColor = new THREE.Color(0xdaa520)
		this.material.color.lerpColors(darkColor, lightColor, factor)

		// 橋の質感を改善
		this.material.roughness = THREE.MathUtils.lerp(0.9, 0.4, factor)
		this.material.metalness = THREE.MathUtils.lerp(0.1, 0.3, factor)
	}

	public getObject(): THREE.Mesh {
		return this.mesh
	}
}
