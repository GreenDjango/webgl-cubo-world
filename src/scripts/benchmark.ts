export function doBenchmark() {
	loopRead()
}

function loopRead() {
	const size = 1000000
	const data = new Array(size).fill(1)
	const dataDest = []

	console.log('%c--- Loop', 'font-weight: bold;background: green;')

	console.time('while basic')
	let index = -1
	while (++index < size) {
		dataDest.push(data[index])
	}
	console.timeEnd('while basic')

	console.time('for basic')
	for (let index2 = 0; index2 < size; index2++) {
		dataDest.push(data[index2])
	}
	console.timeEnd('for basic')

	console.time('for of')
	for (const val of data) {
		dataDest.push(val)
	}
	console.timeEnd('for of')

	console.time('for each')
	data.forEach((val) => {
		dataDest.push(val)
	})
	console.timeEnd('for each')
}
