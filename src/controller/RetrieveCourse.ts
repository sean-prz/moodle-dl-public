import axios from 'axios';
import Logger from "../utils/Logger";


function getUrl(courseID: string): string {
    return `https://moodle.epfl.ch/course/view.php?id=${courseID}`;
}

function getCookie(moodleCookie: string): string {
    return "MoodleSession=" + moodleCookie;
}


/**
 * Fetch the moodle course page, returns the html content of a course.
 * Returns the homepage of moodle if courseID is empty.
 * @param courseID
 * @param moodleCookie
 */
export async function fetchMoodleCourse(courseID: string, moodleCookie: string): Promise<string> {
    let url = getUrl(courseID);
    if (courseID == "") {
        url = "https://moodle.epfl.ch/my/";
    }
    const cookie = getCookie(moodleCookie);

    Logger.info(`Fetching course ${courseID}`);
    try {
        const response = await axios.get(url, {
            headers: {
                'Cookie': cookie,
            },
        });
        Logger.info(`Course ${courseID} - fetched, parsing`);
       // return the html content
         return response.data;
    } catch (error) {
        Logger.error(`Error fetching course ${courseID}`);
        Logger.error(error);
        Logger.warn("Check internet connection or COURSE_ID");
        process.exit(1);
    }
}
