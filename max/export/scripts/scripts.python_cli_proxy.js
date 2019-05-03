(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message;
(function (message_1) {
    var Messenger = /** @class */ (function () {
        function Messenger(env, outlet, key_route) {
            this.env = env;
            this.outlet = outlet;
            this.key_route = key_route;
        }
        Messenger.prototype.get_key_route = function () {
            return this.key_route;
        };
        Messenger.prototype.message = function (message, override) {
            switch (this.env) {
                case 'max': {
                    if (this.key_route && !override) {
                        message.unshift(this.key_route);
                    }
                    this.message_max(message);
                    break;
                }
                case 'node': {
                    if (this.key_route && !override) {
                        message.unshift(this.key_route);
                    }
                    this.message_node(message);
                    break;
                }
                case 'node_for_max': {
                    if (this.key_route && !override) {
                        message.unshift(this.key_route);
                    }
                    this.message_node_for_max(message);
                    break;
                }
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
        Messenger.prototype.message_node_for_max = function (message) {
            // const Max = require('max-api');
            // Max.outlet(message);
        };
        return Messenger;
    }());
    message_1.Messenger = Messenger;
})(message = exports.message || (exports.message = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var args = {};
var options = {};
var flags = {};
var path_script;
var set_arg = function () {
    //@ts-ignore
    var list_args = Array.prototype.slice.call(arguments);
    args[list_args[0]] = list_args.slice(1, list_args.length);
};
var set_option = function () {
    //@ts-ignore
    var list_options = Array.prototype.slice.call(arguments);
    options[list_options[0]] = list_options.slice(1, list_options.length);
};
var set_flag = function () {
    //@ts-ignore
    var list_flags = Array.prototype.slice.call(arguments);
    flags[list_flags[0]] = list_flags.slice(1, list_flags.length);
};
var set_path_script = function () {
    //@ts-ignore
    var list_args = Array.prototype.slice.call(arguments);
    path_script = list_args[0];
};
var message_commands = function () {
    var commands = [];
    commands.push(['set_path_script'].concat([path_script]).join(' '));
    for (var _i = 0, _a = Object.keys(args); _i < _a.length; _i++) {
        var arg = _a[_i];
        commands.push(['set_arg'].concat([arg, args[arg]]).join(' '));
    }
    for (var _b = 0, _c = Object.keys(options); _b < _c.length; _b++) {
        var option = _c[_b];
        commands.push(['set_option'].concat([option, options[option]]).join(' '));
    }
    for (var _d = 0, _e = Object.keys(flags); _d < _e.length; _d++) {
        var flag = _e[_d];
        commands.push(['set_flag'].concat([flag, flags[flag]]).join(' '));
    }
    for (var _f = 0, commands_1 = commands; _f < commands_1.length; _f++) {
        var command = commands_1[_f];
        messenger.message(['commands'].concat(command.split(' ')));
    }
    messenger.message(['run', 'bang']);
};
var run = function () {
    messenger.message(['start', 'bang']);
};
if (typeof Global !== "undefined") {
    Global.python_cli_proxy = {};
    Global.python_cli_proxy.run = run;
    Global.python_cli_proxy.set_arg = set_arg;
    Global.python_cli_proxy.set_option = set_option;
    Global.python_cli_proxy.set_flag = set_flag;
    Global.python_cli_proxy.set_path_script = set_path_script;
    Global.python_cli_proxy.message_commands = message_commands;
}

},{"../message/messenger":1}]},{},[2]);

var run = Global.python_cli_proxy.run;
var set_arg = Global.python_cli_proxy.set_arg;
var set_option = Global.python_cli_proxy.set_option;
var set_flag = Global.python_cli_proxy.set_flag;
var set_path_script = Global.python_cli_proxy.set_path_script;
var message_commands = Global.python_cli_proxy.message_commands;