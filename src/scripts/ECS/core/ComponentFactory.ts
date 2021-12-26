import { Entity, ComponentName, ComponentID, ComponentType, MAX_COMPONENTS, Type, Component } from './Types'
import { EntityFactory } from './EntityFactory'

export class ComponentFactory {
	private _registredComponent: { [key: ComponentID]: ComponentName }
	private _currentCursor: number
	private _entityFactoryRef: EntityFactory

	constructor(entityFactoryRef: EntityFactory) {
		this._registredComponent = {}
		this._currentCursor = 0
		this._entityFactoryRef = entityFactoryRef
	}

	private get _registredComponentCount() {
		return Object.keys(this._registredComponent).length
	}

	create(componentClass: Type<Component>) {
		const componentName = componentClass.name
		window.DEBUG && console.assert(this._registredComponentCount < MAX_COMPONENTS, 'Entity limit reached.')
		window.DEBUG &&
			console.assert(
				Object.values(this._registredComponent).every((s) => s !== componentName),
				'Component already registred.'
			)
		do {
			this._currentCursor++
			if (this._currentCursor >= Number.MAX_SAFE_INTEGER) {
				this._currentCursor = 1
			}
		} while (this._registredComponent[this._currentCursor] !== undefined)

		this._registredComponent[this._currentCursor] = componentName
		;(<any>componentClass).type = this._currentCursor
	}

	exist(componentClass: Type<Component>): boolean
	exist(typeName: ComponentID): boolean
	exist(typeOrComponent: ComponentID | Type<Component>) {
		if (typeof typeOrComponent === 'number') {
			return this._registredComponent[typeOrComponent] !== undefined
		}
		return Object.values(this._registredComponent).some((s) => s === typeOrComponent.name)
	}

	assign<T extends ComponentType>(entity: Entity, component: T) {
		const components = this._entityFactoryRef.get(entity)
		const typeID: number = (<any>component.constructor).type
		window.DEBUG && console.assert(typeof typeID === 'number', 'Component not registered.')
		components[typeID] = component
		return component
	}

	/*
	getType(typeName: ComponentName): ComponentType {
		window.DEBUG && console.assert(typeName in this._registredComponent, 'Component not registered.')
		return 0b1 << this._registredComponent[typeName]
	}

	assign(entity: Entity, component: Object) {
		this._getComponentMap(component.constructor.name)[entity] = component
	}

	unassign(entity: Entity, typeName: ComponentName) {
		const componentMap = this._getComponentMap(typeName)
		window.DEBUG && console.assert(entity in componentMap, "Entity doesn't have this component.")
		if (entity in componentMap) {
			delete componentMap[entity]
		}
	}

	get(entity: Entity, typeName: ComponentName) {
		const componentMap = this._getComponentMap(typeName)
		window.DEBUG && console.assert(entity in componentMap, "Entity doesn't have this component.")
		return componentMap[entity]
	}

	onEntityDestroy(entity: Entity) {
		for (const typeName in this._componentsMap) {
			this.unassign(entity, typeName)
		}
	}
	*/
}
