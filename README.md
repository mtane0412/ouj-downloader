# OUJ downloader
The CLI tool to download the streaming video/audio of the Open University of Japan.


## Installation
You need to build ffmpeg with libass.

macOS:

```bash
$ brew install ffmpeg --with-libass
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
- 0.1.0
    - The first proper release
- 0.0.1
    - Work in progress

## License
GPL-3.0