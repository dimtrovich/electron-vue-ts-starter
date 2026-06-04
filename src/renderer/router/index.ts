/* eslint-disable sort-keys */
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

import { IS_ELECTRON, ROUTES_EMPTY_LAYOUT } from '@/utils/constants'
import runMiddlewares from '@/middlewares/handler/runner'

const routes: RouteRecordRaw[] = []

const files = import.meta.glob('./**/*.routes.ts', { eager: true })
Object.entries(files).forEach(([, definition]) => {
	const module = definition as { default: RouteRecordRaw[] }
	routes.push(...module.default)
})

for (const route of routes) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const key in route) {
		const meta = route.meta || {}
		if (!meta.layout) {
			meta.layout = !ROUTES_EMPTY_LAYOUT.includes((route.name || route.path) as string) ? 'main' : 'empty'
		}
		route.meta = meta
	}
}

const base = IS_ELECTRON ? null : import.meta.env.BASE_URL;
const router = createRouter({
	history: createWebHashHistory(base),
	linkActiveClass: 'active router-link-active',
	routes,
})

router.beforeEach(runMiddlewares(router))

export default router
