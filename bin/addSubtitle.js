'use strict';
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

let i = 0;
const addSubtitle = async (downloadList) => {
    const {
        title,
        subject
    } = downloadList[i];

    // 保存directoryを作成
    if (!fs.existsSync(`./${subject}/subbed`)) fs.mkdirSync(`./${subject}/subbed`);

    await ffmpeg(`./${subject}/${title}.mp4`)
        .outputOption('-y')
        .videoFilter(`subtitles='${subject}/subtitles/${title}.srt':force_style='FontName=YuGothic Bold, BorderStyle=3'`)
        .on('start', cmdline => {
            //console.log('Command line: ' + cmdline);
        })
        .on('progress', progress => {
            process.stdout.write(`\rAdd subtitles to ${title}: ${Math.round(progress.percent)}%`);
        })
        .on('error', (err, stdout, stderr) => {
            console.log(err);
            console.log('ffmpeg stdout: ' + stdout);
            console.log('ffmpeg stderr: ' + stderr);
        })
        .save(`${subject}/subbed/${title}(字幕).mp4`)
        .on('end', async () => {
            await console.log(`\rAdd subtitles to ${title}: 100% complete`);
            i++;
            if (i < downloadList.length) return addSubtitle(downloadList);
            else return console.log('字幕動画の作成を完了しました。');
        })
}

module.exports = addSubtitle;