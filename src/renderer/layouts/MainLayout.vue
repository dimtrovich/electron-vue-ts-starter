<template>
	<div class="page">
		<app-header />
		<sidebar />
		<div class="main-content app-content">
			<div class="container-fluid">
				<slot />
			</div>
		</div>
		<app-footer />
	</div>
</template>

<script setup lang="ts">
import AppFooter from './partials/Footer.vue'
import AppHeader from './partials/Header.vue'
import Sidebar from './partials/Sidebar.vue'

defineOptions({ name: 'MainLayout' })
</script>

<style></style>
