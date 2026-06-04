import { getPackage } from "./package";
import semverPrerelease from "semver/functions/prerelease";

const packageJson = getPackage();
let   parsePrerelease = semverPrerelease(packageJson.version);
      parsePrerelease = parsePrerelease ? parsePrerelease[0].toLowerCase() : 'stable';
      parsePrerelease = ['alpha', 'beta', 'rc'].includes(parsePrerelease) ? parsePrerelease : 'stable';

export const appName     = packageJson.productName;  
export const version     = packageJson.version;
export const prerelease  = parsePrerelease;
export const isDev       = process.env.NODE_ENV === "development";
export const isElectron  = Boolean(process.versions.electron);
export const isMacOS     = process.platform === "darwin";
export const isWindows   = process.platform === "win32";
export const isLinux     = process.platform === "linux";

console.log('shared/utils/env: ', 
    { appName, version, prerelease, isDev, isElectron, isMacOS, isWindows, isLinux });

export default {
    isDev,
    isElectron,
    isMacOS,
    isWindows,
    isLinux,

    appName,
    version,
    prerelease
};