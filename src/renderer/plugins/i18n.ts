/* eslint-disable @typescript-eslint/no-explicit-any */
import { createI18n, type Composer, type I18n, type I18nOptions } from 'vue-i18n'
import type { App } from 'vue'

import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@/utils/constants'

import { $storage } from './storage'

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
	$storage.cookie.set('locale', language)
	document.querySelector('html')?.setAttribute('lang', language)

	i18n.global.locale.value = language
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
	let lang = $storage.cookie.get('locale') as string

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
	const files = import.meta.glob('../locales/*.ts', { eager: true })

	Object.entries(files).forEach(([path, definition]) => {
		const locale = path.split('/').at(-1)!.replace('.ts', '')
		if (!messages[locale]) {
			messages[locale] = {}
		}
		const message = (definition as any)?.default
		messages[locale] = { ...messages[locale], ...message }
	})

	return messages
}
