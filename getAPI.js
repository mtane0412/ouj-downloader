const getAPI = async () => {
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

    // 学部・大学院・コース等のベースとなるカテゴリー
    baseCategories = categories.filter(category => category.categoryId <= 29).reduce((result, current) => {
        result[current.categoryId] = current.name.split(' ')[1];
        return result;
    }, {});

    // APIをローカルに保存
    await fs.writeFileSync(__dirname + '/categories.json', JSON.stringify(categories));
    await fs.writeFileSync(__dirname + '/vod-contents.json', JSON.stringify(vodContents));
    await fs.writeFileSync(__dirname + '/base-categories.json', JSON.stringify(baseCategories));

    console.log('完了');

    await browser.close();
}

module.exports = getAPI;