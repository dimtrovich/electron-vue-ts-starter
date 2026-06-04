/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiddlewareContext } from '@/types/kernel'
import { useAuthStore } from '@/stores/auth.store'

export default async function ({ to, next, router }: MiddlewareContext): Promise<any> {
	if (!useAuthStore().isLoggedIn()) {
		return router.push({ name: 'login', query: { redirect: to.path } })
	}

	return next()
}
