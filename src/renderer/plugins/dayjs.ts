/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs, { Dayjs } from 'dayjs'
import type { App } from 'vue'

import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import 'dayjs/locale/fr'
import 'dayjs/locale/en'

import { APP_TIMEZONE, AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@/utils/constants'

import { $i18n } from './i18n'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(APP_TIMEZONE)

dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(relativeTime)

const { locale } = $i18n
if (!AVAILABLE_LOCALES.includes(locale.value)) {
	locale.value = DEFAULT_LOCALE
}
dayjs.locale(locale.value)

let userTimezone: string = APP_TIMEZONE

export const setUserTimezone = (timezone: string): void => {
	userTimezone = timezone
}

export const $dayjs = (...args: any[]): Dayjs =>
	dayjs(...args)
		.tz(userTimezone)
		.locale(document.querySelector('html')?.getAttribute('lang') || 'fr')
export const { duration: $duration } = dayjs

// Déclarez l'interface pour l'objet dayjs étendu
export interface ExtendedDayjs {
	$dayjs: (...args: any[]) => Dayjs
	$duration: any
	setUserTimezone: (timezone: string) => void
}

export default function (app: App): App {
	app.use({
		install(app: App) {
			app.config.globalProperties.$dayjs = $dayjs
			app.config.globalProperties.$duration = $duration
			app.config.globalProperties.dayjs = dayjs
		},
	})

	return app
}
