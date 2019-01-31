"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// declare let Global: any;
// TODO: make dedicated library object for the following
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var logger_1 = require("./log/logger");
var Logger = logger_1.log.Logger;
var env = 'max';
if (env === 'max') {
    autowatch = 1;
}
var dir = '/Users/elliottevers/Documents/git-repos.nosync/music/';
var path_interpreter = dir + '.venv_36_test/bin/python';
// TODO: put in patcher if it turns out to make sense
// let path_script = dir + 'sandbox/download_youtube.py';
// let path_script: string;
var args = [];
var flags = [];
var options = [];
var outlet_shell_obj = 0;
var messenger;
var logger;
// let set_path_script = (path) => {
//     path_script = path;
// };
var set_arg = function (arg, val) {
    args.push({ arg: val });
};
var set_flag = function (flag) {
    flags.push(flag);
};
var set_option = function (option) {
    options.push(option);
};
var init = function () {
    messenger = new Messenger(env, outlet_shell_obj);
    logger = new Logger(env);
};
var get_cmd = function () {
    var cmd = [];
    cmd.push(path_interpreter);
    // cmd.push(path_script);
    // flags
    for (var _i = 0, flags_1 = flags; _i < flags_1.length; _i++) {
        var flag = flags_1[_i];
        cmd.push(flag);
    }
    // options
    for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
        var option = options_1[_a];
        cmd.push(option);
    }
    var _loop_1 = function (arg) {
        Object.keys(arg).forEach(function (key) {
            cmd.push(key);
            cmd.push(arg[key]);
        });
    };
    // args
    for (var _b = 0, args_1 = args; _b < args_1.length; _b++) {
        var arg = args_1[_b];
        _loop_1(arg);
    }
    return logger.log(cmd.join(' '));
};
// let run = (path_script, cmd) => {
//     messenger = new Messenger(env, outlet_shell_obj);
//
//     logger = new Logger(env);
//
//     let cmd_script: string[] = [];
//
//     cmd_script.push(path_interpreter);
//
//     cmd_script.push(path_script);
//
//     // cmd_script.push('--');
//
//     cmd_script.push(cmd);
//
//     messenger.message(cmd_script);
//
//     logger.log(cmd_script.join(' '));
// };
var run = function () {
    messenger = new Messenger(env, outlet_shell_obj);
    //
    // logger = new Logger(env);
    //
    // let cmd_script: string[] = [];
    //
    // cmd_script.push(path_interpreter);
    //
    // cmd_script.push(path_script);
    //
    // // cmd_script.push('--');
    //
    // cmd_script.push(cmd);
    //
    // messenger.message(cmd_script);
    //
    // logger.log(cmd_script.join(' '));
    var argv = [];
    argv.push('/usr/local/bin/youtube-dl');
    argv.push('-x');
    argv.push('-o');
    argv.push('\\\"/Users/elliottevers/Documents/git-repos.nosync/audio/youtube/tswift_teardrops.%(ext)s\\\"');
    argv.push('https://www.youtube.com/watch?v=CbkvLYrEvF4');
    messenger.message(argv);
};
if (typeof Global !== "undefined") {
    Global.command_shell = {};
    Global.command_shell.set_arg = set_arg;
    Global.command_shell.set_option = set_option;
    Global.command_shell.set_flag = set_flag;
    Global.command_shell.init = init;
    Global.command_shell.get_cmd = get_cmd;
    Global.command_shell.run = run;
}
// main();
// run('cmd');
//# sourceMappingURL=command_shell.js.map