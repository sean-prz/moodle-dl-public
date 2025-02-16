import Database from 'better-sqlite3';
import {Resource} from "../models/Resource";
import fs from "fs";
import path from "path";
import logger from "../utils/Logger";

import {appConfig} from "../utils/AppConfig";


interface RegistrationResult {
    inode: number;
}

/**
 * PdfMonitor is a class that checks
 * if a resource is already downloaded and present on the disk.
 * It uses a sqlite database to store the inode of the file.
 * The inode is a unique identifier of the file on the disk.
 * If the file is not found on the disk, the entry in the database is deleted.
 * This class is used to prevent re-downloading of files.
 * It is used in the download manager to check if a file is already downloaded.
 * If the file is already downloaded, it is not downloaded again.
 * It only offers two methods, register and checkRegistration.
 */
export class PdfMonitor {
    db;
    constructor() {
        const dbPath = path.join(appConfig.launchDirectory, appConfig.monitoringFile );
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
        this.db = new Database(dbPath);
        this.db.prepare('CREATE TABLE IF NOT EXISTS registration (id INTEGER PRIMARY KEY, inode INTEGER)').run();
    }

    /**
     * Register a resource in the database, with the inode of the file.
     * A resource in the database means it is downloaded and present on the disk at the inode.
     * @param res
     * @param inode
     */
    public register(res : Resource, inode: number): void {
        this.db.prepare('INSERT INTO registration (id, inode) VALUES (?, ?)').run(res.RESOURCE_ID, inode);

    }

    /**
     * Check if a resource is on the disk.
     *
     * @param res
     */
    public checkRegistration(res : Resource): boolean {
        let result = this.db.prepare('SELECT inode FROM registration WHERE id = ?').get(res.RESOURCE_ID) as RegistrationResult | undefined;
        if (result === undefined) {
            return false;
        }
        return this.fileExistsWithInode(res, Number(result.inode));
    }

    /**
     * Check if the file at the inode is still on the disk.
     * If not found, delete the entry in the database and return false.
     * @param res
     * @param inode
     * @private
     */
    private fileExistsWithInode(res: Resource, inode: number): boolean {
        fs.mkdirSync(res.getOutputDirPath(), { recursive: true });
        const dirPath = path.dirname(res.getOutputFilePath());
        const files = fs.readdirSync(dirPath);
        for (let file of files) {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            if (stats.ino === inode) {
                logger.info(`ALREADY ON DISK : ${res.getCourseTitle()} - ${res.TITLE}`);
                return true;
            }
        }
        // delete the entry in the database if the file is not found
        this.db.prepare('DELETE FROM registration WHERE id = ?').run(res.RESOURCE_ID);
        return false
    }

}

//new PdfMonitor().register(new Resource('15012', '1199275', '3'), 48708864);
//new PdfMonitor().checkRegistration(new Resource('15012', '1199275', '3'));