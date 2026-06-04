import { app, ipcMain, BrowserWindow, dialog } from 'electron';
import cache from '../shared/store/cache'
import preset from '../shared/store/preset';
import settings from '../shared/store/settings'
import { logger } from './logger';

// 窗口操作相关的 IPC 处理
function handleWindowOperations() {
    ipcMain.on('minimize', e => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if (win) win.minimize();
    });

    ipcMain.on('maximizeOrRestore', e => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if (win) win.isMaximized() ? win.unmaximize() : win.maximize();
    });

    ipcMain.on('close', e => {
        const win = BrowserWindow.fromWebContents(e.sender)
        const main = cache.get("mainWindow")
        if (main && win.id == main.id)
            app.quit();
        else if (win)
            win.close();
    });

    // The show dialog options refer to:
    // https://www.electronjs.org/docs/latest/api/dialog
    ipcMain.handle('openDialog', async (e, options) => {
        let targetWindow = BrowserWindow.fromWebContents(e.sender)
        if (!targetWindow)
            targetWindow = cache.get("mainWindow");
        return dialog.showOpenDialog(targetWindow, { ...options });
    });

    ipcMain.handle('saveDialog', async (e, options) => {
        let targetWindow = BrowserWindow.fromWebContents(e.sender)
        if (!targetWindow)
            targetWindow = cache.get("mainWindow");
        return dialog.showSaveDialog(targetWindow, { ...options });
    });

    ipcMain.handle('messageBox', async (e, options) => {
        let targetWindow = BrowserWindow.fromWebContents(e.sender)
        if (!targetWindow)
            targetWindow = cache.get("mainWindow");

        return dialog.showMessageBox(targetWindow, { ...options });
    });

    ipcMain.handle('restartApp', async (e) => {
        app.relaunch();
        app.exit(0);
    });
}

// 设置相关的 IPC 处理
function handleSettingsOperations() {
    ipcMain.handle('get', async (event, key, defaultValue) => {
        if (key == 'settings')
            return settings.get(key, defaultValue)
        else if (key == 'shared')
            return cache.get(key, defaultValue);
        else if (key == 'state') {
            return {
                settings: settings.get('settings', preset.settings),
                shared: cache.get('shared', {}),
            };
        }
        else
            logger.info('Unknown key: ' + key);

        return defaultValue;
    });

    ipcMain.handle('set', async (event, key, value) => {
        try {
            if (key == 'settings')
                settings.set(key, value, { from: 'renderer' });
            else if (key == 'shared')
                cache.set(key, value, { from: 'renderer' });
            else
                logger.info('Unknown key: ' + key);
        } catch (e) {
            logger.error(e);
        }
    });

    // 监听变化
    settings.onDidChange('settings', (newValue, oldValue, userData) => {
        if (userData?.from === 'renderer')
            return;
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('changeed', 'settings', newValue);
        });
    });

    cache.onChange('shared', (newValue, oldValue, userData) => {
        if (userData?.from === 'renderer')
            return;
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('changeed', 'shared', newValue);
        });
    });
}

function initIPC() {
    handleWindowOperations();
    handleSettingsOperations();
}

export default initIPC;
