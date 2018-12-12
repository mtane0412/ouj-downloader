'use strict'

const msToTime = (match, duration) => {
    const hour = Math.floor(duration / 3600000);
    const minute = Math.floor((duration - 3600000 * hour) / 60000);

    const hh = ('00' + hour).slice(-2);
    const mm = ('00' + minute).slice(-2);
    const ms = ('00000' + (duration % 60000)).slice(-5);
    const time = `${hh}:${mm}:${ms.slice(0,2)},${ms.slice(2,5)}`;

    return time + '::';
}
const hankana2zenkana = (str) => {
    var kanaMap = {
        'ｶﾞ': 'ガ',
        'ｷﾞ': 'ギ',
        'ｸﾞ': 'グ',
        'ｹﾞ': 'ゲ',
        'ｺﾞ': 'ゴ',
        'ｻﾞ': 'ザ',
        'ｼﾞ': 'ジ',
        'ｽﾞ': 'ズ',
        'ｾﾞ': 'ゼ',
        'ｿﾞ': 'ゾ',
        'ﾀﾞ': 'ダ',
        'ﾁﾞ': 'ヂ',
        'ﾂﾞ': 'ヅ',
        'ﾃﾞ': 'デ',
        'ﾄﾞ': 'ド',
        'ﾊﾞ': 'バ',
        'ﾋﾞ': 'ビ',
        'ﾌﾞ': 'ブ',
        'ﾍﾞ': 'ベ',
        'ﾎﾞ': 'ボ',
        'ﾊﾟ': 'パ',
        'ﾋﾟ': 'ピ',
        'ﾌﾟ': 'プ',
        'ﾍﾟ': 'ペ',
        'ﾎﾟ': 'ポ',
        'ｳﾞ': 'ヴ',
        'ﾜﾞ': 'ヷ',
        'ｦﾞ': 'ヺ',
        'ｱ': 'ア',
        'ｲ': 'イ',
        'ｳ': 'ウ',
        'ｴ': 'エ',
        'ｵ': 'オ',
        'ｶ': 'カ',
        'ｷ': 'キ',
        'ｸ': 'ク',
        'ｹ': 'ケ',
        'ｺ': 'コ',
        'ｻ': 'サ',
        'ｼ': 'シ',
        'ｽ': 'ス',
        'ｾ': 'セ',
        'ｿ': 'ソ',
        'ﾀ': 'タ',
        'ﾁ': 'チ',
        'ﾂ': 'ツ',
        'ﾃ': 'テ',
        'ﾄ': 'ト',
        'ﾅ': 'ナ',
        'ﾆ': 'ニ',
        'ﾇ': 'ヌ',
        'ﾈ': 'ネ',
        'ﾉ': 'ノ',
        'ﾊ': 'ハ',
        'ﾋ': 'ヒ',
        'ﾌ': 'フ',
        'ﾍ': 'ヘ',
        'ﾎ': 'ホ',
        'ﾏ': 'マ',
        'ﾐ': 'ミ',
        'ﾑ': 'ム',
        'ﾒ': 'メ',
        'ﾓ': 'モ',
        'ﾔ': 'ヤ',
        'ﾕ': 'ユ',
        'ﾖ': 'ヨ',
        'ﾗ': 'ラ',
        'ﾘ': 'リ',
        'ﾙ': 'ル',
        'ﾚ': 'レ',
        'ﾛ': 'ロ',
        'ﾜ': 'ワ',
        'ｦ': 'ヲ',
        'ﾝ': 'ン',
        'ｧ': 'ァ',
        'ｨ': 'ィ',
        'ｩ': 'ゥ',
        'ｪ': 'ェ',
        'ｫ': 'ォ',
        'ｯ': 'ッ',
        'ｬ': 'ャ',
        'ｭ': 'ュ',
        'ｮ': 'ョ',
        '｡': '。',
        '､': '、',
        '-': 'ー',
        'ｰ': 'ー',
        '｢': '「',
        '｣': '」',
        '･': '・'
    };

    const reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
    return str
        .replace(reg, (match) => kanaMap[match])
        .replace(/ﾞ/g, '゛')
        .replace(/ﾟ/g, '゜');
};

const smi2srt = (smi) => {
    smi = hankana2zenkana(smi)
        .replace(/<sami>[\s\S\r]*<\/style>(\r\n|\r|\n)|<\/sami>|<\/?SPAN.*?>|<\/?P.*?>|<RUBY>\.<RT>\.<\/RT><\/RUBY>|\.|<\/?RUBY>|<\/sync>/gi, "")
        .replace(/<RT>/g, "(")
        .replace(/<\/RT>/g, ")")
        .replace(/&#65374;/g, "〜")
        .replace(/<br>/g, ':return:')
        .replace(/.*?start="(\d*?)".*?>/g, msToTime)
        .replace(/(\r\n|\r|\n){2,}/g, '\n')
        .replace(/.*?ENCC[\s\S\r\n]*/g, '');

    const blocks = smi.split('\n');
    let srt = new String;
    blocks.reduce((previous, current, index) => {
        let [startTime, preSub] = previous.split('::');
        let endTime = current.split('::')[0];
        if (endTime) {
            srt += `${index}\n${startTime} --> ${endTime}\n${preSub.replace(/:return:/g, '\n')}\n`;
        }
        return current;
    })

    return srt;
}

module.exports = smi2srt;