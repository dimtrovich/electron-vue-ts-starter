import { isDeepStrictEqual } from 'node:util';
import process from 'node:process';
import Store from 'electron-store';
import preset from './preset.js';
import env from '../utils/env.js';

class Settings extends Store {
    constructor(options={}) {
        options = {
            name: 'settings',
            defaults: { settings: preset.settings },
            ...options,
        };

        if (!env.isElectron) {
            options.cwd ||= path.join(process.cwd(), 'data');
            options.projectName ||= env.appName;
            options.projectVersion ||= env.version;
        }
        super(options);
        this.userData = undefined;
    }

    getAll(defaultValue={}) {
        const data = this.store;
        if (Object.keys(data).length === 0) {
            return defaultValue;
        }
        return data;
    }

    setAll(data, userData={}) {
        this.userData = userData;
        this.store = data;
    }

    // Override Conf's set method
    set(key, value, userData={}) {
        this.userData = userData;
        return super.set(key, value);
    }

    // Override Conf's setter/getter method
    set store(value) {
        this._ensureDirectory();
        this._validate(value);
        this._write(value);
        this.events.dispatchEvent(new CustomEvent('change', { detail: this.userData || {} }));
        this.userData = undefined;
    }
    get store() {
        return super.store;
    }

    // Override Conf's _handleChange method
    _handleChange(getter, callback) {
        let currentValue = getter();
        const onChange = (event) => {
            const oldValue = currentValue;
            const newValue = getter();
            if (isDeepStrictEqual(newValue, oldValue)) {
                return;
            }
            currentValue = newValue;
            callback.call(this, newValue, oldValue, event?.detail);
        };
        this.events.addEventListener('change', onChange);
        return () => {
            this.events.removeEventListener('change', onChange);
        };
    }
};


export default new Settings();