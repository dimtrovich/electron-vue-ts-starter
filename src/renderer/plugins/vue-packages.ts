import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import type { App } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'

import { createHead } from '@unhead/vue/client'

import { createPinia, type Pinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import { APP_ID, APP_NAME, APP_VERSION } from '@/utils/constants'

import { findLocale } from './i18n'
import router from '../router'

export default function (app: App): App {
	app.use(createBootstrap())

	const head = createHead({
		init: [
			{
				htmlAttrs: { lang: findLocale() },
				title: APP_NAME,
				titleTemplate: `%s | ${APP_NAME} - ${APP_VERSION}`,
			},
		],
	})
	app.use(head)

	const pinia: Pinia = createPinia()
	pinia.use(createPersistedState({ key: (id: string) => `${APP_ID}.${id}` }))
	app.use(pinia)

	app.use(router)

	return app
}
