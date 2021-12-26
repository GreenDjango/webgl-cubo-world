export class Component {
	static type: number
}

export type Entity = number
export type ComponentName = string
export type ComponentType = Component
export type ComponentID = number
export type ComponentsType = { [key: ComponentID]: ComponentType }
export type SystemName = string

export interface Type<T> extends Function {
	new (...args: any[]): T
}

export interface TypeWithArgs<T, A extends any[]> extends Function {
	new (...args: A): T
}

// JavaScript stores numbers as 64 bits floating point numbers,
// but all bitwise operations are performed on 32 bits binary numbers.
// Before a bitwise operation is performed, JavaScript converts numbers to 32 bits signed integers.
// After the bitwise operation is performed, the result is converted back to 64 bits JavaScript numbers.
export const MAX_ENTITIES = Math.pow(2, 16)
export const MAX_COMPONENTS = 128
// export const MAX_COMPONENTS_TYPE = 0b1 << 31
// export const EMPTY_SIGNATURE = 0

window.DEBUG && console.assert(MAX_ENTITIES < Number.MAX_SAFE_INTEGER, 'Max entities is bigger than Entity type.')
window.DEBUG &&
	console.assert(MAX_COMPONENTS < Number.MAX_SAFE_INTEGER, 'Max components is bigger than components max.')

export function assertEntity(value: Entity) {
	console.assert(typeof value === 'number', 'Entity is not a number.')
	console.assert(!isNaN(value), 'Entity is not a number.')
	console.assert(value < MAX_ENTITIES, 'Entity is out of range.')
	console.assert(value > 0, 'Entity is out of range.')
}
