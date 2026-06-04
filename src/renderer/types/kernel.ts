import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'

export interface MiddlewareContext {
	to: RouteLocationNormalized
	from: RouteLocationNormalized
	next: NavigationGuardNext
	router: Router
}

export interface MiddlewareFunction {
	(context: MiddlewareContext): void | Promise<void>
}
