require('dotenv').config({
    path: __dirname + '/.credentials'
});
const scrape = require('./scrape');
const downloader = require('./downloader');

(async () => {
    const downloadList = await scrape();
    if (downloadList) await downloader(downloadList);
})();