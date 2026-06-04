<template>
	<header class="app-header">
		<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
			<b-container fluid>
				<b-link class="navbar-brand" to="/">Electron + VueJs + TypeScript</b-link>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
					aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<b-link class="nav-link" to="/">{{ $t('app.nav.home') }}</b-link>
						</li>
						<li class="nav-item">
							<b-link class="nav-link" to="/about">{{ $t('app.nav.about') }}</b-link>
						</li>
						<li class="nav-item">
							<b-link class="nav-link" to="/settings">{{ $t('app.nav.settings')}}</b-link>
						</li>
					</ul>
				</div>
			</b-container>
		</nav>
	</header>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppHeader' })
</script>
