import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'

import type { MiddlewareContext, MiddlewareFunction } from '@/types/kernel'

import pushGlobal from './global'

/**
 * Executeur des middlewares
 */
export default function (router: Router) {
	return function (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> | void {
		const metaMiddlewares = to.meta.middlewares || to.meta.middleware || []
		let middlewares = Array.isArray(metaMiddlewares) ? (metaMiddlewares as MiddlewareFunction[]) : [metaMiddlewares as MiddlewareFunction]

		middlewares = pushGlobal({ from, next, to }, middlewares)

		if (!middlewares.length) {
			return next()
		}
		const context: MiddlewareContext = {
			from,
			next,
			router,
			to,
		}

		return middlewares[0]!({
			...context,
			next: pipeline(context, middlewares, 1),
		})
	}
}

/**
 * Pipeline d'execution de middlewares
 *
 * @param {object} context
 * @param {Function[]} middlewares
 * @param {Number} index
 */
function pipeline(context: MiddlewareContext, middlewares: MiddlewareFunction[], index: number): NavigationGuardNext {
	// eslint-disable-next-line prefer-destructuring
	const nextMiddleware = middlewares[index]

	if (!nextMiddleware) {
		return context.next
	}

	return () => {
		const nextPipeline = pipeline(context, middlewares, index + 1)

		nextMiddleware({ ...context, next: nextPipeline })
	}
}
