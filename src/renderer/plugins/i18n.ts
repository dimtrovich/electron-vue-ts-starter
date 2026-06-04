/* eslint-disable @typescript-eslint/no-explicit-any */
import { createI18n, type Composer, type I18n, type I18nOptions } from 'vue-i18n'
import type { App } from 'vue'

import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@/utils/constants'

// import { $storage } from './storage'

const messages = loadLocaleMessages()

export const i18n: I18n = createI18n({
	legacy: false, // vous devez définir `false` pour utiliser l'API de composition
	locale: findLocale(),
	messages,
} as I18nOptions)

export const $i18n = {
	...i18n.global,
	locale: i18n.global.locale,
	t: i18n.global.t,
} as Composer

export const { t: $t } = $i18n

export function changeLanguage(language: string): void {
	// $storage.cookie.set('locale', language)
	document.querySelector('html')?.setAttribute('lang', language)

	i18n.global.locale = language
}

export default function (app: App): App {
	app.use(i18n)

	return app
}


/**
 * Récupère la langue à utiliser par défaut
 *
 * @return {String}
 */
export function findLocale(): string {
	let lang = null // $storage.cookie.get('locale') as string

	if (!lang) {
		lang = window.navigator.language.substr(0, 2).toLowerCase()
	}

	if (!AVAILABLE_LOCALES.includes(lang)) {
		lang = DEFAULT_LOCALE
	}

	return lang
}

function loadLocaleMessages(): Record<string, any> {
	const messages: Record<string, any> = {}
	const files = import.meta.glob('../locales/*.js', { eager: true })

	Object.entries(files).forEach(([path, definition]) => {
		/* const parts = path.split('/')
		const locale: string = parts[2] || DEFAULT_LOCALE
		const namespace = parts.at(-1)!.replace('.json', '')
		if (!messages[locale]) {
			messages[locale] = {}
		}
		if (!messages[locale][namespace]) {
			messages[locale][namespace] = {}
		}
		const message = (definition as any)?.default
		 messages[locale][namespace] = { ...messages[locale][namespace], ...message }
            */
	})

	return messages
}
