import { watch, type App } from 'vue'
import { createPinia, type Pinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import { APP_ID, IS_ELECTRON } from '@/utils/constants'
import { useSharedStore } from '@/stores/shared.store'

export default function (app: App): App {
	const pinia: Pinia = createPinia()
	pinia.use(createPersistedState({ key: (id: string) => `${APP_ID}.${id}` }))

	if (IS_ELECTRON) {
		watch(pinia.state, (state) => {
			if (state.shared) {
				["settings", "shared"].forEach((key) => {
					const value = JSON.parse(JSON.stringify(state.shared[key]))
					window.electron.ipcRenderer.invoke('set', key, value)
				})
			}
		}, { deep: true })

		window.electron.ipcRenderer.on('changeed', (event, key, value) => {
			if (['settings', 'shared'].includes(key)) {
				const store = useSharedStore()
				store.update({ key, value });
			}
		});
	}

	app.use(pinia)

	return app
}
