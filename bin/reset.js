const fs = require('fs');
const path = require('path');
const appDir = path.resolve(__dirname, '../');

const reset = () => {
    if (fs.existsSync(appDir + '/.credentials')) fs.unlinkSync(appDir + '/.credentials');
    if (fs.existsSync(appDir + '/categories.json')) fs.unlinkSync(appDir + '/categories.json');
    if (fs.existsSync(appDir + '/vod-contents.json')) fs.unlinkSync(appDir + '/vod-contents.json');
    if (fs.existsSync(appDir + '/base-categories.json')) fs.unlinkSync(appDir + '/base-categories.json');
    console.log('設定をリセットしました。');
}

module.exports = reset;