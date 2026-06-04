let appName = 'Unknown';
let appVersion = 'Unknown';
let theme = 'light';

try {
    appName = __APP_NAME__ ?? appName;
    appVersion = __APP_VERSION__ ?? appVersion;

    if (document?.documentElement) {
        const value = getComputedStyle(document.documentElement)?.getPropertyValue('--color-scheme');
        if (value == 'dark') // avoid --color-scheme is empty or unexpected value
            theme = value;
    }
}
catch (e) { }

export default {
    settings: {
        theme: theme,
        language: 'en',
        roundedWindow: true,
    },
    shared: {
        app: {
            name: appName,
            version: appVersion,
        }
    },
}