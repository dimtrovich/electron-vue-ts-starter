export default {
    app: {
        title: 'Vue.js + Electron application',
        nav: {
            home: 'Accueil',
            settings: 'Configurations',
            about: 'A propos',
        },
    },
    home: {
        title: 'Page d\'accueil',
        body: 'Welcome to your Vue.js + Electron application',
    },
    settings: {
        title: 'Page de configuration',
        theme: 'Theme:',
        themeOptions: {
            light: 'Claire',
            dark: 'Sombre',
        },
        language: 'Langue:',
        roundedWindow: 'Rounded window style:',
        restartConfirm: {
            title: 'Tips',
            message: 'This setting requires restart to take effect. Continue?',
            confirm: 'Confirmer',
            cancel: 'Annuler'
        }
    },
    about: {
        title: 'A propos de l\'application',
        body: 'Created By Dimitric Sitchet Tomkeu with Vue.js, Electron and TypeScript.',
    },
};
