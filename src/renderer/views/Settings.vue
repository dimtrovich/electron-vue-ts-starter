<template>
	<b-container>
		<h1>{{ $t('settings.title') }}</h1>

		<b-form>
			<b-form-group :label="$t('settings.language')">
				<b-form-select
					v-model="sharedStore.settings.language"
					:options="availableLanguages"
					@update:model-value="(val) => sharedStore.changeLocale(val)"
				></b-form-select>
			</b-form-group>

			<b-form-group :label="$t('settings.theme')">
				<b-form-select v-model="sharedStore.settings.theme" :options="themeOptions"></b-form-select>
			</b-form-group>

			<br>
			<b-form-checkbox switch v-model="sharedStore.settings.roundedWindow"
				@update:model-value="val => RequiresRestartToApply('settings.roundedWindow', val)">
				{{ $t('settings.roundedWindow') }}
			</b-form-checkbox>
		</b-form>
	</b-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useSharedStore } from '@/stores/shared.store';
import { IS_ELECTRON } from '@/utils/constants';
import { $confirm } from '@/utils/alerts';
import { $i18n, $t } from '@/plugins/i18n';

const sharedStore = useSharedStore()

const availableLanguages = $i18n.availableLocales

const themeOptions = computed(() => ([
	{ value: 'dark', text: $t('settings.themeOptions.dark') },
	{ value: 'light', text: $t('settings.themeOptions.light') },
]))

const RequiresRestartToApply = async (key, value) => {
  	if (!IS_ELECTRON) {
		return sharedStore.update({ key, value });
	}

  	const isConfirmed = await $confirm($t('settings.restartConfirm.message'), {
		title: $t('settings.restartConfirm.title'),
		confirmButtonText: $t('settings.restartConfirm.confirm'),
		cancelButtonText: $t('settings.restartConfirm.cancel'),
	})

  	if (isConfirmed) {
		  await sharedStore.update({ key, value });
		  await window.electron.ipcRenderer.invoke('restartApp');
	}
};

</script>
