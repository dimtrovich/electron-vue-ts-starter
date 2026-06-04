let appName = 'Unknown'
let appVersion = 'Unknown'
let theme = 'light'

try {
    appName = __APP_NAME__ ?? appName;
    appVersion = __APP_VERSION__ ?? appVersion;

	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		theme = 'dark'
	} else if (document?.documentElement) {
		const value = getComputedStyle(document.documentElement)?.getPropertyValue('--color-scheme')
        if (value == 'dark') {
			theme = value; // avoid --color-scheme is empty or unexpected value
		}
    }
}
catch (e) { }

export default {
    settings: {
        theme: theme,
        language: null,
        roundedWindow: true,
    },
    shared: {
        app: {
            name: appName,
            version: appVersion,
        }
    },
}
