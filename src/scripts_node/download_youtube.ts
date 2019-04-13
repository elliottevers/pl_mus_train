import {cli} from "../cli/cli";
import {PythonShell} from "python-shell";
const max_api = require('max-api');

let arg_url = new cli.Arg('url');
let flag_audio_only = new cli.Flag('x');
let option_format = new cli.Option('audio-format');
let option_ffmpeg_location = new cli.Option('ffmpeg-location');
let option_name_project = new cli.Option('name-project');
let option_path_executable = new cli.Option('path-executable');

option_format.set('wav');

flag_audio_only.set(1);

option_ffmpeg_location.set('/usr/local/bin/ffmpeg');

option_path_executable.set('/usr/local/bin/youtube-dl');

max_api.addHandler('set_url', (url) => {
    arg_url.set(url);
});

max_api.addHandler('set_project_name', (name) => {
    let name_project = name.split('/').pop();
    option_name_project.set(name_project)
});

let download = () => {

    let options_python_shell;

    let path_interpreter = '/Users/elliottevers/DocumentsTurbulent/venvwrapper/master_36/bin/python';

    let dir_scripts_python = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/music/src/scripts/';

    let path_script = dir_scripts_python + 'download_youtube.py';

    let script = new cli.Script(
        path_interpreter,
        path_script,
        [flag_audio_only],
        [option_name_project, option_path_executable, option_format, option_ffmpeg_location],
        [arg_url]
    );

    options_python_shell = {
        mode: 'text',
        pythonPath: path_interpreter,
        args: script.get_run_parameters().split(' ')
    };

    PythonShell.run(script.script, options_python_shell, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        max_api.outlet(results.toString().trim());
        // console.log(results);
    });
};

max_api.addHandler("download", () => {
    download()
});

// download()
