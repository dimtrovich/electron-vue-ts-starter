import { app, session, BrowserWindow } from 'electron';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import initIPC from './ipc';
import settings from '../shared/store/settings'
import cache from '../shared/store/cache'
import windowStateKeeper from './window-state.js';
import updater from './updater.js';
import { getPackage } from '../shared/utils/package.js';
import { logger } from './logger.js';
import NativeDialog from './ndialog.js';

const gotTheLock = app.requestSingleInstanceLock();

// 1. Handle creating/removing shortcuts on Windows when installing/uninstalling.
// 2. On Windows, if the app is already running, we don't want to start a new instance.
if (started || !gotTheLock) {
  logger.info('exiting, because another instance is running or it is a squirrel startup event');
  logger.info(' - SquirrelStarted:', started);
  logger.info(' - SingleInstanceLock:', gotTheLock);
  app.quit();
}


const pkg = getPackage();
const createWindow = () => {
  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  const createOptions = {
    show: true,
    frame: false,
    resizable: true,
    transparent: false,
  };

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 450,
    minHeight: 300,
    // show: createOptions.show,
    // frame: createOptions.frame,
    // resizable: createOptions.resizable,
    // transparent: createOptions.transparent,
    // backgroundColor: '#00000000',
    icon: path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/assets/icon.png`),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.createOptions = createOptions;
  mainWindowState.manage(mainWindow);

  // Hide menu bar on Microsoft Windows and Linux
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Cache the mainWindow
  cache.set("mainWindow", mainWindow)

  // Note: When `show: false` and `transparent: true` are set together,
  // the window may display a white background due to an unfixed Electron issue:
  // https://github.com/electron/electron/issues/34835
  //
  // Show the window when it is ready
  if (createOptions.show) {
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
  }

    // Listen to the window maximize and minimize event
  mainWindow.on('maximize', () => {
    if (mainWindow.createOptions.transparent) {
      mainWindow.setResizable(false);
    }
    cache.set("shared.window.maximized", true);
  });
  mainWindow.on('unmaximize', () => {
    if (mainWindow.createOptions.transparent) {
      mainWindow.setResizable(true);
    }
    cache.set("shared.window.maximized", false);
  });
  mainWindow.on('minimize', () => {
    cache.set("shared.window.minimized", true);
  });
  mainWindow.on('restore', () => {
    cache.set("shared.window.minimized", false);
  });
  cache.set("shared.window.maximized", mainWindow.isMaximized());
  cache.set("shared.window.minimized", mainWindow.isMinimized());
  cache.set("shared.window.shouldShowExitConfirmation", true);

  // Listen to the window close event
  if (process.platform !== 'darwin') {
    /*
    mainWindow.on('close', async (event) => {
      if (cache.get("shared.window.shouldShowExitConfirmation", false)) {
        event.preventDefault();
        try {
          const result = await new NativeDialog().show(mainWindow, {
            file: 'src/renderer/electron/NativeMessageBox.html',
            title: pkg.productName,
            rawHtml: '<p style="font-weight: bold; color: #409EFF;">Are you sure you want to exit?</p>',
            buttons: { no: 'No', yes: 'Yes' },
            modal: true,
          });

          if (result.value === 'yes') {
            mainWindow.destroy();
          }
        }
        catch (e) {
          logger.error('Error:', e);
          mainWindow.destroy();
        }
      }
    });
    */
  }

  // Listen to the double click event when the window is transparent
  if (process.platform === 'win32' && mainWindow.createOptions.transparent) {
    const WM_PARENTNOTIFY = 0x0210;
    const WM_LBUTTONDOWN = 0x0201;

    let lastClickTime = 0;
    let lastClickPos = { x: 0, y: 0 };
    mainWindow.hookWindowMessage(WM_PARENTNOTIFY, (wParam, lParam) => {
      wParam = wParam.readInt32LE();
      lParam = lParam.readInt32LE();
      if (wParam === WM_LBUTTONDOWN) {
        const x = lParam & 0xFFFF;
        const y = lParam >> 16;
        const currentTime = Date.now();

        if (y > 30) // Let's say the taskbar is 30px tall
          return false;

        if (currentTime - lastClickTime < 300 &&
          Math.abs(x - lastClickPos.x) < 2 &&
          Math.abs(y - lastClickPos.y) < 2) {
          setTimeout(() => { // 避免窗口出现一些奇怪的问题
            mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
          }, 50);
          return true;
        }

        lastClickTime = currentTime;
        lastClickPos = { x, y };
      }
      return false;
    });
  }

  if (process.env.NODE_ENV === 'development') {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Load the Vue DevTools if it exists
    // https://www.electronjs.org/zh/docs/latest/tutorial/devtools-extension
    const devtools = path.resolve('plugin/vue.js-devtools/7.7.0_0');
    if (fs.existsSync(devtools))
      session.defaultSession.loadExtension(devtools);
  }
};

app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
  // Print out data received from the second instance.
  logger.info('The second instance has running, data: ', additionalData)

  // Someone tried to run a second instance, we should focus our window.
  const win = cache.get("mainWindow")
  if (win) {
    if (win.isMinimized()) win.restore()
      win.focus()
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // Initialize the Main IPC
  initIPC();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Set the shared cache
const locales = app.isPackaged ? `${process.resourcesPath}/locales` : null;

cache.set('shared', {
  os: {
    name: os.hostname(),
    type: os.type(),
    arch: os.arch(),
    release: os.release(),
    platform: os.platform(),
  },
  app: {
    name: app.getName(),
    version: app.getVersion(),
    locales: locales,
    packaged: app.isPackaged,
  },
  versions: {...process.versions}
});

// Initialize the auto updater in production mode, otherwise it will throw an error
// when trying to check for updates in development mode.
if (process.env.NODE_ENV !== 'development') {
  // recommend: 
  // `${pkg.urls.update}/${process.platform}/${process.arch}/${app.getVersion()}`
  updater.init(`${pkg.urls.update}/${process.platform}/${process.arch}`, {});
  updater.start();
  updater.on('error', (err) => {
    logger.error('Updater error:', err);
  });

  updater.on('update-downloaded', async (event, releaseNotes, releaseName) => {
    logger.info('Update downloaded:', releaseName, releaseNotes);

    try {
      const detail = process.platform === 'win32' ? releaseName : releaseNotes;
      const result = await new NativeDialog().show(
        cache.get("mainWindow", null),
        {
          type: 'info',
          file: 'src/renderer/electron/NativeMessageBox.html',
          title: 'Application Update',
          message: `A new version has been downloaded. Restart the application to apply the updates.\n${detail}`,
          buttons: { no: 'Later', yes: 'Restart' },
          modal: true,
        });

      if (result.value === 'yes') {
        logger.info('Restarting application.');
        cache.set("shared.window.shouldShowExitConfirmation", false);
        updater.quitAndInstall();
      }
    }
    catch (e) {
      logger.error('Error:', e);
    }
  });
}