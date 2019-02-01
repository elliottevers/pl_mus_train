"use strict";
// declare let Global: any;
// TODO: make dedicated library object for the following
// import {message} from "./message/messenger";
// import Messenger = message.Messenger;
// import {log} from "./log/logger";
// import Logger = log.Logger;
// import {cli} from "./cli/cli";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("./cli/cli");
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var logger_1 = require("./log/logger");
var Logger = logger_1.log.Logger;
var env = 'node';
if (env === 'max') {
    autowatch = 1;
}
var script;
var test = function () {
    set_arg('NA', 'argument_test_val');
    set_option('o', 'option_test_val');
    set_flag('f', 1);
};
var run = function () {
    script.run();
};
var init = function () {
    var messenger = new Messenger(env, 0);
    var logger = new Logger(env);
    var arg = new cli_1.cli.Arg('NA');
    var option = new cli_1.cli.Option('o', false);
    var flag = new cli_1.cli.Flag('f');
    var path_interpreter = '/Users/elliottevers/Documents/Documents - Elliott’s MacBook Pro/git-repos.nosync/music/.venv_master_36/bin/python';
    var path_script = '/Users/elliottevers/Documents/Documents - Elliott’s MacBook Pro/git-repos.nosync/music/sandbox/max_comm.py';
    script = new cli_1.cli.Script(path_interpreter, path_script, [flag], [option], [arg], messenger);
    // let executable_max_comm = new cli.Executable(
    //     '/usr/local/bin/youtube-dl',
    //     [flag_audio_only],
    //     [option_outfile],
    //     [arg_url],
    //     messenger
    // );
    // executables.push(executable_youtube_dl);
};
// let messenger: Messenger;
//
// let logger: Logger;
//
// let outlet_shell_obj = 0;
//
// let executables = [];
//
// let executable: cli.Executable;
//
// let dir = '/Users/elliottevers/Documents/git-repos.nosync/music/';
//
// let path_interpreter = dir + '.venv_36_test/bin/python';
// import argparse
// import json
//
//
// def main(args):
// print('Hello, %s!' % args.name)
// print(args.middle)
// print(args.x)
//
// test_json = {
//     "a list": [
//         1,
//         42,
//         3.141,
//         1337,
//         "help",
//         "€"
//     ],
//     "a string": "bla",
//     "another dict": {
//         "foo": "bar",
//         "key": "value",
//         "the answer": 42
//     }
// }
// with open('sandbox/data.json', 'w') as outfile:
// json.dump(test_json, outfile)
//
//
// if __name__ == '__main__':
// parser = argparse.ArgumentParser(description='Say hello')
//
// parser.add_argument('name', help='your name, enter it')
//
// # should be optional
// parser.add_argument('--middle', help='your MIDDLE name, enter it')
//
// parser.add_argument('-x', help='audio only?', action='store_true')
//
// args = parser.parse_args()
//
// main(args)
// let main = () => {
//     parser.add_argument('name', help='your name, enter it');
//
//     parser.add_argument('--middle', help='your MIDDLE name, enter it');
//
//     parser.add_argument('-x', help='audio only?', action='store_true');
// };
var set_arg = function (name_arg, val_arg) {
    // post(path_executable);
    // post(name_arg);
    // post(val_arg);
    script.get_arg(name_arg).set(val_arg);
};
var set_flag = function (name_flag, val_flag) {
    // post(path_executable);
    // post(name_flag);
    // post(val_flag);
    script.get_flag(name_flag).set(val_flag);
};
var set_option = function (name_opt, val_opt) {
    // post(path_executable);
    // post(name_opt);
    // post(val_opt);
    script.get_opt(name_opt).set(val_opt);
};
init();
test();
run();
// if __name__ == '__main__':
// parser = argparse.ArgumentParser(description='Say hello')
//
// parser.add_argument('name', help='your name, enter it')
//
// # should be optional
// parser.add_argument('--middle', help='your MIDDLE name, enter it')
//
// parser.add_argument('-x', help='audio only?', action='store_true')
//
// args = parser.parse_args()
//
// main(args)
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
//
// let run_executable = (path_executable) => {
//     _lookup_executable(path_executable).run()
// };
//
//
// let set_arg = (path_executable, name_arg, val_arg) => {
//     post(path_executable);
//     post(name_arg);
//     post(val_arg);
//     _lookup_executable(path_executable).get_arg(name_arg).set(val_arg);
// };
//
// let set_flag = (path_executable, name_flag, val_flag) => {
//     post(path_executable);
//     post(name_flag);
//     post(val_flag);
//     _lookup_executable(path_executable).get_flag(name_flag).set(val_flag);
// };
//
// let set_option = (path_executable, name_opt, val_opt) => {
//     post(path_executable);
//     post(name_opt);
//     post(val_opt);
//     _lookup_executable(path_executable).get_opt(name_opt).set(val_opt);
// };
//
// let _lookup_executable = (path_executable) => {
//     return executables.filter((executable) => {
//         return executable.get_command_exec() === path_executable;
//     })[0];
// };
//
// let log_cmd = (path_executable) => {
//     logger.log(
//         _lookup_executable(path_executable).get_run_command().split(' ')
//     );
//     // return _lookup_executable(path_executable).get_run_command().split(' ')
//
// };
//
// let test = () => {
//     let git_repo = '/Users/elliottevers/Documents/Documents - Elliott’s MacBook Pro/git-repos.nosync';
//
//     set_arg('/usr/local/bin/youtube-dl', 'url', 'https://www.youtube.com/watch?v=CbkvLYrEvF4');
//     set_option('/usr/local/bin/youtube-dl', 'o', git_repo + '/audio/youtube/tswift_teardrops.%(ext)s');
//     set_flag('/usr/local/bin/youtube-dl', 'x', 1);
//
//     // messenger.message(log_cmd('/usr/local/bin/youtube-dl'));
//
//
//     set_arg('/usr/local/bin/ffmpeg', 'file_out', git_repo + '/audio/youtube/tswift_teardrops.mp3');
//     set_option('/usr/local/bin/ffmpeg', 'i', git_repo + '/audio/youtube/tswift_teardrops.*');
//
//     // messenger.message(log_cmd('/usr/local/bin/ffmpeg'));
// };
if (typeof Global !== "undefined") {
    Global.command_shell = {};
    Global.command_shell.set_arg = set_arg;
    Global.command_shell.set_option = set_option;
    Global.command_shell.set_flag = set_flag;
    Global.command_shell.init = init;
    Global.command_shell.run = run;
}
//# sourceMappingURL=max_comm.js.map