import { EntityFactory } from './EntityFactory'
import { ComponentFactory } from './ComponentFactory'
import { SystemFactory } from './SystemFactory'
import { Entity, ComponentType, Type, Component } from './Types'

export class Coordinator {
	private _entityFactory: EntityFactory
	private _componentFactory: ComponentFactory
	private _systemFactory: SystemFactory

	constructor() {
		this._entityFactory = new EntityFactory()
		this._componentFactory = new ComponentFactory(this._entityFactory)
		this._systemFactory = new SystemFactory()
	}

	createEntity(): Entity {
		return this._entityFactory.create()
	}

	destroyEntity(entity: Entity) {
		this._entityFactory.destroy(entity)
		// this._componentFactory.onEntityDestroy(entity)
		// this._systemFactory.onEntityDestroy(entity);
	}

	registerComponent(componentClass: Type<Component>, checkIfExist = false) {
		window.DEBUG && console.log('Register component:', componentClass.name)
		if (!checkIfExist || !this._componentFactory.exist(componentClass)) {
			this._componentFactory.create(componentClass)
		}
	}

	assignComponent<T extends ComponentType>(entity: Entity, component: T) {
		this._componentFactory.assign(entity, component)
		// _systemFactory->entitySignatureChanged(entity, actual);
		// return this._componentFactory.get(entity, component.constructor.name)
		return component
	}

	assignComponents<T extends ComponentType>(entity: Entity, components: T[]) {
		const length = components.length
		for (let index = 0; index < length; index++) {
			this.assignComponent(entity, components[index])
		}
		return components
	}

	//template <typename T>
	//void unassignComponent(ecs::Entity entity) {
	//    _componentFactory->unassign<T>(entity);
	//    ecs::Signature actual = _entityFactory->getSignature(entity);
	//    actual.set(_componentFactory->getType<T>(), false);
	//    _entityFactory->setSignature(entity, actual);
	//    _systemFactory->entitySignatureChanged(entity, actual);
	//}

	// template <typename T>
	// T &getComponent(ecs::Entity entity) {
	//     return _componentFactory->get<T>(entity);
	// }

	// template <typename T>
	// bool hasComponent(ecs::Entity entity) {
	//     return _componentFactory->exist<T>(entity);
	// }

	// template <typename T>
	// ecs::ComponentType getComponentType() {
	//     return _componentFactory->getType<T>();
	// }

	// registerSystem() {
	//     return this._systemFactory.create<T>();
	// }

	// template <typename T>
	// void setSystemSignature(ecs::Signature signature) {
	//     _systemFactory->assign<T>(signature);
	// }
}
