import {app} from "electron";
import path from "path";

 function getLaunchDirectory(): string {
    const isPkg = (process as any).pkg !== undefined;
    const isElectron = process.versions.electron !== undefined;

    if (isElectron) {
        console.log("Detected Electron");
        console.log(app.getPath('userData'));
        return app.getPath('userData');
    }
    return isPkg ? path.dirname(process.execPath) : __dirname;
}

export const appConfig = {
    settingFile: "./settings/storage.json",
    monitoringFile: "./settings/presence.db",
    launchDirectory : getLaunchDirectory()
}