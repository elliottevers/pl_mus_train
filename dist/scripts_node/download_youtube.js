"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("../cli/cli");
var python_shell_1 = require("python-shell");
var max_api = require('max-api');
var arg_url = new cli_1.cli.Arg('url');
// let option_outfile = new cli.Option('o', false, false, true);
var flag_audio_only = new cli_1.cli.Flag('x');
var option_format = new cli_1.cli.Option('audio-format');
var option_ffmpeg_location = new cli_1.cli.Option('ffmpeg-location');
var option_name_project = new cli_1.cli.Option('name-project');
var option_path_executable = new cli_1.cli.Option('path-executable');
option_format.set('wav');
flag_audio_only.set(1);
option_ffmpeg_location.set('/usr/local/bin/ffmpeg');
option_path_executable.set('/usr/local/bin/youtube-dl');
max_api.addHandler('set_url', function (url) {
    arg_url.set(url);
});
// arg_url.set('https://www.youtube.com/watch?v=j6TmogXhOZ8');
max_api.addHandler('set_project_name', function (name) {
    var name_project = name.split('/').pop();
    option_name_project.set(name_project);
});
// option_name_project.set('dream');
var download = function () {
    var options_python_shell;
    var path_interpreter = '/Users/elliottevers/DocumentsTurbulent/venvwrapper/master_36/bin/python';
    var dir_scripts_python = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/music/src/scripts/';
    var path_script = dir_scripts_python + 'download_youtube.py';
    var script = new cli_1.cli.Script(path_interpreter, path_script, [flag_audio_only], [option_name_project, option_path_executable, option_format, option_ffmpeg_location], [arg_url]);
    options_python_shell = {
        mode: 'text',
        pythonPath: path_interpreter,
        args: script.get_run_parameters().split(' ')
    };
    python_shell_1.PythonShell.run(script.script, options_python_shell, function (err, results) {
        if (err)
            throw err;
        // results is an array consisting of messages collected during execution
        max_api.outlet(results.toString().trim());
        // console.log(results);
    });
};
max_api.addHandler("download", function () {
    download();
});
// download()
//# sourceMappingURL=download_youtube.js.map