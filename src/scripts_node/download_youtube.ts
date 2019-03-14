import {cli} from "../cli/cli";
let shell = require('shelljs');
// const max_api = require('max-api');

let arg_url = new cli.Arg('url');
let option_outfile = new cli.Option('o', false, false, true);
let flag_audio_only = new cli.Flag('x');
let option_format = new cli.Option('audio-format');

let git_repo = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync';

option_format.set('wav');

flag_audio_only.set(1);

let name_project;

// TODO: set arg url
// TODO: get project name from save dialog

// max_api.addHandler('set_url', (url) => {
//     arg_url.set(url);
// });
//
// max_api.addHandler('set_project_name', (name) => {
//     name_project = name
// });

// max_api.addHandler('set_url', (url) => {
//     arg_url.set(url);
// });
//
// max_api.addHandler('set_project_name', (name) => {
//     name_project = name
// });

arg_url.set('https://www.youtube.com/watch?v=Uybtn6ebG0I');

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
        [option_outfile, option_format],
        [arg_url]
    );

    shell.exec(
        executable_youtube_dl_audio.get_command_full().join(' '),
        {silent: true}
    );

    option_outfile.set(dir_downloads + '/' + name_project + '.%(ext)s');

    let executable_youtube_dl_downloads = new cli.Executable(
        '/usr/local/bin/youtube-dl',
        [flag_audio_only],
        [option_outfile, option_format],
        [arg_url]
    );

    shell.exec(
        executable_youtube_dl_downloads.get_command_full().join(' '),
        {silent: true},
        (code, stdout, stderr) => {
            if (code === 0) {
                msg = 'done'
            } else {
                msg = 'error'
            }
        }
    );

    // max_api.outlet(msg);
};

// max_api.addHandler("download", () => {
//     download()
// });

download()