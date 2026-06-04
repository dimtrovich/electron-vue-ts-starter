import type { App, Component } from 'vue'

export default function (app: App): App {
	const files = import.meta.glob('../layouts/**/*.vue', { eager: true })

	Object.entries(files).forEach(([, layout]) => {
		const lay = layout as { default?: Component }
		if (lay?.default?.name) {
			app.component(lay.default.name, lay.default)
		}
	})

	return app
}
