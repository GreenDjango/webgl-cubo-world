import { EntityFactory, writeSignature } from './EntityFactory'
import { ComponentFactory } from './ComponentFactory'
import { SystemFactory } from './SystemFactory'
import { Entity, ComponentName } from './Types'

/*
  ├── EntityFactory
  │   ├── Entities
  │   └── Signatures
  ├── ComponentFactory
  │   ├── ???
  │   └── ???
  └── SystemFactory
*/

export class Coordinator {
	private _entityFactory: EntityFactory
	private _componentFactory: ComponentFactory
	private _systemFactory: SystemFactory

	constructor() {
		this._entityFactory = new EntityFactory()
		this._componentFactory = new ComponentFactory()
		this._systemFactory = new SystemFactory()
	}

	createEntity(): Entity {
		return this._entityFactory.create()
	}

	destroyEntity(entity: Entity) {
		this._entityFactory.destroy(entity)
		this._componentFactory.onEntityDestroy(entity)
		// this._systemFactory.onEntityDestroy(entity);
	}

	registerComponent(typeName: ComponentName, checkIfExist = false) {
		if (!checkIfExist || !this._componentFactory.exist(typeName)) {
			this._componentFactory.create(typeName)
		}
	}

	// Variadic arg
	// template <typename First, typename... Args>
	// void assigns(ecs::Entity entity, First first, Args... args) {
	//     assigns(entity, first);
	//     assigns(entity, args...);
	// }
	// template <typename Args>
	// void assigns(ecs::Entity entity, Args args) {
	//     assignComponent<Args>(entity, args);
	// }
	// --

	assignComponent(entity: Entity, component: Object) {
		this._componentFactory.assign(entity, component)
		const actualSignature = this._entityFactory.getSignature(entity)
		const newSignature = writeSignature(actualSignature, this._componentFactory.getType(component.constructor.name))
		this._entityFactory.setSignature(entity, newSignature)
		// _systemFactory->entitySignatureChanged(entity, actual);
		return this._componentFactory.get(entity, component.constructor.name)
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
