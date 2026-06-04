// src/main/preload.js
import { contextBridge, ipcRenderer } from 'electron'

// Définition manuelle de l'API au lieu d'utiliser @electron-toolkit/preload
const electronAPI = {
  ipcRenderer: {
    send: (channel, data) => {
      const validChannels = [
        'minimize', 
        'maximizeOrRestore', 
        'close', 
        'get', 
        'set',
        'changeed'
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      const validChannels = ['changeed'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
      }
    },
    once: (channel, func) => {
      const validChannels = ['changeed'];
      if (validChannels.includes(channel)) {
        ipcRenderer.once(channel, (event, ...args) => func(event, ...args));
      }
    },
    invoke: (channel, ...args) => {
      const validChannels = [
        'openDialog', 
        'saveDialog', 
        'messageBox', 
        'restartApp', 
        'get', 
        'set'
      ];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, ...args);
      }
      return Promise.reject(new Error(`Invalid channel: ${channel}`));
    },
    removeAllListeners: (channel) => {
      if (channel) {
        ipcRenderer.removeAllListeners(channel);
      }
    }
  },
  on: (channel, func) => {
    const validChannels = ['changeed'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
    }
  }
};

const context = {
  env: {
    NODE_ENV: process.env.NODE_ENV,
    IS_ELECTRON: true,
  }
};

// Exposer les APIs
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('context', context);
    console.log('Preload: APIs exposed successfully');
  } catch (error) {
    console.error('Preload error:', error);
  }
} else {
  window.electron = electronAPI;
  window.context = context;
}

console.log('Preload script loaded');