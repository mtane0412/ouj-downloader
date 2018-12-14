const puppeteer = require('puppeteer');
const inquirer = require('inquirer');
const fs = require('fs');
const consoleColor = require('./consoleColor');

let browser, page;

const login = async () => {
    console.log('ログイン中...');
    browser = await puppeteer.launch();
    page = await browser.newPage();

    // cookieを保存してブラウザを閉じる
    const cookies = await loginInput();
    await browser.close();
    return cookies;
}

const loginInput = async (status) => {
    if (status === 'error') console.log(consoleColor.red + 'ログインIDとパスワードが正しくありません');
    // ログインページ
    await page.goto('https://sso.ouj.ac.jp/cas/login?service=https%3A%2F%2Fvod.ouj.ac.jp%2Fv1%2Ftenants%2F1%2Flogin%2Fcas%3FredirectUrl%3Dhttps%253A%252F%252Fvod.ouj.ac.jp%252Fview%252Fouj%252F%2523%252Flogin');

    // 入力
    let USERNAME, PASSWORD;
    if (!process.env.USERNAME || !process.env.PASSWORD || status === 'error') {
        [USERNAME, PASSWORD] = await inquirer
            .prompt([{
                    type: 'input',
                    name: 'USERNAME',
                    message: 'ログインIDを入力してください'
                },
                {
                    type: 'password',
                    name: 'PASSWORD',
                    mask: '*',
                    message: 'パスワードを入力してください'
                }
            ])
            .then(answers => {
                return [answers.USERNAME, answers.PASSWORD];
            })
    } else {
        [USERNAME, PASSWORD] = [process.env.USERNAME, process.env.PASSWORD];
    }

    await page.type("#username", USERNAME);
    await page.type("#password", PASSWORD);
    // submitをクリック
    const loginButton = await page.$('input[type=submit]');
    await loginButton.click();

    // 遷移を待つ
    await page.waitForNavigation({
        timeout: 60000,
        waitUntil: "domcontentloaded"
    });
    // 遷移後のurlを入力
    let url = await page.url();

    // ログインできなかったときは入力し直す
    if (url !== 'https://vod.ouj.ac.jp/view/ouj/') return loginInput('error');

    await page.goto('https://vod.ouj.ac.jp/v1/tenants/1/');
    console.log('ログイン完了');

    // パスワードを .credentials に保存する
    if (!process.env.USERNAME || !process.env.PASSWORD || process.env.USERNAME !== USERNAME || process.env.PASSWORD !== PASSWORD) {
        await inquirer
            .prompt([{
                type: 'confirm',
                name: 'save',
                message: 'ログインIDとパスワードを保存しますか？',
                default: false
            }])
            .then(answers => {
                if (answers.save) fs.writeFileSync(__dirname + '/.credentials', `USERNAME='${USERNAME}'\nPASSWORD='${PASSWORD}'`);
            })
    }
    return page.cookies();
}

module.exports = login;