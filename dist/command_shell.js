"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// declare let Global: any;
// TODO: make dedicated library object for the following
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var logger_1 = require("./log/logger");
var Logger = logger_1.log.Logger;
var cli_1 = require("./cli/cli");
var env = 'max';
if (env === 'max') {
    autowatch = 1;
}
var messenger;
var logger;
var outlet_shell_obj = 0;
var executables = [];
var executable;
var dir = '/Users/elliottevers/Documents/git-repos.nosync/music/';
var path_interpreter = dir + '.venv_36_test/bin/python';
var init = function () {
    messenger = new Messenger(env, outlet_shell_obj);
    logger = new Logger(env);
    var arg_url = new cli_1.cli.Arg('url');
    var option_outfile = new cli_1.cli.Option('o', true);
    var flag_audio_only = new cli_1.cli.Flag('x');
    var executable_youtube_dl = new cli_1.cli.Executable('/usr/local/bin/youtube-dl', [flag_audio_only], [option_outfile], [arg_url], messenger);
    executables.push(executable_youtube_dl);
    var arg_file_out = new cli_1.cli.Arg('file_out', false, true);
    var option_file_input = new cli_1.cli.Option('i', false, true);
    var executable_ffmpeg = new cli_1.cli.Executable('/usr/local/bin/ffmpeg', [], [option_file_input], [arg_file_out], messenger);
    executables.push(executable_ffmpeg);
};
var run_executable = function (path_executable) {
    _lookup_executable(path_executable).run();
};
var set_arg = function (path_executable, name_arg, val_arg) {
    post(path_executable);
    post(name_arg);
    post(val_arg);
    _lookup_executable(path_executable).get_arg(name_arg).set(val_arg);
};
var set_flag = function (path_executable, name_flag, val_flag) {
    post(path_executable);
    post(name_flag);
    post(val_flag);
    _lookup_executable(path_executable).get_flag(name_flag).set(val_flag);
};
var set_option = function (path_executable, name_opt, val_opt) {
    post(path_executable);
    post(name_opt);
    post(val_opt);
    _lookup_executable(path_executable).get_opt(name_opt).set(val_opt);
};
var _lookup_executable = function (path_executable) {
    return executables.filter(function (executable) {
        return executable.get_command_exec() === path_executable;
    })[0];
};
var log_cmd = function (path_executable) {
    logger.log(_lookup_executable(path_executable).get_run_command().split(' '));
    // return _lookup_executable(path_executable).get_run_command().split(' ')
};
var test = function () {
    var git_repo = '/Users/elliottevers/Documents/Documents - Elliott’s MacBook Pro/git-repos.nosync';
    set_arg('/usr/local/bin/youtube-dl', 'url', 'https://www.youtube.com/watch?v=CbkvLYrEvF4');
    set_option('/usr/local/bin/youtube-dl', 'o', git_repo + '/audio/youtube/tswift_teardrops.%(ext)s');
    set_flag('/usr/local/bin/youtube-dl', 'x', 1);
    // messenger.message(log_cmd('/usr/local/bin/youtube-dl'));
    set_arg('/usr/local/bin/ffmpeg', 'file_out', git_repo + '/audio/youtube/tswift_teardrops.mp3');
    set_option('/usr/local/bin/ffmpeg', 'i', git_repo + '/audio/youtube/tswift_teardrops.*');
    // messenger.message(log_cmd('/usr/local/bin/ffmpeg'));
};
if (typeof Global !== "undefined") {
    Global.command_shell = {};
    Global.command_shell.set_arg = set_arg;
    Global.command_shell.set_option = set_option;
    Global.command_shell.set_flag = set_flag;
    Global.command_shell.init = init;
    Global.command_shell.log_cmd = log_cmd;
    Global.command_shell.run_executable = run_executable;
    Global.command_shell.test = test;
    Global.command_shell._lookup_executable = _lookup_executable;
}
//# sourceMappingURL=download_youtube.js.js.map