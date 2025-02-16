import axios from 'axios';
import * as fs from 'fs';
import {Resource} from "../models/Resource";
import logger from "../utils/Logger";
import {readStorage} from "./SettingController";
import {PdfMonitor} from "./PdfMonitor";
import {sendToClient} from "../express/express";
import {fetchMoodleCourse} from "./RetrieveCourse";
import {findPdfsFromHtml} from "../services/HtmlService";
import {Course} from "../models/Course";
import {downloadController} from "./downloadController";
// downloadALL that calls downloadCourse that calls downloadPdf
export class Downloader{
    PdfMonitor;
    downloadController;
    constructor() {
        this.PdfMonitor = new PdfMonitor()
        this.downloadController = new downloadController()
    }
    public async downloadPdf(resource: Resource) {

        if (this.PdfMonitor.checkRegistration(resource)) {
            return resource.RESOURCE_ID;
        }
        this.downloadController.addDownload(resource);
        sendToClient(`Downloading : ${resource.getCourseTitle()} -  ${resource.TITLE}`);
        const outputFilePath = resource.getOutputFilePath();
        const cookie = "MoodleSession=" + readStorage().moodleCookie;
        try {
            fs.mkdirSync(resource.getOutputDirPath(), { recursive: true });
            const response = await axios.get(resource.getUrl(), {
                headers: {'Cookie': cookie,},
                responseType: 'arraybuffer'
            });

            fs.writeFileSync(outputFilePath, response.data);
            logger.info(` DOWNLOADED : ${resource.getCourseTitle()} -  ${resource.TITLE}`);
            this.downloadController.removeDownload(resource);
            const inode = fs.statSync(outputFilePath).ino;
            this.PdfMonitor.register(resource, inode);
            // return resolve with id of the pdf
            return resource.RESOURCE_ID;
        } catch (error) {
            logger.error(`Error downloading file ${resource.RESOURCE_ID}`);
            logger.error(error);
            return resource.RESOURCE_ID
        }
    }
    public async downloadCourse(course : Course, cookie: string) {
        let courseID = course.id
        let html = await fetchMoodleCourse(courseID, cookie);
        let parsed = findPdfsFromHtml(html, courseID);
        if (parsed.length === 0) {
            logger.warn(`No resource found for course ${courseID}`);
            return Promise.resolve();
        }
        let coursePromises = parsed.map((res, index) => {
            return new Promise<string>((resolve) => {
                setTimeout(async () => {
                    resolve(await this.downloadPdf(res));
                }, index * 100)
            })
        })
        return Promise.all(coursePromises);
    }
}

/**
 * Function called by the main after the user has set valid course and cookie.
 * This function will for each course download its page then scan for all the pdf and download them.
 */
export async function downloadAll() {
    // init the downloader (connects the db)
    let downloader = new Downloader();
    downloader.downloadController.startDownload();

    let settings = readStorage();
    logger.info("Downloading all pdfs with cookie : " + settings.moodleCookie);
    let downloadPromises = settings.courses.map((course) => {
        return downloader.downloadCourse(course, settings.moodleCookie);
    });
    await Promise.all(downloadPromises);
    downloader.downloadController.finishDownload();
}