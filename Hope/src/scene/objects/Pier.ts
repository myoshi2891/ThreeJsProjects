import * as THREE from "three"

export class Pier {
	private readonly group: THREE.Group

	constructor() {
		this.group = new THREE.Group()
		this.createPier()
	}

	private createPier(): void {
		const geometry = new THREE.BoxGeometry(2, 0.2, 20)
		const material = new THREE.MeshStandardMaterial({
			color: 0x332211,
			roughness: 0.8,
		})

		const pier = new THREE.Mesh(geometry, material)
		pier.position.set(0, 0, 0)
		this.group.add(pier)

		this.createPoles(material)
	}

	private createPoles(material: THREE.MeshStandardMaterial): void {
		for (let i = 0; i < 5; i++) {
			const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 4)
			const poleLeft = new THREE.Mesh(poleGeo, material)
			const poleRight = new THREE.Mesh(poleGeo, material)

			poleLeft.position.set(-0.8, -2, -8 + i * 4)
			poleRight.position.set(0.8, -2, -8 + i * 4)

			this.group.add(poleLeft, poleRight)
		}
	}

	public getObject(): THREE.Group {
		return this.group
	}
}
