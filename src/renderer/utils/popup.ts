import { createApp, h, ref } from 'vue'
import { i18n } from '@/plugins/i18n'

export const popup = (component: any, options = {}) => {
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    return new Promise((resolve, reject) => {
        const app = createApp({
            setup() {
                return () => h(component, {
                    ...options,
                    onClosed: () => {
                        setTimeout(() => {
                            app.unmount()
                            document.body.removeChild(mountNode)
                        }, 300)
                    }
                })
            }
        })

        // app.use(store)
        app.use(i18n)
        app.mount(mountNode)
    })
}
