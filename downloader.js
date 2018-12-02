'use strict';
const rtmpdump = require('rtmpdump');
const ffmpeg = require('fluent-ffmpeg');

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
        fileType
    } = downloadList[i];

    let [subject, artist] = detail.split('\n');
    artist = artist.replace(/　/g, ' ').replace(/\,/g, ', ');
    const options = {
        rtmp: `rtmpe://vod-st.ouj.ac.jp:80/classtream?authTicket=${authTicket}&mp4:1/${contentId}.${fileType}`,
        playpath: `mp4:1/${contentId}.mp4`,
        swfVfy: 'https://vod.ouj.ac.jp/classtream-player/v1.2/js/video-js/5.12.6/video-js.swf'
    };

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
            // console.log('Command line: ' + cmdline);
        })
        .on('codecData', data => {
            //const duration = data.duration;
        })
        .on('progress', progress => {
            const progressPercent = Math.round((progress.timemark.slice(3, 5) / (duration / 60)) * 100)
            process.stdout.write(`Downloading ${title}: ${progressPercent}%\r`);
        })
        .on('error', (err, stdout, stderr) => {
            console.log(err);
            console.log('ffmpeg stdout: ' + stdout);
            console.log('ffmpeg stderr: ' + stderr);
        })
        .save(`${subject} ${title}.mp4`)
        .on('end', async () => {
            console.log(`Downloading ${title}: 100% completed`);
            i++;
            if (i < downloadList.length) return downloader(downloadList);
            else return console.log('ダウンロードが完了しました。');
        })
}



module.exports = downloader;