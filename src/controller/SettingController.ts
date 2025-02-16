import fs from 'fs';
import path from 'path';
import {fetchMoodleCourse} from "./RetrieveCourse";
import {findCourseTitle} from "../services/HtmlService";
import {Course} from "../models/Course";
import {appConfig} from "../utils/AppConfig";

const settingFilePath = path.join(appConfig.launchDirectory, appConfig.settingFile);
fs.mkdirSync(path.dirname(settingFilePath), { recursive: true });

type Settings = {
    courses: Course[];
    moodleCookie: string;
}


export function readStorage(): Settings {
    if (fs.existsSync(settingFilePath)) {
        const data = fs.readFileSync(settingFilePath, 'utf-8');
        const parsedData: Settings = JSON.parse(data);
        parsedData.courses = parsedData.courses.map((course: any) => new Course(course.id, course.title));
        return parsedData;

    }
    return { courses: [], moodleCookie: '' };
}

export function changeCookie(cookie: string) {
    const data = readStorage();
    data.moodleCookie = cookie;
    fs.writeFileSync(settingFilePath, JSON.stringify(data));
}
export async function addCourseID(courseID: string) {
    const data = readStorage();
    await fetchMoodleCourse(courseID, data.moodleCookie).then((res) => {
        data.courses.push(new Course(courseID, findCourseTitle(res)));
        fs.writeFileSync(settingFilePath, JSON.stringify(data));
    })
}
export function removeCourseID(courseID: string) {
    const data = readStorage();
    data.courses = data.courses.filter(course => course.id !== courseID);
    fs.writeFileSync(settingFilePath, JSON.stringify(data));
}

/**
 * Check if the cookie is valid by checking if it is empty
 * If not empty check that the homepage is not the login page
 */
export async function checkValidCookie() : Promise<boolean> {
    console.log("Checking cookie");
    let setting = readStorage();
    console.log(setting.moodleCookie);
    if (setting.moodleCookie === '') {
        return false;
    }
    let res = await fetchMoodleCourse("", setting.moodleCookie);
    // use parser
    let $ = require('cheerio').load(res);
    return ($("body").find(".login").length == 0);
}
