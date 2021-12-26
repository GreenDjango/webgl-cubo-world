export function getByClass<T extends Element>(name: string, parent?: HTMLElement | null): HTMLCollectionOf<T> {
	return (parent || document).getElementsByClassName(name) as any
}

export function getById<T extends HTMLElement>(id: string): T {
	return document.getElementById(id) as any
}