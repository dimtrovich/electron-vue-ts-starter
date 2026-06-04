import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import type { App } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'

import { createHead } from '@unhead/vue/client'

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

	app.use(router)

	return app
}
