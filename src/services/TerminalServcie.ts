import {addCourseID, changeCookie, readStorage, removeCourseID} from "../controller/SettingController";
import readline from "readline";

/**
 * Ask a question to the user and return the answer, via the terminal.
 * @param query
 */
export async function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(`${query}\n`, ans => {
        rl.close();
        resolve(ans);
    }));
}

/**
 * Check if settings are valid to proceed, if not it will ask for a new course ID and cookie.
 */
async function checkValidSettings() {
    let settings = readStorage();

    if (!settings.moodleCookie) {
        settings.moodleCookie = await askQuestion("Enter Moodle Cookie: ");
        changeCookie(settings.moodleCookie);
    }

    if (settings.courses.length === 0) {
        let newCourse = await askQuestion("Enter Course ID: ");
        await addCourseID(newCourse);
    }

}

/**
 * Function to allow the user to add more course
 */
async function changeSettings() {
    // First print the current courses :
    let settings = readStorage();
    console.log("\nCourses to download: ");
    settings.courses.forEach((course) => {
        console.log(course.toString());
    });
    // Prompt with the user to either type 1 to download or type 2 to add more course
    await askQuestion("\nChoose an option: \n 1. Download All courses PDFs\n 2. Add a course \n 3. Remove a course \n 4. change the cookie").then(async (ans) => {
        switch (ans) {
            case "1":
                break;
            case "2":
                await askQuestion("Enter Course ID: ").then(async (courseID) => {
                    await addCourseID(courseID);
                    await changeSettings();
                });
                break
            case "3":
                await askQuestion("Enter Course ID to remove: ").then(async (courseID) => {
                    let settings = readStorage();
                    settings.courses = settings.courses.filter((course) => course.id !== courseID);
                    removeCourseID(courseID);
                    await changeSettings();
                });
                break;
            case "4":
                await askQuestion("Enter new cookie: ").then((cookie) => {
                    changeCookie(cookie);
                    changeSettings();
                });
                break;
            default:
                process.exit(1);
        }
    })
}