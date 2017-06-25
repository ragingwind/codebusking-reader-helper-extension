/* global window, document */

let originTarget
let originRect

function forceFont() {
	const style = document.createElement('style')
	style.type = 'text/css'
	style.appendChild(document.createTextNode(`
		main {
			font-family: robust !important;
		}

		main * {
			font-family: inherit !important;
		}
	`))
	document.head.appendChild(style)
}

function forceZIndex() {
	document.querySelectorAll('figure').forEach((e, i) => {
		e.style['z-index'] = i > 0 ? 10 : 1000
	})
}

function forceScroll() {
	window.addEventListener('scroll', handleFigureUpdate)
}

function styleFigure(target, rect) {
	const scrollY = window.scrollY
	const boundary = rect.top - 20

	if (target.style.position !== 'fixed' && scrollY > boundary) {
		target.style.position = 'fixed'
		target.style.top = `20px`
		target.style.left = `${Number(rect.left)}px`
		target.style.width = `${Number(rect.width)}px`
		target.style.height = `${Number(rect.height)}px`
		target.style['z-index'] = 1000
	} else if (target.style.position === 'fixed' && scrollY < boundary) {
		target.style.position = ''
		target.style.top = ''
		target.style.left = ''
		target.style['z-index'] = ''
	}
}

function handleFigureUpdate() {
	if (isRootPage()) {
		originTarget = undefined
		originRect = undefined
	} else {
		if (!originTarget) {
			originTarget = document.querySelector('figure .progressiveMedia')
			if (originTarget) {
				originRect = originTarget.getClientRects()[0]
			}
		}

		if (originRect) {
			window.requestAnimationFrame(() => {
				forceZIndex()
				styleFigure(originTarget, originRect)
			})
		}
	}
}

function isRootPage() {
	return window.location.pathname === '/'
}

document.addEventListener('DOMContentLoaded', () => {
	forceFont()
	forceScroll()
})
