import type { App } from 'vue'
import php from 'php-in-js'

import { IS_DEV, IS_ELECTRON } from '@/utils/constants'

export const $asset = (path: string): string => new URL(`../assets/${path}`, import.meta.url).href
export const $php = php
export const $public = (path: string): string => {
	let base = $php.trim(window.location.origin, '/')
	if (IS_ELECTRON && !IS_DEV) {
		base = '.'
	}

	return `${base}/${$php.trim(path, '/')}`
}
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
