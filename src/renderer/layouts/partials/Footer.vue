<template>
	<footer class="py-3 border-t border-primary-500">
		<b-container class="container">
			<div class="text-center">
				Copyrights {{ $dayjs().format('YYYY') }}
			</div>
		</b-container>
	</footer>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppFooter' })
</script>
