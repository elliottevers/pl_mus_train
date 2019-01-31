// declare let Global: any;
// TODO: make dedicated library object for the following
import {message} from "./message/messenger";
import Messenger = message.Messenger;
import {log} from "./log/logger";
import Logger = log.Logger;
import {cli} from "./cli/cli";

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;

export {}

declare let Global: any;

let env: string = 'node';

if (env === 'max') {
    autowatch = 1;
}

////////////////////

let messenger: Messenger;

let logger: Logger;

let outlet_shell_obj = 0;

let executables = [];

let executable: cli.Executable;

let dir = '/Users/elliottevers/Documents/git-repos.nosync/music/';

let path_interpreter = dir + '.venv_36_test/bin/python';

let init = () => {

    messenger = new Messenger(env, outlet_shell_obj);
    logger = new Logger(env);

    let arg_url = new cli.Arg('url');
    let option_outfile = new cli.Option('o', true);
    let flag_audio_only = new cli.Flag('x');

    // /usr/local/bin/youtube-dl -x -o \"/Users/elliottevers/Documents/git-repos.nosync/audio/youtube/tswift_teardrops.%(ext)s\" https://www.youtube.com/watch?v=CbkvLYrEvF4

    let executable_youtube_dl = new cli.Executable(
        '/usr/local/bin/youtube-dl',
        [flag_audio_only],
        [option_outfile],
        [arg_url],
        messenger
    );

    executables.push(executable_youtube_dl);



    let arg_file_out = new cli.Arg('file_out');

    let option_file_input = new cli.Option('i');

    // /usr/local/bin/ffmpeg -i /Users/elliottevers/Documents/git-repos.nosync/audio/youtube/tswift_teardrops.* /Users/elliottevers/Documents/git-repos.nosync/audio/youtube/tswift_teardrops.mp3

    let executable_ffmpeg = new cli.Executable(
        '/usr/local/bin/ffmpeg',
        [],
        [option_file_input],
        [arg_file_out],
        messenger
    );

    executables.push(executable_ffmpeg);

};

let run_executable = (path_executable) => {
    _lookup_executable(path_executable).run()
};


let set_arg = (path_executable, name_arg, val_arg) => {
    _lookup_executable(path_executable).get_arg(name_arg).set(val_arg);
};

let set_flag = (path_executable, name_flag, val_flag) => {
    _lookup_executable(path_executable).get_flag(name_flag).set(val_flag);
};

let set_option = (path_executable, name_opt, val_opt) => {
    _lookup_executable(path_executable).get_opt(name_opt).set(val_opt);
};

let _lookup_executable = (path_executable) => {
    return executables.filter((executable) => {
        return executable.get_command_exec() === path_executable;
    })[0];
};

let get_cmd = (path_executable) => {
    // return logger.log(
    //     _lookup_executable(path_executable).get_run_command().split(' ')
    // );
    return _lookup_executable(path_executable).get_run_command().split(' ')

};

let test = () => {

    set_arg('/usr/local/bin/youtube-dl', 'url', 'https://www.youtube.com/watch?v=CbkvLYrEvF4');
    set_option('/usr/local/bin/youtube-dl', 'o', '/Users/elliottevers/Documents/git-repos.nosync/audio/youtube/tswift_teardrops.%(ext)s');
    set_flag('/usr/local/bin/youtube-dl', 'x', 1);


    get_cmd('/usr/local/bin/youtube-dl');


    set_arg('/usr/local/bin/ffmpeg', 'file_out', '/Users/elliottevers/Documents/git-repos.nosync/audio/youtube/tswift_teardrops.mp3');
    set_option('/usr/local/bin/ffmpeg', 'i', '/Users/elliottevers/Documents/git-repos.nosync/audio/youtube/tswift_teardrops.*');

    get_cmd('/usr/local/bin/ffmpeg');
};

init();
test();


if (typeof Global !== "undefined") {
    Global.command_shell = {};
    Global.command_shell.set_arg = set_arg;
    Global.command_shell.set_option = set_option;
    Global.command_shell.set_flag = set_flag;
    Global.command_shell.init = init;
    Global.command_shell.get_cmd = get_cmd;
    Global.command_shell.run_executable = run_executable;
    Global.command_shell.test = test;
}
