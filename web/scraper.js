const axios = require('axios').default;
const cheerio = require('cheerio');

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
    // const links = await getSoftwareLinks(0);
    // console.log(await getProjectMeta(links[0].projectSlug));

    const r = await mapDelayed([1, 2, 3], a => a*a, 1000);
    console.log(r);
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

async function getProjectMeta(projectSlug) {
    const r = await axios.get(`https://devpost.com/software/${projectSlug}`);
    const $ = cheerio.load(r.data);

    return {
        'title': $('#app-title').text(),
    }
}

module.exports = scraper;
