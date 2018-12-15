#!/usr/bin/env node

const path = require('path');
const appDir = path.resolve(__dirname, '../');

require('dotenv').config({
    path: appDir + '/.credentials'
});
const program = require('commander');
const getDownloadList = require('./getDownloadList');
const downloader = require('./downloader');
const login = require('./login')
const update = require('./update');
const reset = require('./reset');


program.version(require(appDir + '/package.json').version, '-v, --version');

program
    .command('login')
    .description('update login information.')
    .action(() => {
        login('relog')
    });

program
    .command('update')
    .description('update APIs.')
    .action(update);

program
    .command('reset')
    .description('reset login information and APIs.')
    .action(reset);

program.parse(process.argv);

// コマンドなしの場合、対話モードを起動
if (process.argv[2] === undefined) {
    return (async () => {
        const downloadList = await getDownloadList();
        if (downloadList) await downloader(downloadList);
    })();
}

// 定義されたコマンド以外はエラーを表示
if (process.argv[2] !== 'login' && process.argv[2] !== 'update' && process.argv[2] !== 'reset') {
    console.log(`error: unknown command '${process.argv[2]}'`);
};