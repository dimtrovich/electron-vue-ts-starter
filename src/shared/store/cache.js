import { isDeepStrictEqual } from 'node:util';
import { getProperty, hasProperty, setProperty, deleteProperty, } from 'dot-prop';

class Cache {
  constructor() {
    this.store = {};
    this.events = new EventTarget();
  }

  has(key) {
    return hasProperty(this.store, key);
  }

  set(key, value, userData=undefined) {
    const oldValue = this.get(key, undefined);
    if (oldValue === value)
      return this;
    setProperty(this.store, key, value);
    this._change(userData);
    return this;
  }

  get(key, defaultValue=undefined) {
    return getProperty(this.store, key, defaultValue);
  }

  delete(key) {
    if (this.has(key)) {
      deleteProperty(this.store, key);
      this._change();
      return true;
    }
    return false;
  }

  clear() {
    this.store = {};
    this._change();
    return this;
  }

  onChange(key, callback) {
    return this._handleChange(() => structuredClone(this.get(key)), callback);
  }

  _handleChange(getter, callback) {
    let currentValue = getter();
    const onChange = (event) => {
      const oldValue = currentValue;
      const newValue = getter();
      if (isDeepStrictEqual(newValue, oldValue)) {
        return;
      }
      currentValue = newValue;
      callback.call(this, newValue, oldValue, event.detail);
    };
    this.events.addEventListener('change', onChange);
    return () => {
      this.events.removeEventListener('change', onChange);
    };
  }

  _change(userData=undefined) {
    this.events.dispatchEvent(new CustomEvent('change', { detail: userData }));
  }
};

export default new Cache();