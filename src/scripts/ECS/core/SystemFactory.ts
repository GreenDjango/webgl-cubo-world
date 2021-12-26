import { Entity, SystemName } from './Types'

export class System {
	constructor() {}
}

export class SystemFactory {
	private _systems: { [key: string]: System }

	constructor() {
		this._systems = {}
	}
	/*
	create(typeName: SystemName) {
		// console.assert(this._registredComponentCount < MAX_COMPONENTS, 'Entity limit reached.')
		window.DEBUG && console.assert(!(typeName in this._systems), 'System already registred.')
		std::shared_ptr<T> system = std::shared_ptr<T>(new T());
		this._systems[typeName] = system;
		return system;
	}

    // template <typename T>
    assign(signature : Signature) {
        const char *typeName = typeid(T).name();
        assert(_systems.find(typeName) != _systems.end() && "System used before registered.");
        _signatures.insert({ typeName, signature });
    }

    onEntityDestroy(entity : Entity) {
        for (auto const &pair : _systems) {
            auto const &system = pair.second;
            system->entites.remove(entity);
        }
    }

    entitySignatureChanged(entity : Entity, Signature entitySignature) {
        for (auto const &pair : _systems) {
            auto const &type = pair.first;
            auto const &system = pair.second;
            auto const &systemSignature = _signatures[type];

            if ((entitySignature & systemSignature) == systemSignature) {
                if (std::find(system->entites.begin(), system->entites.end(), entity) == system->entites.end())
                    system->entites.push_back(entity);
            } else
                system->entites.remove(entity);
        }
    }*/
}
