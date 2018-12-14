const fs = require('fs');

//if (fs.existsSync(__dirname + '/.credentials')) fs.unlinkSync(__dirname + '/.credentials');
if (fs.existsSync(__dirname + '/categories.json')) fs.unlinkSync(__dirname + '/categories.json');
if (fs.existsSync(__dirname + '/vod-contents.json')) fs.unlinkSync(__dirname + '/vod-contents.json');
if (fs.existsSync(__dirname + '/base-categories.json')) fs.unlinkSync(__dirname + '/base-categories.json');

console.log('設定をリセットしました。');