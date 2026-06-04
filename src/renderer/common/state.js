
import vuex from 'vuex';
import lodash from 'lodash-es';
import preset from '#/store/preset.js';
import { setProperty } from 'dot-prop';

const state = lodash.cloneDeep(preset);
if (window.electron)
  lodash.merge(state, await window.electron.ipcRenderer.invoke('get', 'state', {}))

const store = vuex.createStore({
  state: {
    ...state
  },
  mutations: {
    set(state, {key, value}) {
      setProperty(state, key, value);
    }
  },
  actions: {
    update({ commit }, option) {
      commit('set', option);
    }
  },
});

if (window.electron) {
  ['settings', 'shared'].forEach((key) => {
    store.watch(
      (state) => state[key],
      (newValue) => {
        const value = JSON.parse(JSON.stringify(newValue))
        window.electron.ipcRenderer.invoke('set', key, value);
      },
      { deep: true }
    );
  });

  window.electron.ipcRenderer.on('changeed', (event, key, value) => {
    if (['settings', 'shared'].includes(key))
      store.dispatch('update', { key, value });
  });
}

export default store;