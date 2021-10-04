import { Entity, ComponentType, ComponentName, MAX_COMPONENTS } from './Types'

export class ComponentFactory {
	private _registredComponent: { [key: ComponentName]: number }
	/*
	_componentsMap: {
		Sprite: {
			1: {src:'e'},
			2: {src:'b'}
		}
	}
	*/
	private _componentsMap: { [key: ComponentName]: { [key: Entity]: Object } }
	private _currentCursor: number

	constructor() {
		this._registredComponent = {}
		this._componentsMap = {}
		this._currentCursor = 0
	}

	private get _registredComponentCount() {
		return Object.keys(this._registredComponent).length
	}

	private _getComponentMap(typeName: ComponentName) {
		console.assert(typeName in this._registredComponent, 'Component not registered.')
		return this._componentsMap[typeName]
	}

	create(typeName: ComponentName) {
		console.assert(this._registredComponentCount < MAX_COMPONENTS, 'Entity limit reached.')
		console.assert(!(typeName in this._registredComponent), 'Component already registred.')
		while (Object.values(this._registredComponent).some((a) => a === this._currentCursor)) {
			this._currentCursor++
			if (this._currentCursor >= MAX_COMPONENTS) this._currentCursor = 0
		}
		this._registredComponent[typeName] = this._currentCursor
		this._componentsMap[typeName] = {}
	}

	exist(typeName: ComponentName): boolean
	exist(entity: Entity, typeName: ComponentName): boolean
	exist(entityOrTypeName: Entity | ComponentName, typeName?: ComponentName) {
		if (typeName !== undefined) {
			return entityOrTypeName in this._getComponentMap(typeName)
		} else {
			return entityOrTypeName in this._registredComponent
		}
	}

	getType(typeName: ComponentName): ComponentType {
		console.assert(typeName in this._registredComponent, 'Component not registered.')
		return 0b1 << this._registredComponent[typeName]
	}

	assign(entity: Entity, component: Object) {
		this._getComponentMap(component.constructor.name)[entity] = component
	}

	unassign(entity: Entity, typeName: ComponentName) {
		const componentMap = this._getComponentMap(typeName)
		console.assert(entity in componentMap, "Entity doesn't have this component.")
		if (entity in componentMap) {
			delete componentMap[entity]
		}
	}

	get(entity: Entity, typeName: ComponentName) {
		const componentMap = this._getComponentMap(typeName)
		console.assert(entity in componentMap, "Entity doesn't have this component.")
		return componentMap[entity]
	}

	onEntityDestroy(entity: Entity) {
		for (const typeName in this._componentsMap) {
			this.unassign(entity, typeName)
		}
	}
}
