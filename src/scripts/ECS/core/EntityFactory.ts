import { Entity, ComponentsType, MAX_ENTITIES, assertEntity } from './Types'

export class EntityFactory {
	private _currentCursor: Entity
	// Array of Components, key = entity ID
	private _entities: ComponentsType | undefined[]
	// Total alive entities - used to keep limits
	private _aliveEntityCount: number

	constructor() {
		this._currentCursor = 0
		this._entities = []
		this._aliveEntityCount = 0
	}

	// Take an unused ID
	create(): Entity {
		window.DEBUG && console.assert(this._aliveEntityCount < MAX_ENTITIES, 'Entity limit reached.')
		do {
			this._currentCursor++
			if (this._currentCursor >= Number.MAX_SAFE_INTEGER) {
				this._currentCursor = 1
			}
		} while (this._entities[this._currentCursor] !== undefined)

		this._aliveEntityCount++
		this._entities[this._currentCursor] = {}
		return this._currentCursor
	}

	// Free ID and reset signature
	destroy(entity: Entity) {
		window.DEBUG && assertEntity(entity)
		window.DEBUG && console.assert(this._entities[entity] !== undefined, "Entity doesn't exist.")
		if (window.DEBUG) this._aliveEntityCount--
		this._entities[entity] = undefined
	}

	exist(entity: Entity) {
		window.DEBUG && assertEntity(entity)
		return this._entities[entity] !== undefined
	}

	get(entity: Entity) {
		window.DEBUG && assertEntity(entity)
		window.DEBUG && console.assert(this._entities[entity] !== undefined, "Entity doesn't exist.")
		return this._entities[entity] as ComponentsType
	}

	getIfExist(entity: Entity) {
		window.DEBUG && assertEntity(entity)
		return this._entities[entity]
	}
}
