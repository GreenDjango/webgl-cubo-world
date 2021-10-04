import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { doBenchmark } from './benchmark'
import { Coordinator, Sprite, Position } from './ECS'

const DEBUG = true

if (DEBUG) {
	const defaultAssert = console.assert
	console.assert = (value: any, ...optionalParams: any[]) => {
		// if (!value) alert('assert fail')
		defaultAssert(value, ...optionalParams)
	}
} else {
	console.assert = () => {}
}

// setTimeout(doBenchmark, 1000)

const ecs = new Coordinator()

ecs.registerComponent(Position.name)
ecs.registerComponent(Sprite.name)
ecs.registerComponent('a')
ecs.registerComponent('b')
ecs.registerComponent('c')
ecs.registerComponent('d')
ecs.registerComponent('e')

console.time('entity')
for (let index = 0; index < 16 * 16 * 128; index++) {
	const entity = ecs.createEntity()
	ecs.assignComponent(entity, new Position())
}
console.timeEnd('entity')

ecs.assignComponent(1, new Sprite())
ecs.assignComponent(2, new Sprite())
ecs.assignComponent(3, new Sprite())

console.log(ecs)

setInterval(()=> {
	// system
}, 50) // 20 tick/s

/*
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
	render()
}

function animate() {
	requestAnimationFrame(animate)

	cube.rotation.x += 0.01
	cube.rotation.y += 0.01

	controls.update()

	render()
}

function render() {
	renderer.render(scene, camera)
}
animate()
*/
