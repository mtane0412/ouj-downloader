const puppeteer = require('puppeteer');
const fs = require('fs');

const getAPI = async (cookies) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // クッキーをセット
    await page.setCookie(...cookies);

    process.stdout.write('データを取得中...');

    //  API取得 
    await page.goto('https://vod.ouj.ac.jp/v1/tenants/1/categories');
    categories = await page.evaluate(() => {
        return JSON.parse(document.querySelector("body").innerText);
    });

    await page.goto('https://vod.ouj.ac.jp/v1/tenants/1/vod-contents/');
    vodContents = await page.evaluate(() => {
        return JSON.parse(document.querySelector("body").innerText);
    });

    // ラジオ番組の字幕付加実験のサブカテゴリーを取得
    const experimentCategories = categories.filter(category => category.parentId === 5).map(category => category.categoryId);
    const experimentSubjects = categories.reduce((result, current) => {
        if (experimentCategories.indexOf(current.parentId) > -1) {
            const originalCategoryId = categories
                .filter(originalCategory => originalCategory.alias === current.alias.slice(0, -1))
                .map(category => category.categoryId)[0];
            result[current.categoryId] = originalCategoryId;
        }
        return result;
    }, {})

    // categoryIdをkeyにした vod-contents オブジェクトを作成
    const downloadAPI = categories.reduce((result, current) => {
        const key = current.categoryId;
        result[key] = current;
        result[key].seniorProfessors = current.summary
            .replace(/\(.*?\)\s?/g, "")
            .replace(/　/g, " ")
            .split(/(、|,)/);
        result[key].vodContents = {};
        return result;
    }, {})
    // downloadAPI にvodContents の情報を付与
    for (let i = 0; i < vodContents.length; i++) {
        const key = vodContents[i].categoryId;
        const vodKey = vodContents[i].alias.length > 2 ? 1 : vodContents[i].alias; // 特別講義の場合は 1 をkeyにする
        vodContents[i].subject = downloadAPI[key].name.split(' ')[1]; // 科目名プロパティを各授業に追加
        // ラジオ字幕カテゴリーの場合は detail をオリジナルからコピー
        if (experimentSubjects.hasOwnProperty(vodContents[i].categoryId)) {
            const categoryId = vodContents[i].categoryId;
            const originalCategoryId = experimentSubjects[categoryId];
            vodContents[i].detail = vodContents[originalCategoryId].detail;
        }
        // detail前処理
        vodContents[i].detail = vodContents[i].detail
            .replace(/　+/g, ' ')
            .replace(/、/g, ',')
            .replace(/：/g, ':')
            .replace(/(\s|,)\s?ゲスト\s?:\s?/g, ",");
        // 各授業の担当講師を追加
        switch (vodContents[i].detail.split(/\r\n|\r|\n/).length) {
            case 4:
                vodContents[i].cast = vodContents[i].detail.split(/\r\n|\r|\n/)[2].split(','); 
                break;
            case 3:
                vodContents[i].cast = vodContents[i].detail.split(/\r\n|\r|\n/)[1].split(','); 
                break;
            case 2:
                vodContents[i].cast = vodContents[i].detail.split(/\r\n|\r|\n/)[0].split(','); 
                break;
            default:
                vodContents[i].cast = vodContents[i].detail;
        }
        downloadAPI[key].vodContents[vodKey] = vodContents[i];
    }
    // 学部・大学院・コース等のベースとなるカテゴリー
    baseCategories = categories.filter(category => category.categoryId <= 29).reduce((result, current) => {
        result[current.categoryId] = current.name.split(' ')[1];
        return result;
    }, {});

    // APIをローカルに保存
    await fs.writeFileSync(__dirname + '/categories.json', JSON.stringify(categories));
    await fs.writeFileSync(__dirname + '/vod-contents.json', JSON.stringify(vodContents));
    await fs.writeFileSync(__dirname + '/base-categories.json', JSON.stringify(baseCategories));
    await fs.writeFileSync(__dirname + '/downloadAPI.json', JSON.stringify(downloadAPI));

    console.log('完了');

    await browser.close();

    return [categories, vodContents, baseCategories, downloadAPI];
}

module.exports = getAPI;