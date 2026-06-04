import type { RouteRecordRaw } from 'vue-router';

export default [
	{
		path: '/',
		name: 'home',
		meta: { noAuth: true },
		component: () => import('@/views/Home.vue'),
	},
	{
		path: '/about',
		name: 'about',
		meta: { noAuth: true },
		component: () => import('@/views/About.vue'),
	},
	{
		path: '/settings',
		name: 'settings',
		meta: { noAuth: true },
		component: () => import('@/views/Settings.vue'),
	},
	{
		path: '/:pathMatch(.*)*', // Catch-all route for undefined paths
		name: 'notFound',
		meta: { noAuth: true },
		component: () => import('@/views/404.vue'),
	},
] as RouteRecordRaw[]
