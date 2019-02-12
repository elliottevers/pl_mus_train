// declare let Global: any;
// TODO: make dedicated library object for the following
import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {log} from "../log/logger";
import Logger = log.Logger;
import {cli} from "../cli/cli";

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    autowatch = 1;
}

let messenger: Messenger;

let logger: Logger;

let outlet_shell_obj = 0;

// let executables = [];

// let executable: cli.Executable;

// let dir = '/Users/elliottevers/Documents/git-repos.nosync/music/';

// let path_interpreter = dir + '.venv_36_test/bin/python';

messenger = new Messenger(env, outlet_shell_obj);

logger = new Logger(env);

// let arg_url = new cli.Arg('url');
// let option_outfile = new cli.Option('o', true);
// let flag_audio_only = new cli.Flag('x');
//
// let executable_youtube_dl = new cli.Executable(
//     '/usr/local/bin/youtube-dl',
//     [flag_audio_only],
//     [option_outfile],
//     [arg_url],
//     messenger
// );

// executables.push(executable_youtube_dl);


let arg_file_out = new cli.Arg('file_out', false, true);

let option_file_input = new cli.Option('i', false, true);

let executable_ffmpeg = new cli.Executable(
    '/usr/local/bin/ffmpeg',
    [],
    [option_file_input],
    [arg_file_out],
    messenger
);

// executables.push(executable_ffmpeg);

// let init = () => {
//
//     messenger = new Messenger(env, outlet_shell_obj);
//     logger = new Logger(env);
//
//     let arg_url = new cli.Arg('url');
//     let option_outfile = new cli.Option('o', true);
//     let flag_audio_only = new cli.Flag('x');
//
//     let executable_youtube_dl = new cli.Executable(
//         '/usr/local/bin/youtube-dl',
//         [flag_audio_only],
//         [option_outfile],
//         [arg_url],
//         messenger
//     );
//
//     executables.push(executable_youtube_dl);
//
//
//     let arg_file_out = new cli.Arg('file_out', false, true);
//
//     let option_file_input = new cli.Option('i', false, true);
//
//     let executable_ffmpeg = new cli.Executable(
//         '/usr/local/bin/ffmpeg',
//         [],
//         [option_file_input],
//         [arg_file_out],
//         messenger
//     );
//
//     executables.push(executable_ffmpeg);
//
// };

// let run_executable = (path_executable) => {
//     _lookup_executable(path_executable).run()
// };

let run = () => {
    executable_ffmpeg.run()
};


let set_arg = (name_arg, val_arg) => {
    // post(path_executable);
    // post(name_arg);
    // post(val_arg);
    executable_ffmpeg.get_arg(name_arg).set(val_arg);
};

let set_flag = (name_flag, val_flag) => {
    // post(path_executable);
    // post(name_flag);
    // post(val_flag);
    executable_ffmpeg.get_flag(name_flag).set(val_flag);
};

let set_option = (name_opt, val_opt) => {
    // post(path_executable);
    // post(name_opt);
    // post(val_opt);
    executable_ffmpeg.get_opt(name_opt).set(val_opt);
};

// let _lookup_executable = (path_executable) => {
//     return executables.filter((executable) => {
//         return executable.get_command_exec() === path_executable;
//     })[0];
// };

// let log_cmd = (path_executable) => {
//     logger.log(
//         _lookup_executable(path_executable).get_run_command().split(' ')
//     );
//     // return _lookup_executable(path_executable).get_run_command().split(' ')
//
// };

let test = () => {
    let git_repo = '/Users/elliottevers/Documents/Documents - Elliott’s MacBook Pro/git-repos.nosync';
    //
    // set_arg('/usr/local/bin/youtube-dl', 'url', 'https://www.youtube.com/watch?v=CbkvLYrEvF4');
    // set_option('/usr/local/bin/youtube-dl', 'o', git_repo + '/audio/youtube/tswift_teardrops.%(ext)s');
    // set_flag('/usr/local/bin/youtube-dl', 'x', 1);

    // messenger.message(log_cmd('/usr/local/bin/youtube-dl'));


    set_arg('file_out', git_repo + '/audio/youtube/tswift_teardrops.mp3');
    set_option('i', git_repo + '/audio/youtube/tswift_teardrops.*');

    // messenger.message(log_cmd('/usr/local/bin/ffmpeg'));
};


if (typeof Global !== "undefined") {
    Global.convert_youtube = {};
    Global.convert_youtube.set_arg = set_arg;
    Global.convert_youtube.set_option = set_option;
    Global.convert_youtube.set_flag = set_flag;
    Global.convert_youtube.run = run;
    // Global.command_shell.init = init;
    // Global.command_shell.log_cmd = log_cmd;
    // Global.command_shell.run_executable = run_executable;
    Global.convert_youtube.test = test;
    // Global.command_shell._lookup_executable = _lookup_executable;
}
