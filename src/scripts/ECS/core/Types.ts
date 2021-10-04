export type Entity = number
export type Signature = number
export type ComponentType = number
export type ComponentName = string
export type SystemName = string

// JavaScript stores numbers as 64 bits floating point numbers,
// but all bitwise operations are performed on 32 bits binary numbers.
// Before a bitwise operation is performed, JavaScript converts numbers to 32 bits signed integers.
// After the bitwise operation is performed, the result is converted back to 64 bits JavaScript numbers.
export const MAX_ENTITIES = Math.pow(2, 16)
export const MAX_COMPONENTS = 32 // sizeof(number) =~ double 32bits
export const MAX_COMPONENTS_TYPE = 0b1 << 31
export const EMPTY_SIGNATURE = 0

console.assert(MAX_ENTITIES < Number.MAX_SAFE_INTEGER, 'Max entities is bigger than Entity type.')

export function assertEntity(value: Entity) {
	console.assert(typeof value === 'number', 'Entity is not a number.')
	console.assert(!isNaN(value), 'Entity is not a number.')
	console.assert(value < MAX_ENTITIES, 'Entity is out of range.')
	console.assert(value > 0, 'Entity is out of range.')
}
