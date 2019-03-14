import {cli} from "../cli/cli";
let shell = require('shelljs');
const max_api = require('max-api');

let arg_url = new cli.Arg('url');
let option_outfile = new cli.Option('o', false, false, true);
let flag_audio_only = new cli.Flag('x');
let option_format = new cli.Option('audio-format');
let option_ffmpeg_location = new cli.Option('ffmpeg-location');

let git_repo = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync';

option_format.set('wav');

flag_audio_only.set(1);

option_ffmpeg_location.set('/usr/local/bin/ffmpeg');

let name_project;

max_api.addHandler('set_url', (url) => {
    arg_url.set(url);
});

max_api.addHandler('set_project_name', (name) => {
    name_project = name.split('/').pop();
});

name_project = 'project_name';

let download = () => {
    let dir_project = git_repo + '/tk_music_projects/projects/' + name_project;

    let dir_audio = dir_project + '/audio';

    let dir_downloads = git_repo + '/tk_music_projects/downloads/';

    // mkdir project name

    shell.mkdir('-p', dir_project);

    // mkdir underneath project called audio

    shell.mkdir('-p', dir_audio);

    // download to 1) audio dir 2) downloads dir

    let msg;

    option_outfile.set(dir_audio + '/' + name_project + '.%(ext)s');

    let executable_youtube_dl_audio = new cli.Executable(
        '/usr/local/bin/youtube-dl',
        [flag_audio_only],
        [option_outfile, option_format, option_ffmpeg_location],
        [arg_url]
    );

    max_api.post(executable_youtube_dl_audio.get_command_full().join(' '));

    shell.exec(
        executable_youtube_dl_audio.get_command_full().join(' '),
        {async: false}
    );

    option_outfile.set(dir_downloads + '/' + name_project + '.%(ext)s');

    let executable_youtube_dl_downloads = new cli.Executable(
        '/usr/local/bin/youtube-dl',
        [flag_audio_only],
        [option_outfile, option_format, option_ffmpeg_location],
        [arg_url]
    );

    shell.exec(
        executable_youtube_dl_downloads.get_command_full().join(' '),
        {async: false}
    );

    max_api.outlet(msg);
};

max_api.addHandler("download", () => {
    download()
});
