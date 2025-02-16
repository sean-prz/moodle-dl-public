import {Resource} from "../models/Resource";
import {sendToClient} from "../express/express";
import ipcMain from "electron";

/**
 * This class monitors the ongoing download to send the progress to the client.
 */
export class downloadController {
    currentDownload: Set<Resource>
    doneDownload: Set<Resource>
    downloadStarted: boolean
    downloadFinished: boolean
    constructor() {
        this.currentDownload = new Set()
        this.doneDownload = new Set()
        this.downloadStarted = false
        this.downloadFinished = false
        this.emitLog()
    }

    public addDownload(resource: Resource) {
        this.currentDownload.add(resource)
        this.emitLog()
    }
    public removeDownload(resource: Resource) {
        this.doneDownload.add(resource)
        this.currentDownload.delete(resource)
        this.emitLog()
    }
    public startDownload() {
        this.downloadStarted = true
        this.emitStatus()
    }
    public finishDownload() {
        this.downloadFinished = true
        this.emitStatus()
    }


    public makeString(): string {
        let downlading = Array.from(this.currentDownload).map((res) => {
            return `[Downloading] : ${res.getCourseTitle()} -  ${res.TITLE}`
        }).join("<br>")
        let done = Array.from(this.doneDownload).map((res) => {
            return `[Downloaded] : ${res.getCourseTitle()} -  ${res.TITLE}`
        }).join("<br>")
        return downlading + "<br>" + done
    }

    public emitLog() {
        sendToClient({"channel": "log", "content": this.makeString()})
    }
    public emitStatus() {
        if (this.downloadStarted) {
           sendToClient({"channel": "status", "content": "Download Started"})
        }
        if (this.downloadFinished) {
            sendToClient({"channel": "status", "content": "Download Finished"})
        }
    }
}