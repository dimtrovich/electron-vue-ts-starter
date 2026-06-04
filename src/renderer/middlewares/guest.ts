import type { MiddlewareContext } from '@/types/kernel'
import { useAuthStore } from '@/stores/auth.store'

export default function ({ from, next }: MiddlewareContext): void {
	if (useAuthStore().isLoggedIn()) {
		if (from.name) {
			return next({ name: from.name as string })
		}
		if (from.path) {
			return next(from.path)
		}

		return next({ name: 'home' })
	}

	return next()
}
