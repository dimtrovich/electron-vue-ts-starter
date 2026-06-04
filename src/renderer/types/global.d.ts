/* eslint-disable camelcase */
import __electron__ from 'electron'

export {}

declare global {
	const __APP_VERSION__: string
	const __APP_NAME__: string
	const electron: __electron__.App
}
