
<template>
	<component :is="layout || 'div'">
		<router-view />
	</component>
</template>

<script setup lang="ts">
import { provide, shallowRef } from 'vue'

import router from '@/router'

const layout = shallowRef('div')
router.afterEach((to) => {
	const l = to.meta.layout || 'empty'
	layout.value = l ? `${l}-layout` : 'div'
})
provide('app:layout', layout)
</script>

