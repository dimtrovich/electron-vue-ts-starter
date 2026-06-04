import type { App, Component } from 'vue'

export default function (app: App): App {
	const files = import.meta.glob('../components/app/**/*.vue', { eager: true })

	Object.entries(files).forEach(([, component]) => {
		const comp = component as { default?: Component }
		if (comp?.default?.name) {
			app.component(comp.default.name, comp.default)
		}
	})

	return app
}
