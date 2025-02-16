import {app, BrowserWindow, ipcMain, dialog} from 'electron'
import {runServer} from "../express/express";
import path from "path";
app.setAppUserModelId("com.squirrel.MoodleDl.MoodleDl");
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    ipcMain.on('e', (event, arg) => {
        console.log(arg); // prints "ping"
        // open a dialog box to choose a directory
        dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
            event.reply('e', result.filePaths);
        }).catch(err => {
        });
    })

    cookieCheck(win);
}
app.whenReady().then(() => {
    if (require('electron-squirrel-startup')) app.quit();

    runServer();
    createWindow()
})

// create a function that takes a browser window
// and loads the cookieCheck.html
function cookieCheck(win: BrowserWindow) {
    win.loadFile(path.join(__dirname, '../public/cookieCheck/cookieCheck.html'));
}

