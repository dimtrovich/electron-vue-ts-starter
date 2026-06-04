/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
	AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosRequestHeaders,
	type AxiosResponse,
	type AxiosResponseHeaders,
	type InternalAxiosRequestConfig,
	type RawAxiosResponseHeaders,
} from 'axios'
import type { App } from 'vue'
import php from 'php-in-js'

import { $alert } from '@/utils/alerts'
import { API_URL } from '@/utils/constants'
import { isLoginRedirectable } from '@/utils/helpers'
import { useAuthStore } from '@/stores/auth.store'

import { $i18n } from './i18n'
import { $storage } from './storage'

export const statusCodesToHandle: number[] = [400, 401, 404, 406, 409, 422, 428]

interface AxiosErrorWithHandled extends AxiosError {
	handled?: boolean
	errors?: any
	code?: string
	status?: number
}

export interface PaginatedResult<T = any> {
	current_page: number
	data: T[]
	from: number
	last_page: number
	per_page: number
	to: number
	total: number
}

export interface ApiResponse<T = any> {
	code?: string
	message?: string
	messages?: string[]
	errors?: any
	result?: T | T[] | PaginatedResult<T>
}

export interface AxiosApiResponse<T = any, H = object> {
	data: ApiResponse<T>
	status: number
	statusText: string
	headers: (H & RawAxiosResponseHeaders) | AxiosResponseHeaders
}

export interface ApiClientRequest {
	delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<AxiosApiResponse<T>>
	get: <T>(url: string, config?: AxiosRequestConfig) => Promise<AxiosApiResponse<T>>
	post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosApiResponse<T>>
	put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosApiResponse<T>>
}

const config: AxiosRequestConfig = {
	baseURL: API_URL,
	// timeout: 60 * 1000, // Timeout
	// withCredentials: true, // Check cross-site Access-Control
}

const _axios: AxiosInstance = axios.create(config)

_axios.interceptors.request.use(requestInterceptor)

_axios.interceptors.response.use(successInterceptor, errorInterceptor)

export const $axios: ApiClientRequest = {
	delete: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosApiResponse<T>> =>
		_axios.delete(url, config).then((response) => response as unknown as AxiosApiResponse<T>),

	get: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosApiResponse<T>> =>
		_axios.get(url, config).then((response) => response as unknown as AxiosApiResponse<T>),

	post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosApiResponse<T>> =>
		_axios.post(url, data, config).then((response) => response as unknown as AxiosApiResponse<T>),

	put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosApiResponse<T>> =>
		_axios.put(url, data, config).then((response) => response as unknown as AxiosApiResponse<T>),
}

export default function (app: App): App {
	app.use({
		install(Vue: App) {
			;(Vue as any).$axios = $axios
		},
	})

	return app
}

/**
 * Intercepteur de requête axios
 */
function requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
	if (!config.headers) {
		config.headers = {} as AxiosRequestHeaders
	}

	config.headers.Accept = 'application/vnd.api+json'

	const { accessToken } = useAuthStore()

	if (!config.headers.Authorization && accessToken !== null && accessToken !== undefined && accessToken !== '') {
		config.headers.Authorization = `Bearer ${accessToken}`
	}

	return config
}

/**
 * Intercepteur de réponse ok
 */
function successInterceptor(response: AxiosResponse): any {
	return {
		data: response.data,
		headers: response.headers,
		status: response.status,
		statusText: response.statusText,
	} as AxiosApiResponse
}

/**
 * Intercepteur de réponse d'échec
 */
async function errorInterceptor(error: AxiosErrorWithHandled): Promise<never> {
	// Se produit pour les requêtes annulées utilisant axios CancelTokenSource
	if (!error.response) {
		return Promise.reject(error)
	}

	const { response } = error
	const { status } = response!

	let errors: any = ''

	if ((response!.data as ApiResponse).code) {
		error.code = (response!.data as ApiResponse).code
	}

	if (status && statusCodesToHandle.includes(status)) {
		errors = mapErrors(response!.data)
		if (errors === 'Unauthenticated.') {
			errors = $i18n.t('messages.votre_session_est_expiree_veuillez_vous_reconnecter')
			error.handled = true
		}

		// $alert.error(errors)
	}

	if (status === 403) {
		// Forbidden
		errors = $i18n.t('messages.vous_n_etes_pas_autoriser_a_effectuer_cette_action')
		$alert.error(errors)
		error.handled = true
	}

	if (status === 500) {
		// InternalServerError
		errors = $i18n.t('messages.une_erreur_s_est_produite_lors_de_la_requete')
		$alert.error(errors)
		error.handled = true
	}

	if (status === 498) {
		// Token expired
		errors = $i18n.t('messages.votre_session_est_expiree_veuillez_vous_reconnecter')
		$alert.error(errors)
		error.handled = true
	}

	// Créer un nouvel objet d'erreur avec les propriétés souhaitées
	const enhancedError: AxiosErrorWithHandled = {
		...error,
		errors: php.is_string(errors) ? undefined : errors,
		message: php.is_string(errors) ? errors : (response!.data as ApiResponse).message || error.message,
		status,
	}

	if (status && [498].includes(status) && isLoginRedirectable()) {
		$storage.local.set('session_expire', true)

		useAuthStore().logout()
		return Promise.reject(enhancedError)
	}

	return Promise.reject(enhancedError)
}

/**
 *
 * @param {any} data
 * @returns {any}
 */
function mapErrors(data: any): any {
	if ((!data.errors && data.message) || data.messages) {
		return data.message || data.messages?.[0]
	}

	if (php.is_array(data.errors)) {
		const hasStringErrors = typeof data.errors[0] === 'string'

		if (hasStringErrors) {
			return data.errors[0]
		}
	}

	if (php.is_object(data.errors)) {
		const result: Record<string, string> = {}
		for (const key in data.errors) {
			const value = data.errors[key]
			result[key] = (Array.isArray(value) ? value : [value]).join('\n')
		}

		return result
	}

	return data.errors
}
