import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { PlayerControls } from './render/PlayerControls'
import { TextureManager } from './render/TextureManager'
import Stats from 'three/examples/jsm/libs/stats.module'

import { Coordinator, Sprite, Position } from './ECS'

import * as cubes_atlas from '../assets/textures_0.json'

// console.time('entity')
// for (let index = 0; index <= 16 * 16 * 32; index++) {
// 	const x = index % 16
// 	const z = Math.trunc(index / 16) % 16
// 	const y = Math.trunc(index / 256 - 32)
// 	const entity = ecs.createEntity()
// 	ecs.assignComponent(entity, new Position(x, y, z))
// 	const cube = new THREE.Mesh(geometry, material)
// 	cube.position.x = x
// 	cube.position.z = -z
// 	cube.position.y = y
// 	scene.add(cube)
// }
// console.timeEnd('entity')

enum runState {
	'run',
	'pause',
	'stop',
}

export class Game {
	private CONFIG: Window['CONFIG']
	private domElement: HTMLElement
	private _renderLoop: () => void
	private _tickLoop: () => void
	private _onWindowResize: () => void
	private renderClock: THREE.Clock
	private tickClock: THREE.Clock
	private tickIntervalHandle?: NodeJS.Timer
	private renderer: THREE.WebGLRenderer
	private scene: THREE.Scene
	private camera: THREE.PerspectiveCamera
	private controls: PlayerControls
	private textureManager: TextureManager
	private stats?: Stats
	private ecs?: Coordinator
	private _isReady: boolean
	private _runState: runState

	constructor(parent: HTMLElement) {
		this.CONFIG = window.CONFIG
		this.domElement = parent
		this._renderLoop = this.renderLoop.bind(this)
		this._tickLoop = this.tickLoop.bind(this)
		this._onWindowResize = this.onWindowResize.bind(this)
		this.renderClock = new THREE.Clock()
		this.tickClock = new THREE.Clock()
		this.renderer = new THREE.WebGLRenderer()
		this.scene = new THREE.Scene()
		this.camera = undefined as any
		this.controls = undefined as any
		this.textureManager = new TextureManager()

		this._isReady = false
		this._runState = runState.stop
	}

	async init(progressBar?: HTMLElement) {
		if (this.isReady) return
		const loadManager = new THREE.LoadingManager()
		this.textureManager.loader.manager = loadManager

		loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
			const progress = (itemsLoaded / itemsTotal) * 100
			progressBar && (progressBar.style.width = progress.toFixed(2) + '%')
		}

		const loadAssets = new Promise<void>((resolve, reject) => {
			loadManager.onLoad = resolve
		})

		// @ts-expect-error
		const unknownImageUrl = new URL('../assets/unknown.png', import.meta.url)
		this.textureManager.load('unknown', unknownImageUrl)

		// @ts-expect-error
		const imageUrl = new URL('../assets/textures_0.png', import.meta.url)
		this.textureManager.loadAtlas('cubes', imageUrl, 16 / 512, 16 / 512)

		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.domElement.appendChild(this.renderer.domElement)

		window.addEventListener('resize', this._onWindowResize, false)

		if (window.DEBUG) {
			this.stats = Stats()
			this.stats.showPanel(0)
			this.domElement.appendChild(this.stats.dom)
		}

		await loadAssets

		this.textureManager.applyFilters('unknown', 'pixel')
		this.textureManager.applyFilters('cubes', 'pixel')

		Object.entries(cubes_atlas).forEach(([key, value]) => {
			this.textureManager.generateFrame('cubes', key, value.x, value.y)
		})

		this._isReady = true
	}

	private threeRun() {
		this.camera = new THREE.PerspectiveCamera()
		this.camera.fov = this.CONFIG.fov || 70
		this.camera.fov = this.CONFIG.fov || 70
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.near = 0.1
		this.camera.far = 1000
		this.camera.position.set(0, 0, 4)

		this.controls = new PlayerControls(this.camera, this.domElement)
		this.controls.movementSpeed = 10
		this.controls.rollSpeed = Math.PI / 6
		this.controls.autoForward = false
		this.controls.dragToLook = true
	}

	private ecsRun() {
		const material = new THREE.MeshBasicMaterial({
			map: this.textureManager.get('grass_side'),
			// color: 0x00ff00,
			// wireframe: true,
		})
		const material2 = new THREE.MeshBasicMaterial({
			map: this.textureManager.get('fish_pufferfish_raw'),
			transparent: true,
		})
		const geometry = new THREE.BoxGeometry()

		this.ecs = new Coordinator()
		this.ecs.registerComponent(Position)
		this.ecs.registerComponent(Sprite)

		for (let y = -1; y < 1; y++) {
			for (let z = 0; z < 16; z++) {
				for (let x = 0; x < 16; x++) {
					const entity = this.ecs.createEntity()
					this.ecs.assignComponent(entity, new Position(x, y, z))
					let cube
					if (x === 0) cube = new THREE.Mesh(geometry, material2)
					else cube = new THREE.Mesh(geometry, material)
					cube.position.x = x
					cube.position.z = -z
					cube.position.y = y
					this.scene.add(cube)
				}
			}
		}
	}

	run() {
		if (this._runState !== runState.stop) return
		this.threeRun()
		this.ecsRun()
		this.tickIntervalHandle = setInterval(this._tickLoop, this.CONFIG.tick)
		this._runState = runState.run
		this.onWindowResize()
		this.renderLoop()
	}

	private render() {
		const delta = this.renderClock.getDelta()

		//controls.update()
		this.controls.update(delta)

		this.renderer.render(this.scene, this.camera)
		// const ctx = this.renderer.domElement.getContext('2d')
		// ctx?.rect(50, 50, 200, 200)
		// ctx?.fill()
	}

	private renderLoop() {
		if (this._runState === runState.stop) return
		requestAnimationFrame(this._renderLoop)
		this.stats?.update()

		if (this._runState !== runState.run) return
		this.render()
	}

	private tickLoop() {
		const delta = this.tickClock.getDelta()
		if (this._runState !== runState.run) return
		// console.log('tick', delta)
		// system(delta)
	}

	pause() {
		if (this._runState !== runState.run) return
		this._runState = runState.pause
	}

	resume() {
		if (this._runState !== runState.pause) return
		this._runState = runState.run
	}

	stop() {
		this.pause()
		if (this._runState !== runState.pause) return
		if (this.tickIntervalHandle !== undefined) {
			clearInterval(this.tickIntervalHandle)
			this.tickIntervalHandle = undefined
		}
		this.scene.clear()
		this._runState = runState.stop
	}

	onWindowResize() {
		if (this._runState === runState.stop) return
		this.camera.aspect = this.domElement.clientWidth / this.domElement.clientHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(this.domElement.clientWidth, this.domElement.clientHeight)
		this.renderer.render(this.scene, this.camera)
	}

	get isReady() {
		return this._isReady
	}

	get isRun() {
		return this._runState === runState.run
	}

	get isPause() {
		return this._runState === runState.pause
	}
}
