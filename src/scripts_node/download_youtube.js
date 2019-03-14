"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("../cli/cli");
var shell = require('shelljs');
// const max_api = require('max-api');
var arg_url = new cli_1.cli.Arg('url');
var option_outfile = new cli_1.cli.Option('o', false, false, true);
var flag_audio_only = new cli_1.cli.Flag('x');
var option_format = new cli_1.cli.Option('audio-format');
var git_repo = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync';
option_format.set('wav');
flag_audio_only.set(1);
var name_project;
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
var download = function () {
    var dir_project = git_repo + '/tk_music_projects/projects/' + name_project;
    var dir_audio = dir_project + '/audio';
    var dir_downloads = git_repo + '/tk_music_projects/downloads/';
    // mkdir project name
    shell.mkdir('-p', dir_project);
    // mkdir underneath project called audio
    shell.mkdir('-p', dir_audio);
    // download to 1) audio dir 2) downloads dir
    var msg;
    option_outfile.set(dir_audio + '/' + name_project + '.%(ext)s');
    var executable_youtube_dl_audio = new cli_1.cli.Executable('/usr/local/bin/youtube-dl', [flag_audio_only], [option_outfile, option_format], [arg_url]);
    shell.exec(executable_youtube_dl_audio.get_command_full().join(' '), { silent: true });
    option_outfile.set(dir_downloads + '/' + name_project + '.%(ext)s');
    var executable_youtube_dl_downloads = new cli_1.cli.Executable('/usr/local/bin/youtube-dl', [flag_audio_only], [option_outfile, option_format], [arg_url]);
    shell.exec(executable_youtube_dl_downloads.get_command_full().join(' '), { silent: true }, function (code, stdout, stderr) {
        if (code === 0) {
            msg = 'done';
        }
        else {
            msg = 'error';
        }
    });
    // max_api.outlet(msg);
};
// max_api.addHandler("download", () => {
//     download()
// });
download();
//# sourceMappingURL=download_youtube.js.map