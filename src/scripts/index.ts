// import { doBenchmark } from './benchmark'
// return setTimeout(doBenchmark, 100)

import { Game } from './game'
import { getByClass, getById } from './utils'

// --- GLOBAL
declare global {
	interface Window {
		DEBUG: boolean
		CONFIG: {
			renderDistance: 0 | 1 | 2 | 3 // 1x1 | 3x3 | 5x5 | 7x7 chunks (x*2+1)²
			fov: number // Camera frustum vertical field of view
			tick: 25 | 50 | 100 | 200 // 40 | 20 | 10 | 5 tick/s
		}
	}
}

window.DEBUG = true
window.CONFIG = {
	renderDistance: 3,
	fov: 75,
	tick: 200,
}

async function main() {
	const loadHTML = getById('overlay-load') 
	const menuHTML = getById('overlay-menu')
	const optionsHTML = getById('overlay-options')
	const creditsHTML = getById('overlay-credits')
	const pauseHTML = getById('overlay-pause')
	const gameHTML = getById('game')
	const loadingBarHTML = getById('loading-bar-1')

	const game = new Game(gameHTML)

	setTimeout(async () => {
		await game.init(loadingBarHTML)
		await new Promise((r) => setTimeout(r, 600))
		loadHTML.style.display = 'none'
		menuHTML.style.display = ''
	}, 50)

	document.onkeydown = (ev: KeyboardEvent) => {
		if (!game.isRun && !game.isPause) return
		if (game.isRun) {
			if (ev.key === 'Escape') {
				game.pause()
				pauseHTML.style.display = ''
			}
		} else if (game.isPause) {
			if (ev.key === 'Escape') {
				game.resume()
				pauseHTML.style.display = 'none'
			}
		}
	}

	getById<HTMLButtonElement>('play-btn').onclick = (ev: MouseEvent) => {
		ev.stopPropagation()
		gameHTML.style.display = ''
		menuHTML.style.display = 'none'
		pauseHTML.style.display = 'none'
		game.run()
	}

	getById<HTMLButtonElement>('options-btn').onclick = (ev: MouseEvent) => {
		ev.stopPropagation()
		optionsHTML.style.display = ''
		menuHTML.style.display = 'none'
	}

	getById<HTMLButtonElement>('credits-btn').onclick = (ev: MouseEvent) => {
		ev.stopPropagation()
		creditsHTML.style.display = ''
		menuHTML.style.display = 'none'
	}

	getById<HTMLButtonElement>('back-btn').onclick = (ev: MouseEvent) => {
		ev.stopPropagation()
		menuHTML.style.display = ''
		creditsHTML.style.display = 'none'
	}

	getById<HTMLInputElement>('fov-slider').oninput = function (ev: Event) {
		ev.stopPropagation()
		const input = this as HTMLInputElement
		const inputCursor = getByClass('slider-cursor', input.parentElement)[0] as HTMLInputElement
		inputCursor.value = input.value
		const inputLabel = getByClass('slider-label', input.parentElement)[0] as HTMLSpanElement
		inputLabel.innerText = `FOV: ${input.value === '70' ? 'normal' : input.value}`
		console.log(input.valueAsNumber)
	}

	getById<HTMLButtonElement>('done-btn').onclick = (ev: MouseEvent) => {
		ev.stopPropagation()
		menuHTML.style.display = ''
		optionsHTML.style.display = 'none'
	}

	getById<HTMLButtonElement>('resume-btn').onclick = (ev: MouseEvent) => {
		ev.stopPropagation()
		game.resume()
		pauseHTML.style.display = 'none'
	}

	getById<HTMLButtonElement>('quit-btn').onclick = (ev: MouseEvent) => {
		ev.stopPropagation()
		game.stop()
		menuHTML.style.display = ''
		pauseHTML.style.display = 'none'
		gameHTML.style.display = 'none'
	}
}

document.addEventListener('DOMContentLoaded', (event) => {
	window.DEBUG && console.log('DOMContentLoaded')
	main()
})
