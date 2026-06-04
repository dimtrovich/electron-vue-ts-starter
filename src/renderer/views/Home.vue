<template>
	<b-container class="home">
		<h1>Home Page</h1>

		<p>
			Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere ducimus molestias ut reprehenderit quo,
			esse in tempore omnis dolores.
			Laborum voluptatem amet sit quibusdam excepturi. Quaerat similique vel eius voluptatem.
		</p>
	</b-container>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';

defineOptions({ name: 'HomePage' })

useHead({
	title: 'Home page',
})
</script>
