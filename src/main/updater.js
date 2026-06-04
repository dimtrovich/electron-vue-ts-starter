import { app, autoUpdater } from 'electron';

// This is a wrapper for the autoUpdater module in Electron.
// It provides an extensible interface to meet the needs of more complex businesses in the future.
class Updater {
    constructor() {
        this.feedURL = null
        this.interval = null
        this.intervalID = null
        this.shadow = autoUpdater
    }

    init(feedURL, options) {
        if (this.intervalID)
            throw new Error('Updater has already been initialized.');
        this.feedURL = feedURL
        this.interval = options.interval || 900000 // 15 minute
        this.shadow.setFeedURL({ url: this.feedURL })
    }

    start() {
        if (this.intervalID)
            return;
        this.shadow.checkForUpdates();
        this.intervalID = setInterval(() => {
            if (this.intervalID) {
                this.shadow.checkForUpdates()
            }
        }, this.interval);
    }

    stop() {
        if (this.intervalID)
            return;
        clearInterval(this.intervalID);
        this.intervalID = null;
    }

    // event:
    //  - error
    //  - update-available
    //  - update-downloaded
    //  - before-quit-for-update
    on(event, callback) {
        this.shadow.on(event, callback);
    }

    quitAndInstall() {
        this.shadow.quitAndInstall();
    }
};

export default new Updater();