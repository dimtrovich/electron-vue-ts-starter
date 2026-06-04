import type { App } from 'vue'

export default function (app: App): App {
	const files = import.meta.glob('./**/*.ts', { eager: true })

	Object.entries(files).forEach(([, definition]) => {
		const plugin = definition as { default: (app: App) => App }
		app = plugin.default(app)
	})

	return app
}
