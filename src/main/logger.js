import { shell } from "electron"
import log from 'electron-log/main';

log.initialize();

export function getLogFilePath() {
    return log.transports.file.getFile().path
}

export async function revealLogFile() {
    const filePath = getLogFilePath()
    return await shell.openPath(filePath)
}

export const logger = log.scope("main")