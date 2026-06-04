import php from 'php-in-js'

import { LOGIN_NOT_REDIRECTABLE } from './constants'
import router from '@/router'

/**
 * Regroupe un tableau d'objet par cle
 */
export function groupBy<T extends Record<string, any>>(array: T[], key: keyof T): Record<string, T[]> {
	return array.reduce(
		function (r, a) {
			const keyValue = a[key] as string
			r[keyValue] = r[keyValue] || []
			r[keyValue].push(a)
			return r
		},
		{} as Record<string, T[]>,
	)
}

/**
 * Determine l'url complete d'une route en fonction de son path
 */
export function resolveRoutePath(to: string | { name?: string; path?: string; query?: Record<string, any> }): string {
	const routeObj: { name?: string; path?: string; query?: Record<string, any> } = php.is_string(to)
		? { path: to as string }
		: (to as { name?: string; path?: string; query?: Record<string, any> })

	return router.resolve(routeObj).href
}

/**
 * Verifie si l'url courrante peut etre redirigée vers le login ou pas
 */
export function isLoginRedirectable(): boolean {
	const currentUrl = php.trim(window.location.pathname, '/')

	for (const path of LOGIN_NOT_REDIRECTABLE) {
		if (currentUrl.startsWith(path)) {
			return false
		}
	}

	return true
}
