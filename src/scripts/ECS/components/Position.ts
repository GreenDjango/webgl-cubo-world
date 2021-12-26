import { Component } from '../core'

export class Position extends Component {
	x: number
	y: number
	z: number
	constructor(x = 0, y = 0, z = 0) {
		super()
		this.x = x
		this.y = y
		this.z = z
	}
}
