'use strict';
const fs = require('fs');
const rtmpdump = require('rtmpdump');
const ffmpeg = require('fluent-ffmpeg');
const addSubtitle = require(`./addSubtitle`);

let i = 0;
const downloader = async (downloadList) => {
    const {
        title,
        contentId,
        authTicket,
        summary,
        detail,
        duration,
        alias,
        fileType,
        addSubtitles,
        subject,
        cast
    } = downloadList[i];

    const artist = cast.join(',');
    const options = {
        rtmp: `rtmpe://vod-st.ouj.ac.jp:80/classtream?authTicket=${authTicket}&mp4:1/${contentId}.${fileType}`,
        playpath: `mp4:1/${contentId}.mp4`,
        swfVfy: 'https://vod.ouj.ac.jp/classtream-player/v1.2/js/video-js/5.12.6/video-js.swf'
    };

    // 保存directoryを作成
    if (!fs.existsSync(`./${subject}`)) fs.mkdirSync(`./${subject}`);

    const stream = rtmpdump.createStream(options);

    ffmpeg(stream)
        .outputOptions(
            '-c', 'copy',
            '-metadata', `title=${title}`,
            '-metadata', `artist=${artist}`,
            '-metadata', `comment=${summary}`,
            '-metadata', `album=${subject}`,
            '-metadata', 'album_artist=放送大学',
            '-metadata', 'copyright=放送大学',
            '-metadata', `episode_id=${alias}`,
            '-y')
        .on('start', cmdline => {
            //console.log('Command line: ' + cmdline);
        })
        .on('progress', progress => {
            const progressPercent = Math.round((progress.timemark.slice(3, 5) / (duration / 60)) * 100)
            process.stdout.write(`\rDownloading ${title}: ${progressPercent}%`);
        })
        .on('error', (err, stdout, stderr) => {
            console.log(err);
            console.log('ffmpeg stdout: ' + stdout);
            console.log('ffmpeg stderr: ' + stderr);
        })
        .save(`${subject}/${title}.mp4`)
        .on('end', async () => {
            await console.log(`\rDownloading ${title}: 100% completed`);
            i++;
            if (i < downloadList.length) return downloader(downloadList);
            else {
                console.log('ダウンロードが完了しました。');
                if (downloadList[0].addSubtitles) {
                    await console.log('字幕動画の作成を開始します。')
                    await addSubtitle(downloadList);
                };
            }
        })
}



module.exports = downloader;