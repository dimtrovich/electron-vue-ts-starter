/**
 * URL de base de l'API
 */
export const API_URL: string = import.meta.env.DEV
	? import.meta.env.API_URL || window.location.origin + '/api'
	: import.meta.env.API_PROD_URL || import.meta.env.API_URL || window.location.origin + '/api'

/**
 * Nom de l'application
 */
export const APP_NAME: string = import.meta.env.APP_NAME || __APP_NAME__ || 'Vue3 + TypeScript Starter Kit'

/**
 * Version de l'application
 */
export const APP_VERSION: string = import.meta.env.APP_VERSION || __APP_VERSION__ || '1.0.0'

/**
 * ID de l'application
 */
export const APP_ID: string = (import.meta.env.APP_ID || APP_NAME.toLowerCase()).replace(/\s/g, '')

/**
 * Liste des langues autorisées
 */
export const AVAILABLE_LOCALES: string[] = (import.meta.env.AVAILABLE_LOCALES || 'fr,en').split(',')

/**
 * Langue par défaut
 */
export const DEFAULT_LOCALE: string = import.meta.env.DEFAULT_LOCALE || 'en'

/**
 * Fuseau horaire par defaut de l'application
 */
export const APP_TIMEZONE: string = import.meta.env.DEV ? import.meta.env.APP_TIMEZONE || 'Africa/Douala' : 'Africa/Douala'

/**
 * Routes qui utiliseront le layout 'empty'
 */
export const ROUTES_EMPTY_LAYOUT: string[] = import.meta.env.ROUTES_EMPTY_LAYOUT
	? import.meta.env.ROUTES_EMPTY_LAYOUT.split(',')
	: ['login', 'register', 'signin', 'signup', 'init', 'reset-password']

/**
 * Chemin d'acces des pages qui ne peuvent pas etre redirigée vers la page de login
 */
export const LOGIN_NOT_REDIRECTABLE: string[] = import.meta.env.LOGIN_NOT_REDIRECTABLE
	? import.meta.env.LOGIN_NOT_REDIRECTABLE.split(',')
	: ['login', 'register', 'signin', 'signup', 'init', 'reset-password']

/**
 * Chemin du login vers l'api
 */
export const API_LOGIN_PATH: string = import.meta.env.API_LOGIN_PATH || 'auth/login'

/**
 * Chemin du register vers l'api
 */
export const API_REGISTER_PATH: string = import.meta.env.API_REGISTER_PATH || 'auth/register'

/**
 * Chemin pour recuperer l'utilisateur actuellement connecter
 */
export const API_AUTH_USER_PATH: string = import.meta.env.API_AUTH_USER_PATH || 'auth/user'

/**
 * Nombre de minutes d'inactivite de l'utilisateur avant la deconnexion automatique
 */
export const INACTIVE_SESSION_TIMEOUT: number = import.meta.env.INACTIVE_SESSION_TIMEOUT ? parseInt(import.meta.env.INACTIVE_SESSION_TIMEOUT) : 5

export const IS_ELECTRON: boolean = !!window.electron
export const IS_DEV: boolean      = window.context ? window.context.env.NODE_ENV === 'development' : (import.meta.env ? import.meta.env.DEV : false)

