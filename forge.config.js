const fs = require('fs');
const path = require('path');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const rcedit = require('rcedit');
const pkg = require('./package.json');

const writeCopyright = async (config, packageResult) => {
  const exePath = path.join(packageResult.outputPaths[0], `${pkg.name}.exe`)
  await rcedit(exePath, {
    'version-string': {
      LegalCopyright: pkg.copyright || 'Copyright (c) 2025 default'
    }
  });
};

module.exports = {
  packagerConfig: {
    executableName: pkg.name,
    asar: true,
    icon: "src/main.ico",
    extraResource: [
      "src/renderer/locales"
    ],
    executableName: pkg.name,
  },
  hooks: {
    postPackage: async (config, packageResult) => {
      if (process.platform === "win32")
        await writeCopyright(config, packageResult);
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
        iconUrl: 'https://www.electronjs.org/assets/img/favicon.ico',

        // The ICO file to use as the icon for the generated Setup.exe
        setupIcon: 'src/setup.ico'
      },
    },
    {
      name: '@pengx17/electron-forge-maker-appimage',
      config: {
        icons: [
          {
            file: "src/renderer/assets/icon.png",
            size: 128,
          },
        ],
      },
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
      },
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        // If you are familiar with Vite configuration, it will look really familiar.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: 'src/main/main.js',
            config: 'vite.main.config.mjs',
            target: 'main',
          },
          {
            entry: 'src/main/preload.js',
            config: 'vite.preload.config.mjs',
            target: 'preload',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs',
          },
        ],
      },
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
