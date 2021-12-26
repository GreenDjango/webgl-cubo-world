import { EventDispatcher, Quaternion, Vector3, Camera } from 'three'

const _changeEvent = { type: 'change' }

class PlayerControls extends EventDispatcher {
	object: Camera
	domElement: HTMLElement

	movementSpeed: number
	rollSpeed: number
	dragToLook: boolean
	autoForward: boolean

	private tmpQuaternion: Quaternion
	private mouseStatus: number
	private moveState: {
		up: number
		down: number
		left: number
		right: number
		forward: number
		back: number
		pitchUp: number
		pitchDown: number
		yawLeft: number
		yawRight: number
		rollLeft: number
		rollRight: number
	}
	private moveVector: Vector3
	private rotationVector: Vector3

	private _mousemove: (this: HTMLElement, ev: MouseEvent) => void
	private _mousedown: (this: HTMLElement, ev: MouseEvent) => void
	private _mouseup: (this: HTMLElement, ev: MouseEvent) => void
	private _keydown: (this: Window, ev: KeyboardEvent) => void
	private _keyup: (this: Window, ev: KeyboardEvent) => void

	constructor(object: Camera, domElement: HTMLElement) {
		super()

		this.object = object
		this.domElement = domElement

		// API
		this.movementSpeed = 1.0
		this.rollSpeed = 0.005

		this.dragToLook = false
		this.autoForward = false

		// disable default target object behavior

		// internals

		this.tmpQuaternion = new Quaternion()

		this.mouseStatus = 0

		this.moveState = {
			up: 0,
			down: 0,
			left: 0,
			right: 0,
			forward: 0,
			back: 0,
			pitchUp: 0,
			pitchDown: 0,
			yawLeft: 0,
			yawRight: 0,
			rollLeft: 0,
			rollRight: 0,
		}
		this.moveVector = new Vector3(0, 0, 0)
		this.rotationVector = new Vector3(0, 0, 0)

		this._mousemove = this.mousemove.bind(this)
		this._mousedown = this.mousedown.bind(this)
		this._mouseup = this.mouseup.bind(this)
		this._keydown = this.keydown.bind(this)
		this._keyup = this.keyup.bind(this)

		this.domElement.addEventListener('contextmenu', contextmenu)

		this.domElement.addEventListener('mousemove', this._mousemove)
		this.domElement.addEventListener('mousedown', this._mousedown)
		this.domElement.addEventListener('mouseup', this._mouseup)

		window.addEventListener('keydown', this._keydown)
		window.addEventListener('keyup', this._keyup)

		this.updateMovementVector()
		this.updateRotationVector()
	}

	private keydown(event: KeyboardEvent) {
		if (event.altKey) {
			return
		}

		switch (event.code) {
			case 'ShiftLeft':
			case 'ShiftRight':
				break

			case 'KeyW':
				this.moveState.forward = 1
				break
			case 'KeyS':
				this.moveState.back = 1
				break

			case 'KeyA':
				this.moveState.left = 1
				break
			case 'KeyD':
				this.moveState.right = 1
				break

			case 'KeyR':
				this.moveState.up = 1
				break
			case 'KeyF':
				this.moveState.down = 1
				break

			case 'ArrowUp':
				this.moveState.pitchUp = 1
				break
			case 'ArrowDown':
				this.moveState.pitchDown = 1
				break

			case 'ArrowLeft':
				this.moveState.yawLeft = 1
				break
			case 'ArrowRight':
				this.moveState.yawRight = 1
				break

			case 'KeyQ':
				this.moveState.rollLeft = 1
				break
			case 'KeyE':
				this.moveState.rollRight = 1
				break
		}

		this.updateMovementVector()
		this.updateRotationVector()
	}

	private keyup(event: KeyboardEvent) {
		switch (event.code) {
			case 'ShiftLeft':
			case 'ShiftRight':
				break

			case 'KeyW':
				this.moveState.forward = 0
				break
			case 'KeyS':
				this.moveState.back = 0
				break

			case 'KeyA':
				this.moveState.left = 0
				break
			case 'KeyD':
				this.moveState.right = 0
				break

			case 'KeyR':
				this.moveState.up = 0
				break
			case 'KeyF':
				this.moveState.down = 0
				break

			case 'ArrowUp':
				this.moveState.pitchUp = 0
				break
			case 'ArrowDown':
				this.moveState.pitchDown = 0
				break

			case 'ArrowLeft':
				this.moveState.yawLeft = 0
				break
			case 'ArrowRight':
				this.moveState.yawRight = 0
				break

			case 'KeyQ':
				this.moveState.rollLeft = 0
				break
			case 'KeyE':
				this.moveState.rollRight = 0
				break
		}

		this.updateMovementVector()
		this.updateRotationVector()
	}

	private mousemove(event: MouseEvent) {
		if (!this.dragToLook || this.mouseStatus > 0) {
			const container = this.getContainerDimensions()
			const halfWidth = container.size[0] / 2
			const halfHeight = container.size[1] / 2

			this.moveState.yawLeft = -(event.pageX - container.offset[0] - halfWidth) / halfWidth
			this.moveState.pitchDown = (event.pageY - container.offset[1] - halfHeight) / halfHeight

			this.updateRotationVector()
		}
	}

	private mousedown(event: MouseEvent) {
		if (this.dragToLook) {
			this.mouseStatus++
		} else {
			switch (event.button) {
				case 0:
					this.moveState.forward = 1
					break
				case 2:
					this.moveState.back = 1
					break
			}

			this.updateMovementVector()
		}
	}

	private mouseup(event: MouseEvent) {
		if (this.dragToLook) {
			this.mouseStatus--

			this.moveState.yawLeft = this.moveState.pitchDown = 0
		} else {
			switch (event.button) {
				case 0:
					this.moveState.forward = 0
					break
				case 2:
					this.moveState.back = 0
					break
			}

			this.updateMovementVector()
		}

		this.updateRotationVector()
	}

	update(delta: number) {
		const EPS = 0.000001
		const lastQuaternion = new Quaternion()
		const lastPosition = new Vector3()

		const moveMult = delta * this.movementSpeed
		const rotMult = delta * this.rollSpeed

		this.object.translateX(this.moveVector.x * moveMult)
		this.object.translateY(this.moveVector.y * moveMult)
		this.object.translateZ(this.moveVector.z * moveMult)

		this.tmpQuaternion
			.set(this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1)
			.normalize()
		this.object.quaternion.multiply(this.tmpQuaternion)

		if (
			lastPosition.distanceToSquared(this.object.position) > EPS ||
			8 * (1 - lastQuaternion.dot(this.object.quaternion)) > EPS
		) {
			this.dispatchEvent(_changeEvent)
			lastQuaternion.copy(this.object.quaternion)
			lastPosition.copy(this.object.position)
		}
	}

	private updateMovementVector() {
		const forward = this.moveState.forward || (this.autoForward && !this.moveState.back) ? 1 : 0

		this.moveVector.x = -this.moveState.left + this.moveState.right
		this.moveVector.y = -this.moveState.down + this.moveState.up
		this.moveVector.z = -forward + this.moveState.back

		//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );
	}

	private updateRotationVector() {
		this.rotationVector.x = -this.moveState.pitchDown + this.moveState.pitchUp
		this.rotationVector.y = -this.moveState.yawRight + this.moveState.yawLeft
		this.rotationVector.z = -this.moveState.rollRight + this.moveState.rollLeft

		//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );
	}

	private getContainerDimensions() {
		return {
			size: [this.domElement.offsetWidth, this.domElement.offsetHeight],
			offset: [this.domElement.offsetLeft, this.domElement.offsetTop],
		}
	}

	dispose() {
		this.domElement.removeEventListener('contextmenu', contextmenu)
		this.domElement.removeEventListener('mousedown', this._mousedown)
		this.domElement.removeEventListener('mousemove', this._mousemove)
		this.domElement.removeEventListener('mouseup', this._mouseup)

		window.removeEventListener('keydown', this._keydown)
		window.removeEventListener('keyup', this._keyup)
	}
}

function contextmenu(event: MouseEvent) {
	event.preventDefault()
}

export { PlayerControls }
