import * as THREE from "three"

export class Rain {
	private readonly points: THREE.Points
	private readonly geometry: THREE.BufferGeometry
	private readonly material: THREE.PointsMaterial
	private readonly rainCount = 3000 // Reduced from 10000

	constructor() {
		this.geometry = this.createGeometry()
		this.material = this.createMaterial()
		this.points = new THREE.Points(this.geometry, this.material)
	}

	private createGeometry(): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry()
		const positions = new Float32Array(this.rainCount * 3)

		for (let i = 0; i < this.rainCount * 3; i++) {
			positions[i] = (Math.random() - 0.5) * 60
		}

		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3)
		)
		return geometry
	}

	private createMaterial(): THREE.PointsMaterial {
		return new THREE.PointsMaterial({
			color: 0xaaaaaa,
			size: 0.05, // Smaller rain drops
			transparent: true,
			opacity: 0.7,
		})
	}

	public update(hopeFactor: number): void {
		if (hopeFactor >= 0.99) return

		const positions = this.geometry.attributes.position
			.array as Float32Array

		for (let i = 1; i < this.rainCount * 3; i += 3) {
			positions[i] -= 0.2 // Slower rain speed
			if (positions[i] < -10) {
				positions[i] = 20
			}
		}

		this.geometry.attributes.position.needsUpdate = true
	}

	public setOpacity(opacity: number): void {
		this.material.opacity = opacity
	}

	public getObject(): THREE.Points {
		return this.points
	}
}
