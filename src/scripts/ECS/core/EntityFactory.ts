import { Entity, Signature, MAX_ENTITIES, EMPTY_SIGNATURE, assertEntity } from './Types'

export function writeSignature(signature: Signature, value: number) {
	return signature | value
}

export class EntityFactory {
	private _currentCursor: Entity
	// Dict of signatures, key = entity ID
	private _entities: { [key: Entity]: Signature }
	// Total alive entities - used to keep limits
	private _aliveEntityCount: number

	constructor() {
		this._currentCursor = 0
		this._entities = {}
		this._aliveEntityCount = 0
	}

	// Take an unused ID
	create(): Entity {
		console.assert(this._aliveEntityCount < MAX_ENTITIES, 'Entity limit reached.')
		do {
			this._currentCursor++
			if (this._currentCursor >= Number.MAX_SAFE_INTEGER) {
				this._currentCursor = 1
			}
		} while (this._currentCursor in this._entities)

		this._aliveEntityCount++
		this._entities[this._currentCursor] = EMPTY_SIGNATURE
		return this._currentCursor
	}

	// Free ID and reset signature
	destroy(entity: Entity) {
		assertEntity(entity)
		console.assert(entity in this._entities, "Entity doesn't exist.")
		this._aliveEntityCount--
		delete this._entities[entity]
	}

	setSignature(entity: Entity, signature: Signature) {
		assertEntity(entity)
		this._entities[entity] = signature
	}

	getSignature(entity: Entity): Signature {
		assertEntity(entity)
		console.assert(entity in this._entities, "Entity doesn't exist.")
		return this._entities[entity]
	}
}
