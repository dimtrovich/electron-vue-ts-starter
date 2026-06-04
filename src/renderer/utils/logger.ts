import { LogFunctions } from "electron-log";
import { IS_ELECTRON } from "./constants.js";

export default new class {
    shadow: null | LogFunctions;

    constructor() {
        this.shadow = null;
        if (IS_ELECTRON) {
            import('./electron-log-wrapper').then((module) => {
                this.shadow = module.default.scope('renderer')
            })
        }
    }

    write(level: string, ...args: any) {
        // console: trace, log, info, warn, error
        // electron-log: silly, debug, verbose, log, info, warn, error
        ["trace", "log", "info", "warn", "error"].includes(level) || (level = "log");

        const logger = (this.shadow || window.console) as any
        level = (this.shadow && level === 'trace') ? 'debug' : level

        logger[level](...args)
    }

    trace(...args: any) {
        this.write("trace", ...args)
    }

    info(...args: any) {
        this.write("info", ...args)
    }

    warn(...args: any) {
        this.write("warn", ...args)
    }

    error(...args: any) {
        this.write("error", ...args)
    }
}