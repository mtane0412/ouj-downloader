require('dotenv').config({
    path: __dirname + '/.credentials'
});
const getDownloadList = require('./getDownloadList');
const downloader = require('./downloader');

(async () => {
    const downloadList = await getDownloadList();
    if (downloadList) await downloader(downloadList);
})();