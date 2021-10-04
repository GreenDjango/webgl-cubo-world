import { Coordinator, System } from '../core'

export class RenderSystem extends System {
	static create(ecs: Coordinator): RenderSystem {
		// ecs.registerComponentIfNotExist<Sprite>();

		// const renderSystem = ecs.registerSystem<RenderSystem>();
		{
			// ecs::Signature signature;
			// signature.set(ecs.getComponentType<Sprite>());
			// ecs.setSystemSignature<RenderSystem>(signature);
		}
		return new RenderSystem()
	}

	Update(ecs: Coordinator /*, WindowManager *window*/) {
		/*
		for (const entity of this.entites) {
            const render = ecs.getComponent<Sprite>(entity);
            const transform = ecs.getComponent<Transform>(entity);

            render.sprite.setPosition(transform.pos.x, transform.pos.y);
            render.sprite.setScale(transform.scale.x, transform.scale.y);
            render.sprite.setRotation(transform.rot);

            window->draw(render.sprite);

            if (ecs.hasComponent<Text>(entity)) {
                const text = ecs.getComponent<Text>(entity);
                text._text.setPosition(transform.pos.x, transform.pos.y);
                text._text.setScale(transform.scale.x, transform.scale.y);
                text._text.setRotation(transform.rot);

                if (transform.flip.x) {
                    text._text.scale(-1, 1);
                    text._text.move({ text._text.getGlobalBounds().width, 0 });
                }
                window->draw(text._text);
            }
		}
        */
	}
}
