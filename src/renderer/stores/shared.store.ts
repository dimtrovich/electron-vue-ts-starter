/* eslint-disable prefer-destructuring */
/* eslint-disable sort-keys */
import { defineStore } from 'pinia'
import { cloneDeep, merge } from 'lodash-es'
import { setProperty } from 'dot-prop'

import { IS_ELECTRON } from '@/utils/constants'
import preset from '#/store/preset.js'
import { changeLanguage } from '@/plugins/i18n'

const state = cloneDeep<Record<string, any>>(preset)
if (IS_ELECTRON) {
	merge(state, await window.electron.ipcRenderer.invoke('get', 'state', {}))
}

export const useSharedStore = defineStore('shared', {
	state: () => ({ ...state }),
	actions: {
    	set({ key, value }) {
      		setProperty(this.$state, key, value)
    	},

    	update(option) {
      		this.set(option)
    	},

		changeLocale(language: string) {
			changeLanguage(language)
			this.settings.language = language
		},
  	}
})
