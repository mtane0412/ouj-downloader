const login = require('./login');
const getAPI = require('./getAPI');

const update = async () => {
    const cookies = await login();
    await getAPI(cookies);
    console.log('APIを更新しました。');
}

module.exports = update;