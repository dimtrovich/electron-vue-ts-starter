import { type FluidStorage, init } from 'fluid-storage'
import type { App } from 'vue'

import { APP_ID } from '@/utils/constants'

interface StorageTypes {
	cookie: FluidStorage
	session: FluidStorage
	local: FluidStorage
}

export const storage: StorageTypes = {
	cookie: init(APP_ID, 'cookie'),
	local: init(APP_ID, 'localstorage'),
	session: init(APP_ID, 'sessionstorage'),
}

export const $storage: StorageTypes = storage

export default function (app: App): App {
	app.config.globalProperties.$storage = storage
	app.provide('$storage', storage)

	return app
}
