<template>
	<b-container class="home">
		<h1>{{ $t('about.title') }}</h1>
    	<p>{{ $t('about.body') }}</p>

		<div class="info-list">
			<div v-for="(item, key) in versionInfo" :key="key" class="info-item">
				<span class="info-label">{{ key }}:</span>
				<span class="info-value">{{ item }}</span>
			</div>
		</div>
	</b-container>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed, version as vueVersion } from 'vue'

import { useSharedStore } from '@/stores/shared.store'

defineOptions({ name: 'AboutPage' })

useHead({ title: 'About application' })

const store = useSharedStore()

const versionInfo = computed(() => {
  	const { app, versions, os } = store.shared
  	return {
		'Product': app.name,
		'Version': app.version,
		...(versions ?
		{
			'Vue.js': vueVersion,
			'Node.js': versions?.node,
			'Electron': versions?.electron,
			'Chrome': versions?.chrome,
			'V8': versions?.v8,
		} : {}),
	...(os ? { 'OS': `${os.type} ${os.arch} ${os.release}` } : {})
  }
})
</script>

<style scoped>
.info-list {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.75rem;
	align-items: baseline;
}
.info-item {
	display: contents;
}
.info-label {
	font-weight: 500;
	text-align: right;
	padding-right: 0.5rem 0;
}
.info-value {
	word-break: break-word;
	text-align: left;
}
</style>
