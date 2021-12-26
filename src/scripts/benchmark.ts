export function doBenchmark() {
	console.log('%c--- Benchmark', 'font-weight: bold;background: green;')
	console.time('console.time')
	console.timeEnd('console.time')

	loopRead()
	arrayRead()
	conditionalCheck()
	advanceCheck()
}

function loopRead() {
	const size = 1000000
	const data = new Array(size).fill(1)
	const dataDest = []

	console.log('%c--- Loop', 'font-weight: bold;background: green;')

	console.time('while basic')
	let index = -1
	while (++index < size) {
		//dataDest.push(data[index])
	}
	console.timeEnd('while basic')

	console.time('for basic')
	for (let index2 = 0; index2 < size; index2++) {
		//dataDest.push(data[index2])
	}
	console.timeEnd('for basic')

	console.time('for of')
	for (const val of data) {
		//dataDest.push(val)
	}
	console.timeEnd('for of')

	console.time('for each')
	data.forEach((val) => {
		//dataDest.push(val)
	})
	console.timeEnd('for each')
}

function arrayRead() {
	const size = 100000
	const data = new Array(size).fill(1)
	const data2: any = {}
	const dataDest = []
	data.forEach((_, index) => (data2[index] = 1))

	console.log('%c--- Array', 'font-weight: bold;background: green;')

	console.time('array index')
	{
		let i = 0
		while (i < size) {
			//dataDest.push(data[i])
			i++
		}
	}
	console.timeEnd('array index')

	console.time('object for in')
	{
		for (const key in data2) {
			//dataDest.push(data2[key])
		}
	}
	console.timeEnd('object for in')

	console.time('object Object.keys')
	{
		const tmp = Object.keys(data2)
		let i = 0
		while (i < size) {
			//dataDest.push(data2[tmp[i]])
			i++
		}
	}
	console.timeEnd('object Object.keys')

	console.time('array length')
	for (let index = 0; index < data.length; index++) {}
	console.timeEnd('array length')

	console.time('array store length')
	for (let index = 0; index < size; index++) {}
	console.timeEnd('array store length')

	console.time('array assign asc')
	{
		const array = []
		for (let index = 0; index < size; index++) {
			array[index] = 1
		}
	}
	console.timeEnd('array assign asc')

	console.time('array assign desc')
	{
		const array = []
		for (let index = size - 1; index >= 0; index--) {
			array[index] = 1
		}
	}
	console.timeEnd('array assign desc')

	console.time('object assign asc')
	{
		const obj: any = {}
		for (let index = 0; index < size; index++) {
			obj[index] = 1
		}
	}
	console.timeEnd('object assign asc')

	console.time('object assign desc')
	{
		const obj: any = {}
		for (let index = size - 1; index >= 0; index--) {
			obj[index] = 1
		}
	}
	console.timeEnd('object assign desc')

	{
		const dataSup = new Array(size).fill(1)
		console.time('array set null')
		for (let index = 0; index < size; index++) {
			dataSup[index] = null
		}
		console.timeEnd('array set null')
	}

	{
		const dataSup = { ...new Array(size).fill(1) }
		console.time('object set null')
		for (let index = 0; index < size; index++) {
			dataSup[index] = null
		}
		console.timeEnd('object set null')
	}

	{
		const dataSup = new Array(size).fill(1)
		console.time('array delete asc')
		for (let index = 0; index < size; index++) {
			delete dataSup[index]
		}
		console.timeEnd('array delete asc')
	}

	{
		const dataSup = new Array(size).fill(1)
		console.time('array delete desc')
		for (let index = size - 1; index >= 0; index--) {
			delete dataSup[index]
		}
		console.timeEnd('array delete desc')
	}

	{
		const dataSup = { ...new Array(size).fill(1) }
		console.time('object delete asc')
		for (let index = 0; index < size; index++) {
			delete dataSup[index]
		}
		console.timeEnd('object delete asc')
	}

	{
		const dataSup = { ...new Array(size).fill(1) }
		console.time('object delete desc')
		for (let index = size - 1; index >= 0; index--) {
			delete dataSup[index]
		}
		console.timeEnd('object delete desc')
	}
}

function conditionalCheck() {
	const size = 1000000

	console.log('%c--- Conditional', 'font-weight: bold;background: green;')

	console.time('value in object false')
	{
		const obj = {}
		for (let index = 0; index < size; index++) {
			if (index in obj) true
		}
	}
	console.timeEnd('value in object false')

	console.time('value in object true')
	{
		const obj = { oui: 1 }
		for (let index = 0; index < size; index++) {
			if ('oui' in obj) true
		}
	}
	console.timeEnd('value in object true')

	console.time('value in object big key')
	{
		const obj = { abcdefghijklmnopqrstuvwxyz: 1 }
		for (let index = 0; index < size; index++) {
			if ('abcdefghijklmnopqrstuvwxyz' in obj) true
		}
	}
	console.timeEnd('value in object big key')

	console.time('value in array')
	{
		const arr: any[] = []
		for (let index = 0; index < size; index++) {
			if (index in arr) true
		}
	}
	console.timeEnd('value in array')

	console.time('if value object')
	{
		const obj: any = {}
		for (let index = 0; index < size; index++) {
			if (obj[index] === undefined) true
		}
	}
	console.timeEnd('if value object')

	console.time('if value array')
	{
		const arr: any[] = []
		for (let index = 0; index < size; index++) {
			if (arr[index] === undefined) true
		}
	}
	console.timeEnd('if value array')
}

function advanceCheck() {
	const size = 16 * 16 * 128 * (7 * 7)

	console.log('%c--- Advance', 'font-weight: bold;background: green;')

	console.time('array')
	{
		const arr: any[] = []

		console.time('array assign')
		let i = 0
		while (i < size / 2) {
			arr[i] = {}
			i++
		}
		console.timeEnd('array assign')

		console.time('array check')
		i = 0
		while (i < size) {
			const tmp = arr[i]
			if (tmp === undefined) true
			i++
		}
		console.timeEnd('array check')

		console.time('array delete')
		i = 0
		while (i < size) {
			arr[i] = undefined
			i++
		}
		console.timeEnd('array delete')
	}
	console.timeEnd('array')

	console.time('object')
	{
		const obj: any = {}
		console.time('object assign')
		let i = 0
		while (i < size) {
			obj[i] = {}
			i++
		}
		console.timeEnd('object assign')

		console.time('object check')
		i = 0
		while (i < size) {
			const tmp = obj[i]
			if (tmp === undefined) true
			i++
		}
		console.timeEnd('object check')

		console.time('object delete')
		i = 0
		while (i < size) {
			obj[i] = undefined
			i++
		}
		console.timeEnd('object delete')
	}
	console.timeEnd('object')
}
