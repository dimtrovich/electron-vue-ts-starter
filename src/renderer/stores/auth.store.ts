/* eslint-disable prefer-destructuring */
/* eslint-disable sort-keys */
import { defineStore, getActivePinia } from 'pinia'
import { type RouteLocationNormalizedLoaded } from 'vue-router'

import { API_AUTH_USER_PATH, API_LOGIN_PATH, API_REGISTER_PATH, INACTIVE_SESSION_TIMEOUT } from '@/utils/constants'
import { $axios } from '@/plugins/axios'
import { $dayjs } from '@/plugins/dayjs'
import { $storage } from '@/plugins/storage'
import { resolveRoutePath } from '@/utils/helpers'
import router from '@/router'

interface LastConnected {
	email: string
	date: string
}

interface User {
	email: string
	[key: string]: any
}

interface LoginResponse {
	access_token: string
}

interface AuthResponse {
	user: User
}

interface RegisterCallbackParams {
	router: typeof router
	route: RouteLocationNormalizedLoaded
	response: any
}

export const useAuthStore = defineStore('auth', {
	persist: true,
	state: () => ({
		accessToken: null as string | null,
		expireAt: null as string | null,
		lastConnected: $storage.local.get('last-connected-email') as LastConnected | null,
		user: null as User | null,
	}),
	actions: {
		/**
		 * Defini les informations du dernier utilisateur connecter
		 */
		setLastConnected(email: string): void {
			this.lastConnected = { email, date: $dayjs().toISOString() }
			$storage.local.set('last-connected-email', this.lastConnected)
		},

		/**
		 * Recupere les informations du dernier utilisateur connecter
		 */
		getLastConnected(key: keyof LastConnected | null = null): LastConnected | string | null {
			if (this.lastConnected === null || key === null) {
				return this.lastConnected
			}
			return this.lastConnected[key]
		},

		/**
		 * Incremente la duree de vie de la session
		 */
		incrementTimeout(timeout?: number): void {
			this.expireAt = $dayjs()
				.add(timeout || INACTIVE_SESSION_TIMEOUT, 'minutes')
				.format()
		},

		/**
		 * Inscription
		 *
		 * @param {{[key: string]: any}} data donnees a soumettre
		 */
		async register(data: Record<string, any>, callback?: (params: RegisterCallbackParams) => void): Promise<void> {
			const response = await $axios.post(API_REGISTER_PATH, data)

			if (callback) {
				const route = router.currentRoute.value

				callback({ router, route, response })
			}
		},

		/**
		 * Connexion
		 *
		 * @param {{[key: string]: any}} data donnees a soumettre
		 */
		async login(post: Record<string, any>): Promise<void> {
			// const { result } = (await $axios.post(API_LOGIN_PATH, data)) as LoginResponse
			const { data } = await $axios.post(API_LOGIN_PATH, post)
			const result = data.result as LoginResponse

			this.accessToken = result.access_token

			const route = router.currentRoute.value

			let redirect = route.query.redirect || '/'
			if (typeof redirect === 'string' && ['login'].includes(redirect)) {
				redirect = '/'
			}

			await this.getUser()
			this.incrementTimeout(INACTIVE_SESSION_TIMEOUT)

			window.location.href = resolveRoutePath(redirect as string)
		},

		/**
		 * Deconnexion
		 *
		 * @param {string} [to='login'] Page où sera redirigé l'utilisateur après la deconnexion
		 */
		logout(to: string = 'login', redirect: string | null = null): void {
			if (this.user) {
				this.setLastConnected(this.user.email)
			}

			const pinia = getActivePinia() as any
			if (pinia) {
				pinia._s.forEach((store: any) => store.$reset())
			}

			if (!redirect || $storage.local.get('session_expire')) {
				redirect = router.currentRoute.value.path
				$storage.local.remove('session_expire')
			}

			window.location.href = resolveRoutePath({ name: to, query: { redirect } })
		},

		/**
		 * Récuperation des données de l'utilisateur actuellement connecté
		 */
		async getUser(): Promise<void> {
			const { data } = await $axios.get(API_AUTH_USER_PATH)
			const result = data.result as AuthResponse

			this.user = result.user
		},

		/**
		 * Verifie si l'utilisateur est connecté
		 */
		isLoggedIn(): boolean {
			if (this.user !== null && this.accessToken !== null) {
				return true
			}

			this.user = this.accessToken = null

			return false
		},
	},
})
