(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./log/logger":2,"./message/messenger":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}]},{},[1]);

var set_option = Global.command_shell.set_option;
var set_arg = Global.command_shell.set_arg;
var set_flag = Global.command_shell.set_flag;
var get_cmd = Global.command_shell.get_cmd;
var init = Global.command_shell.init;
var run = Global.command_shell.run;