import type { App } from 'vue'
import php from 'php-in-js'

export const $asset = (path: string): string => new URL(`../assets/${path}`, import.meta.url).href
export const $php = php
export const $public = (path: string): string =>
	`${$php.trim(window.location.origin, '/')}/${$php.trim(path, '/')}`

export default function (app: App): App {
	app.use({
		install(app: App) {
			app.config.globalProperties.$asset = $asset
			app.config.globalProperties.$public = $public
			app.config.globalProperties.$php = $php
		},
	})

	return app
}
