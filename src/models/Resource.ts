import path from "path";
import {readStorage} from "../controller/SettingController";
import {app} from "electron";

export class Resource {
    public readonly COURSE_ID: string;
    public readonly RESOURCE_ID: string;
    public readonly TITLE: string;
    public readonly SECTION: string;

    constructor(courseID: string, resourceID: string, title: string, section: string) {
        this.COURSE_ID = courseID;
        this.RESOURCE_ID = resourceID;
        this.TITLE = title;
        this.SECTION = section
    }

    /**
     * Get the URL of the resource, from which it can be downloaded.
     */
    public getUrl(): string {
        return `https://moodle.epfl.ch/mod/resource/view.php?id=${this.RESOURCE_ID}&redirect=1`;
    }

    /**
     * Get the output file path where the resource is downloaded.
     * Process the resource title to remove special characters as they are not allowed in file names.
     */
    public getOutputFilePath(): string {
        let title = this.TITLE.replace(/:/g, "");
        return path.join(app.getPath("documents"), `./pdf-moodledl/${this.getCourseTitle()}`, `${this.SECTION}-${title}.pdf`);
    }
    /**
     * Get the output directory path where the resource is downloaded..
     */
    public getOutputDirPath(): string {
        return path.dirname(this.getOutputFilePath());
    }

    /**
     * Get the course title from the local storage, if not found it uses the course ID.
     * This courseTitle is used as the dirname for the output pdfs.
     */
    public getCourseTitle(): string {
        let settings = readStorage()
        let course = settings.courses.find(course => course.id === this.COURSE_ID)
        return course?.title || this.COURSE_ID;
    }
}