(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var cli;
(function (cli) {
    var Parameterized = /** @class */ (function () {
        function Parameterized() {
        }
        // TODO: put counting logic here
        Parameterized.prototype.b_primed = function () {
            return this.get_unset_parameters().length > 0;
        };
        Parameterized.prototype.get_unset_parameters = function () {
            var unset_parameters = [];
            // flags
            for (var _i = 0, _a = this.flags; _i < _a.length; _i++) {
                var flag = _a[_i];
                if (!flag.b_set()) {
                    unset_parameters.push(flag.name);
                }
            }
            // options
            for (var _b = 0, _c = this.options; _b < _c.length; _b++) {
                var option = _c[_b];
                if (!option.b_set()) {
                    unset_parameters.push(option.name);
                }
            }
            // args
            for (var _d = 0, _e = this.args; _d < _e.length; _d++) {
                var arg = _e[_d];
                if (!arg.b_set()) {
                    unset_parameters.push(arg.name);
                }
            }
            return unset_parameters;
        };
        // public get_command_exec(): string {
        //     return this.path;
        // }
        Parameterized.prototype.get_arg = function (name_arg) {
            return this.args.filter(function (arg) {
                return arg.name === name_arg;
            })[0];
        };
        Parameterized.prototype.get_opt = function (name_opt) {
            return this.options.filter(function (opt) {
                return opt.name === name_opt;
            })[0];
        };
        Parameterized.prototype.get_flag = function (name_flag) {
            return this.flags.filter(function (flag) {
                return flag.name === name_flag;
            })[0];
        };
        Parameterized.prototype.get_run_parameters = function () {
            // let command_exec: string = this.get_command_exec();
            var argv = [];
            for (var _i = 0, _a = this.flags; _i < _a.length; _i++) {
                var flag = _a[_i];
                if (flag.b_set()) {
                    argv.push(flag.get_name_exec());
                }
            }
            // options
            for (var _b = 0, _c = this.options; _b < _c.length; _b++) {
                var option = _c[_b];
                if (option.b_set()) {
                    argv.push(option.get_name_exec());
                }
            }
            // args
            for (var _d = 0, _e = this.args; _d < _e.length; _d++) {
                var arg = _e[_d];
                if (arg.b_set()) {
                    argv.push(arg.get_name_exec());
                }
            }
            // return command_exec + ' ' + argv.join(' ');
            return argv.join(' ');
        };
        Parameterized.prototype.preprocess_shell = function (val) {
            return val.split(' ').join('\\\\ ');
        };
        Parameterized.prototype.preprocess_max = function (val) {
            return '\\"' + val + '\\"';
        };
        return Parameterized;
    }());
    var Script = /** @class */ (function (_super) {
        __extends(Script, _super);
        // flags: Flag[];
        // options: Option[];
        // args: Arg[];
        // messenger: Messenger;
        function Script(interpreter, script, flags, options, args, messenger, escape_paths) {
            var _this = _super.call(this) || this;
            _this.get_command_exec = function () {
                if (_this.escape_paths) {
                    return _this.preprocess_max(_this.preprocess_shell(_this.interpreter) + ' ' + _this.preprocess_shell(_this.script));
                }
                else {
                    return _this.interpreter + ' ' + _this.script;
                }
            };
            _this.interpreter = interpreter;
            _this.script = script;
            _this.flags = flags;
            _this.options = options;
            _this.args = args;
            _this.messenger = messenger;
            // TODO: do better
            _this.escape_paths = escape_paths;
            return _this;
        }
        Script.prototype.run = function () {
            var unset_params = this.get_unset_parameters();
            if (unset_params.length > 0) {
                throw 'unset parameters: ' + unset_params;
            }
            var command_full = [this.get_command_exec()].concat(this.get_run_parameters().split(' '));
            this.messenger.message(command_full);
        };
        return Script;
    }(Parameterized));
    cli.Script = Script;
    var Executable = /** @class */ (function (_super) {
        __extends(Executable, _super);
        // flags: Flag[];
        // options: Option[];
        // args: Arg[];
        // messenger: Messenger;
        function Executable(path, flags, options, args, messenger) {
            var _this = _super.call(this) || this;
            _this.get_command_exec = function () {
                return _this.path;
            };
            _this.path = path;
            _this.flags = flags;
            _this.options = options;
            _this.args = args;
            _this.messenger = messenger;
            return _this;
        }
        Executable.prototype.run = function () {
            var unset_params = this.get_unset_parameters();
            if (unset_params.length > 0) {
                throw 'unset parameters: ' + unset_params;
            }
            var command_full = [this.get_command_exec()].concat(this.get_run_parameters().split(' '));
            this.messenger.message(command_full);
        };
        return Executable;
    }(Parameterized));
    cli.Executable = Executable;
    var MaxShellParameter = /** @class */ (function () {
        function MaxShellParameter() {
        }
        MaxShellParameter.prototype._preprocess_max = function (val) {
            if (this.needs_escaping_max) {
                return '\\"' + val + '\\"';
            }
            else {
                return val;
            }
        };
        MaxShellParameter.prototype._preprocess_shell = function (val) {
            if (this.needs_escaping_shell) {
                // val = val.split(' ').join('\\\\\\\\ ');
                // post(val);
                // return val;
                // return val.split(' ').join('\\\\\\\\ ');
                return val.split(' ').join('\\\\ ');
            }
            else {
                return val;
            }
        };
        MaxShellParameter.prototype._preprocess = function (val) {
            if (this.needs_escaping_max && this.needs_escaping_shell) {
                // TODO: take care of this
                throw 'you better take care of this now';
            }
            if (this.needs_escaping_max) {
                return this._preprocess_max(val);
            }
            if (this.needs_escaping_shell) {
                return this._preprocess_shell(val);
            }
            return val;
        };
        return MaxShellParameter;
    }());
    var Arg = /** @class */ (function (_super) {
        __extends(Arg, _super);
        function Arg(name, needs_escaping_max, needs_escaping_shell) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.needs_escaping_max = needs_escaping_max;
            _this.needs_escaping_shell = needs_escaping_shell;
            return _this;
        }
        Arg.prototype.set = function (val) {
            this.val = val;
        };
        Arg.prototype.get_name_exec = function () {
            return this._preprocess(this.val);
        };
        // public get_name_exec() {
        //     return '-' + this.name + ' ' + this._preprocess(this.val)
        // }
        Arg.prototype.b_set = function () {
            return this.val !== null;
        };
        return Arg;
    }(MaxShellParameter));
    cli.Arg = Arg;
    var Flag = /** @class */ (function (_super) {
        __extends(Flag, _super);
        function Flag(name) {
            var _this = _super.call(this) || this;
            _this.name = name;
            return _this;
        }
        Flag.prototype.set = function (val) {
            this.val = val;
        };
        Flag.prototype.get_name_exec = function () {
            return '-' + this.name;
        };
        Flag.prototype.b_set = function () {
            return this.val;
        };
        return Flag;
    }(MaxShellParameter));
    cli.Flag = Flag;
    var Option = /** @class */ (function (_super) {
        __extends(Option, _super);
        function Option(name, needs_escaping_max, needs_escaping_shell) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.needs_escaping_max = needs_escaping_max;
            _this.needs_escaping_shell = needs_escaping_shell;
            return _this;
        }
        Option.prototype.set = function (val) {
            this.val = val;
        };
        Option.prototype.get_name_exec = function () {
            return '--' + this.name + ' ' + this._preprocess(this.val);
        };
        Option.prototype.b_set = function () {
            return this.val !== null;
        };
        return Option;
    }(MaxShellParameter));
    cli.Option = Option;
})(cli = exports.cli || (exports.cli = {}));

},{}],2:[function(require,module,exports){
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
var arg_file_out = new cli_1.cli.Arg('file_out', false, true);
var option_file_input = new cli_1.cli.Option('i', false, true);
var executable_ffmpeg = new cli_1.cli.Executable('/usr/local/bin/ffmpeg', [], [option_file_input], [arg_file_out], messenger);
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
var run = function () {
    executable_ffmpeg.run();
};
var set_arg = function (name_arg, val_arg) {
    // post(path_executable);
    // post(name_arg);
    // post(val_arg);
    executable_ffmpeg.get_arg(name_arg).set(val_arg);
};
var set_flag = function (name_flag, val_flag) {
    // post(path_executable);
    // post(name_flag);
    // post(val_flag);
    executable_ffmpeg.get_flag(name_flag).set(val_flag);
};
var set_option = function (name_opt, val_opt) {
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
var test = function () {
    var git_repo = '/Users/elliottevers/Documents/Documents - Elliott’s MacBook Pro/git-repos.nosync';
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

},{"./cli/cli":1,"./log/logger":3,"./message/messenger":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log;
(function (log) {
    var Logger = /** @class */ (function () {
        function Logger(env) {
            this.env = env;
        }
        Logger.log_max_static = function (message) {
            for (var i = 0, len = arguments.length; i < len; i++) {
                if (message && message.toString) {
                    var s = message.toString();
                    if (s.indexOf("[object ") >= 0) {
                        s = JSON.stringify(message);
                    }
                    post(s);
                }
                else if (message === null) {
                    post("<null>");
                }
                else {
                    post(message);
                }
            }
            post("\n");
        };
        Logger.prototype.log = function (message) {
            if (this.env === 'max') {
                this.log_max(message);
            }
            else if (this.env === 'node') {
                this.log_node(message);
            }
            else {
                post('env: ' + this.env);
                post('\n');
                throw 'environment invalid';
            }
        };
        // TODO: make static
        Logger.prototype.log_max = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i = 0, len = arguments.length; i < len; i++) {
                var message = arguments[i];
                if (message && message.toString) {
                    var s = message.toString();
                    if (s.indexOf("[object ") >= 0) {
                        s = JSON.stringify(message);
                    }
                    post(s);
                }
                else if (message === null) {
                    post("<null>");
                }
                else {
                    post(message);
                }
            }
            post("\n");
        };
        // TODO: make static
        Logger.prototype.log_node = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i = 0, len = arguments.length; i < len; i++) {
                var message = arguments[i];
                if (message && message.toString) {
                    var s = message.toString();
                    if (s.indexOf("[object ") >= 0) {
                        s = JSON.stringify(message);
                    }
                    console.log(s);
                }
                else if (message === null) {
                    console.log("<null>");
                }
                else {
                    console.log(message);
                }
            }
            console.log("\n");
        };
        return Logger;
    }());
    log.Logger = Logger;
})(log = exports.log || (exports.log = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message;
(function (message_1) {
    // TODO: the following
    // type Env = 'max' | 'node';
    var Messenger = /** @class */ (function () {
        function Messenger(env, outlet, key_route) {
            this.env = env;
            this.outlet = outlet;
            this.key_route = key_route;
        }
        Messenger.prototype.message = function (message) {
            if (this.env === 'max') {
                if (this.key_route) {
                    message.unshift(this.key_route);
                }
                this.message_max(message);
            }
            else if (this.env === 'node') {
                if (this.key_route) {
                    message.unshift(this.key_route);
                }
                this.message_node(message);
            }
        };
        Messenger.prototype.message_max = function (message) {
            outlet(this.outlet, message);
        };
        Messenger.prototype.message_node = function (message) {
            console.log("Messenger:");
            console.log("\n");
            console.log(message);
            console.log("\n");
        };
        return Messenger;
    }());
    message_1.Messenger = Messenger;
})(message = exports.message || (exports.message = {}));

},{}]},{},[2]);

var set_arg = Global.convert_youtube.set_arg;
var set_option = Global.convert_youtube.set_option;
var set_flag = Global.convert_youtube.set_flag;
var run = Global.convert_youtube.run;
var test = Global.convert_youtube.test;