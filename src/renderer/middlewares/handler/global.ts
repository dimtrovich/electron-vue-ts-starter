/**
 * Enregistre les middlewares qui s'executerons globalement
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

import type { MiddlewareFunction } from '@/types/kernel'

import autoLogout from '../auto-logout'
import checkAuth from '../authenticate'
import checkGuest from '../guest'

interface GlobalContext {
	to: RouteLocationNormalized
	from: RouteLocationNormalized
	next: NavigationGuardNext
}

/**
 *
 * @param {{to: any, from: any, next: function}} params
 * @param {array} middlewares
 * @returns {array}
 */
export default function ({ to }: GlobalContext, middlewares: MiddlewareFunction[]): MiddlewareFunction[] {
	if (to.meta.noAuth !== true) {
		middlewares.unshift(checkAuth, autoLogout)
	} else {
		middlewares.unshift(checkGuest)
	}

	return middlewares
}
