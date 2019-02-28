const axios = require('axios').default;
const cheerio = require('cheerio');
const mongo = require('mongodb');
let collection = null;

var MongoClient = mongo.MongoClient
var mongo_url = process.env.MONGO_URL || "mongodb://db:27017/deephack"
MongoClient.connect(mongo_url, (err, db) => {
    if (err)
        console.log(err);
    else
        collection=db.collection('hacks');
});

// If this exists then backlog is filled
const FINAL_PROJECT = 'mega-browser';

const sleep = async (delay) => new Promise((resolve, reject) => {
    setTimeout(() => resolve(), delay);
});

// Iterates but waits delay ms between each
async function mapDelayed(arr, func, delay) {
    return new Promise((resolve, reject) => {
        let res = [];

        async function f(idx) {
            try {
                if (idx >= arr.length) {
                    resolve(res);
                    return;
                }
                res[idx] = await func(arr[idx]);
                setTimeout(() => f(++idx), delay)
            } catch(e) {
                reject(e);
            }
        }
        f(0);
    });
}

async function scraper() {
    console.log('Starting scraper');

    // First get the newest projects 
    await scrapeFromPageForwards(0)

    await sleep(1000);
    // Whether to fetch old pages
    if (await collection.findOne({ id: FINAL_PROJECT })) {
        console.log("Scraping finished");
        return;
    }

    // Binary search of projects to find where scraping got to
    let min_page = 0;
    let max_page = await getNumberOfSoftwarePages();

    while (true) {
        if (max_page - min_page <= 1) {
            console.log("Filling cache from page ", max_page, " onwards");
            await scrapeFromPageForwards(max_page);
            break;
        }
        let midPage = Math.floor((min_page+max_page) / 2);
        const pageProjects = await getSoftwareLinks(midPage);
        const allProjectsSaved = (await Promise.all(pageProjects.map(async (project) => {
            return !!(await collection.findOne({ id: project.projectSlug }));
        }))).reduce((prev, curr) => prev && curr);

        console.log({min_page, midPage, max_page, allProjectsSaved});
        if (allProjectsSaved) {
            min_page = midPage;
        } else {
            max_page = midPage;
        }
    }

    console.log(max_page);
}

async function getNumberOfSoftwarePages() {
    const r = await axios.get(`https://devpost.com/software/newest`);
    const $ = cheerio.load(r.data);
    return parseInt($('li.next.next_page').prev().text());
}

// Keeps scraping until the end or nothing more
async function scrapeFromPageForwards(pageNum) {
    while (true) {
        const pageProjects = await getSoftwareLinks(pageNum);
        const allProjectsSaved = (await Promise.all(pageProjects.map(async (project) => {
            return !!(await collection.findOne({ id: project.projectSlug }));
        }))).reduce((prev, curr) => prev && curr);

        if (allProjectsSaved) return;

        const projects = await mapDelayed(pageProjects.map(p => p.projectSlug), saveProject, 1000);
        pageNum++;
    }
}

// Get an array of software links on a devpost page
async function getSoftwareLinks(pageNum) {
    const r = await axios.get(`https://devpost.com/software/newest?page=${pageNum}`);
    const $ = cheerio.load(r.data);

    const links = $('a.link-to-software').map((i, element) => {
        return {
            'href': $(element).attr('href'),
            'projectSlug': $(element).attr('href').replace('https://devpost.com/software/', ''),
        };
    }).get();

    return links;
}

async function saveProject(projectSlug) {
    const r = await axios.get(`https://devpost.com/software/${projectSlug}`);
    const $ = cheerio.load(r.data);

    const doc = {
        'id': projectSlug,
        'title': $('#app-title').text(),
        'num_likes': parseInt($('.like-button > .side-count').first().text().trim()) || 0,
        'num_comments': parseInt($('.lsoftware-comment-button > .side-count').first().text().trim()) || 0,
        'description_length': $('.app-details').text().length,
        'num_contributors': $('li.software-team-member').length,
        'tags': $('span.cp-tag').map((i, e) => $(e).text()).get().sort(),
        'hackathon_name': $('a', '.software-list-content').first().text() || null,
        'num_prizes': $('span.winner', '.software-list-content').length,
        'timestamp': $('time').first().attr('datetime'),
    }
    console.log(doc);

    await collection.insert(doc);
}

module.exports = scraper;
