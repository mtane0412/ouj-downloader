# Deprecated
It no longer works because OUJ has changed its specifications.

# OUJ downloader
The CLI tool to download the streaming video/audio of the Open University of Japan.


## Installation
You need to build ffmpeg.

macOS:

```bash
$ brew install ffmpeg
```

and install this package.
```bash
$ npm install -g ouj-downloader
```

## Usage
The interactive mode starts without arguments.
```bash
$ ouj-downloader
```
There are several commands and options.
```bash
$ ouj-downloader --help
Usage: ouj-downloader [options] [command]

Options:
  -v, --version  output the version number
  -h, --help     output usage information

Commands:
  login          update login information.
  update         update APIs.
  reset          reset login information and APIs.
```

## Release History
- 0.1.3
  - bugfix: fix scrolling through the chapter selection.
- 0.1.2
  - Remove console.time
- 0.1.1
  - Fix exception handling to image subtitles
- 0.1.0
  - The first proper release
- 0.0.1
  - Work in progress

## License
GPL-3.0
