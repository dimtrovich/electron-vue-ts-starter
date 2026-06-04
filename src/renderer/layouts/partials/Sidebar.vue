<template>
	<aside class="app-sidebar"></aside>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue'

defineOptions({ name: 'AppSidebar' })

onMounted(() => {
	initSidebarScrollbar()
})

onUpdated(() => {
	initSidebarScrollbar()
})

function initSidebarScrollbar() {
	//
}
</script>
