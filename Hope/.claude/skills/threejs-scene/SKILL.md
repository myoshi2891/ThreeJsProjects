---
name: threejs-scene
description: Three.js 3D scene development patterns. Use when creating or modifying 3D scenes, cameras, lights, geometries, materials, or animations in Three.js projects.
---

# Three.js Scene Development

## Scene Setup Pattern

```typescript
import * as THREE from 'three'

class SceneManager {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    )
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(this.renderer.domElement)
  }

  animate(): void {
    requestAnimationFrame(() => this.animate())
    this.renderer.render(this.scene, this.camera)
  }
}
```

## Common Patterns

### Responsive Resize
```typescript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
```

### Particle System
```typescript
const geometry = new THREE.BufferGeometry()
const positions = new Float32Array(count * 3)
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({
  size: 0.1,
  color: 0xffffff,
  transparent: true,
  opacity: 0.8
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)
```

### Animation with GSAP
```typescript
import gsap from 'gsap'

gsap.to(mesh.position, {
  x: 5,
  duration: 2,
  ease: 'power2.inOut'
})

gsap.to(mesh.rotation, {
  y: Math.PI * 2,
  duration: 3,
  repeat: -1,
  ease: 'none'
})
```

## Performance Tips

1. **Limit draw calls**: Merge geometries when possible
2. **Optimize textures**: Use power-of-2 dimensions, compress
3. **Dispose resources**: Call `.dispose()` on geometries/materials
4. **Use instancing**: For many identical objects
5. **Reduce pixel ratio**: Cap at 2 for mobile

## Import Types
```typescript
import type { Scene, Camera, Mesh, Material } from 'three'
```
