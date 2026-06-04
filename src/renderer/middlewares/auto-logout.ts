/**
 * Middlware pour automatiquement deconnecter l'utilisateur apres une durée d'inactivité
 */

import php from 'php-in-js'

import { $dayjs } from '@/plugins/dayjs'
import type { MiddlewareContext } from '@/types/kernel'
import { useAuthStore } from '@/stores/auth.store'

export default function ({ next }: MiddlewareContext): void {
	const authStore = useAuthStore()

	const { expireAt } = authStore

	if (php.empty(expireAt) || $dayjs().isAfter(expireAt, 'minutes')) {
		authStore.logout()

		return next({ name: 'login' })
	}

	authStore.incrementTimeout()

	return next()
}
