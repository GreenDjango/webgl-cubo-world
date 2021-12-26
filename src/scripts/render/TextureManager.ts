import * as THREE from 'three'

export class TextureManager {
	private textures: { [key: string]: THREE.Texture }
	private atlas: { [key: string]: { frameXSize: number; frameYSize: number } }
	private fallback: string
	loader: THREE.TextureLoader

	constructor(loadingManager?: THREE.LoadingManager, fallback?: string) {
		this.textures = {}
		this.atlas = {}
		this.loader = new THREE.TextureLoader(loadingManager)
		this.fallback = fallback || 'unknown'
	}

	load(key: string, path: URL) {
		this.textures[key] = this.loader.load(path.pathname, undefined, undefined, (err) => {
			console.warn('Fail to load texture.', err)
		})
	}

	loadAtlas(key: string, path: URL, frameXSize: number, frameYSize: number) {
		this.load(key, path)
		this.atlas[key] = { frameXSize, frameYSize }
		const texture = this.get(key)
		texture.center.set(0, 1)
		texture.repeat.set(frameXSize, frameYSize)
		texture.offset.set(0, 0)
	}

	get(key: string) {
		window.DEBUG && console.assert(!!this.textures[key], 'Texture not registered.')
		return this.textures[key] || this.textures[this.fallback]
	}

	generateFrame(key: string, newKey: string, x: number, y: number) {
		const texture = this.get(key).clone()
		this.textures[newKey] = texture
		const { frameXSize, frameYSize } = this.atlas[key]
		texture.offset.set(frameXSize * x, -(frameYSize * y))
		texture.needsUpdate = true
	}

	applyFilters(key: string, filter: 'pixel' | 'repeat') {
		const texture = this.get(key)
		switch (filter) {
			case 'pixel':
				texture.minFilter = THREE.LinearMipmapLinearFilter
				texture.magFilter = THREE.NearestFilter
				break

			case 'repeat':
				texture.wrapS = THREE.RepeatWrapping
				texture.wrapT = THREE.RepeatWrapping
				texture.needsUpdate = true
				break

			default:
				break
		}
	}
}
