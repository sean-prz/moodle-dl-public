// preload.js
import {contextBridge, ipcRenderer} from 'electron';
// only expose the send and receive functions
contextBridge.exposeInMainWorld(
    'electron', {
        send: (channel: string, data: any) => {
            ipcRenderer.send(channel, data);
            console.log('send', channel, data);
        },
        receive: (channel: string, func: any) => {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
);