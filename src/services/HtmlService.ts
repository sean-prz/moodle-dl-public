import * as cheerio from 'cheerio';
import * as path from 'path';
import * as fs from 'fs';
import {Resource} from "../models/Resource";


// Functions that parse the HTML, meaning take html string as input.



/**
 * Parse the html of a moodle course to find the pdfs
 * @param courseHTML
 * @param courseID
 */
export function findPdfsFromHtml(courseHTML : string, courseID: string) : Resource[] {
    const $ = cheerio.load(courseHTML);
    return $("li.section").map((i, sec) => {
        return $(sec).find("li.activity.resource").map((_, el) => {
            const hasAnchor = $(el).find("a[href]").length > 0;
            const isPdf = $(el).find("img[src*='pdf-24']").length > 0;
            if (hasAnchor && isPdf) {
                const id = $(el).attr('data-id');
                const title = $(el).find(".activity-information").attr("data-activityname")
                if (id && title) {
                    return new Resource(courseID, id, title, i.toString())
                }
            }
        }).filter((_, el) => el !== undefined).get();
    }).get()
}

/**
 * Take the course HTML page and return the title of the course
 * @param courseHTML
 */
export function findCourseTitle(courseHTML: string) {
    const $ = cheerio.load(courseHTML);
    return $("h1.h2").text();
}
