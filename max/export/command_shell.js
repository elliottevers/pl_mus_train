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
    var Executable = /** @class */ (function () {
        function Executable(path, flags, options, args, messenger) {
            this.path = path;
            this.flags = flags;
            this.options = options;
            this.args = args;
            this.messenger = messenger;
        }
        // TODO: put counting logic here
        Executable.prototype.b_primed = function () {
            return this.get_unset_parameters().length > 0;
        };
        Executable.prototype.get_unset_parameters = function () {
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
        Executable.prototype.get_command_exec = function () {
            return this.path;
        };
        Executable.prototype.get_arg = function (name_arg) {
            return this.args.filter(function (arg) {
                return arg.name === name_arg;
            })[0];
        };
        Executable.prototype.get_opt = function (name_opt) {
            return this.options.filter(function (opt) {
                return opt.name === name_opt;
            })[0];
        };
        Executable.prototype.get_flag = function (name_flag) {
            return this.flags.filter(function (flag) {
                return flag.name === name_flag;
            })[0];
        };
        Executable.prototype.get_run_command = function () {
            var command_exec = this.get_command_exec();
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
            return command_exec + ' ' + argv.join(' ');
        };
        Executable.prototype.run = function () {
            this.messenger.message(this.get_run_command().split(' '));
        };
        return Executable;
    }());
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
            return '-' + this.name + ' ' + this._preprocess(this.val);
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
    // /usr/local/bin/youtube-dl -x -o \"/Users/elliottevers/Documents/git-repos.nosync/audio/youtube/tswift_teardrops.%(ext)s\" https://www.youtube.com/watch?v=CbkvLYrEvF4
    var executable_youtube_dl = new cli_1.cli.Executable('/usr/local/bin/youtube-dl', [flag_audio_only], [option_outfile], [arg_url], messenger);
    executables.push(executable_youtube_dl);
    var arg_file_out = new cli_1.cli.Arg('file_out', false, true);
    var option_file_input = new cli_1.cli.Option('i', false, true);
    // /usr/local/bin/ffmpeg -i /Users/elliottevers/Documents/git-repos.nosync/audio/youtube/tswift_teardrops.* /Users/elliottevers/Documents/git-repos.nosync/audio/youtube/tswift_teardrops.mp3
    var executable_ffmpeg = new cli_1.cli.Executable('/usr/local/bin/ffmpeg', [], [option_file_input], [arg_file_out], messenger);
    executables.push(executable_ffmpeg);
};
var run_executable = function (path_executable) {
    _lookup_executable(path_executable).run();
};
var set_arg = function (path_executable, name_arg, val_arg) {
    _lookup_executable(path_executable).get_arg(name_arg).set(val_arg);
};
var set_flag = function (path_executable, name_flag, val_flag) {
    _lookup_executable(path_executable).get_flag(name_flag).set(val_flag);
};
var set_option = function (path_executable, name_opt, val_opt) {
    _lookup_executable(path_executable).get_opt(name_opt).set(val_opt);
};
var _lookup_executable = function (path_executable) {
    return executables.filter(function (executable) {
        return executable.get_command_exec() === path_executable;
    })[0];
};
var get_cmd = function (path_executable) {
    // return logger.log(
    //     _lookup_executable(path_executable).get_run_command().split(' ')
    // );
    return _lookup_executable(path_executable).get_run_command().split(' ');
};
var test = function () {
    // let git_repo = '/Users/elliottevers/Documents/Documents\\\\ -\\\\ Elliott’s\\\\ MacBook\\\\ Pro/git-repos.nosync/';
    var git_repo = '/Users/elliottevers/Documents/Documents - Elliott’s MacBook Pro/git-repos.nosync';
    set_arg('/usr/local/bin/youtube-dl', 'url', 'https://www.youtube.com/watch?v=CbkvLYrEvF4');
    set_option('/usr/local/bin/youtube-dl', 'o', git_repo + '/audio/youtube/tswift_teardrops.%(ext)s');
    set_flag('/usr/local/bin/youtube-dl', 'x', 1);
    // messenger.message(get_cmd('/usr/local/bin/youtube-dl'));
    set_arg('/usr/local/bin/ffmpeg', 'file_out', git_repo + '/audio/youtube/tswift_teardrops.mp3');
    set_option('/usr/local/bin/ffmpeg', 'i', git_repo + '/audio/youtube/tswift_teardrops.*');
    messenger.message(get_cmd('/usr/local/bin/ffmpeg'));
    // messenger.message([git_repo])
};
// init();
// test();
if (typeof Global !== "undefined") {
    Global.command_shell = {};
    Global.command_shell.set_arg = set_arg;
    Global.command_shell.set_option = set_option;
    Global.command_shell.set_flag = set_flag;
    Global.command_shell.init = init;
    Global.command_shell.get_cmd = get_cmd;
    Global.command_shell.run_executable = run_executable;
    Global.command_shell.test = test;
    Global.command_shell._lookup_executable = _lookup_executable;
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

var set_option = Global.command_shell.set_option;
var set_arg = Global.command_shell.set_arg;
var set_flag = Global.command_shell.set_flag;
var get_cmd = Global.command_shell.get_cmd;
var init = Global.command_shell.init;
var run = Global.command_shell.run;
var run_executable = Global.command_shell.run_executable;
var test = Global.command_shell.test;
var _lookup_executable = Global.command_shell._lookup_executable;