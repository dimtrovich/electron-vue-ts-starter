import { Dayjs } from 'dayjs'
import php from 'php-in-js'

declare module 'vue' {
  	interface ComponentCustomProperties {
    	$asset: (path: string) => string
    	$public: (path: string) => string
    	$php: typeof php
		$dayjs: (...args: any[]) => Dayjs
		$duration: any
  	}
}

export {}
