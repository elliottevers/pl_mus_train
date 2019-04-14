(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var commands = [];
var logger = new Logger(env);
var includes = function (array, s) {
    return array.indexOf(s) > -1;
};
var reset = function () {
    commands = [];
};
var set_arg = function () {
    //@ts-ignore
    var list_args = Array.prototype.slice.call(arguments);
    var command = ['set_arg'].concat(list_args).join(' ');
    if (!includes(commands, command)) {
        commands.push(command);
    }
};
var set_option = function () {
    //@ts-ignore
    var list_args = Array.prototype.slice.call(arguments);
    var command = ['set_option'].concat(list_args).join(' ');
    if (!includes(commands, command)) {
        commands.push(command);
    }
};
var set_flag = function () {
    //@ts-ignore
    var list_args = Array.prototype.slice.call(arguments);
    var command = ['set_flag'].concat(list_args).join(' ');
    if (!includes(commands, command)) {
        commands.push(command);
    }
};
var set_path_script = function () {
    //@ts-ignore
    var list_args = Array.prototype.slice.call(arguments);
    var command = ['set_path_script'].concat(list_args).join(' ');
    if (!includes(commands, command)) {
        commands.push(command);
    }
};
var message_commands = function () {
    for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
        var command = commands_1[_i];
        messenger.message(['commands'].concat(command.split(' ')));
    }
    messenger.message(['run', 'bang']);
};
// let handle_status = (status: number) => {
//     if (status === 1) {
//         message_commands();
//         messenger.message(['run', 'bang']);
//     }
// };
var run = function () {
    messenger.message(['start', 'bang']);
    // message_commands();
    // messenger.message(['run', 'bang']);
};
if (typeof Global !== "undefined") {
    Global.python_cli_proxy = {};
    Global.python_cli_proxy.run = run;
    Global.python_cli_proxy.set_arg = set_arg;
    Global.python_cli_proxy.set_option = set_option;
    Global.python_cli_proxy.set_flag = set_flag;
    Global.python_cli_proxy.set_path_script = set_path_script;
    Global.python_cli_proxy.reset = reset;
    Global.python_cli_proxy.message_commands = message_commands;
}

},{"../log/logger":1,"../message/messenger":2}]},{},[3]);

var run = Global.python_cli_proxy.run;
var set_arg = Global.python_cli_proxy.set_arg;
var set_option = Global.python_cli_proxy.set_option;
var set_flag = Global.python_cli_proxy.set_flag;
var set_path_script = Global.python_cli_proxy.set_path_script;
var reset = Global.python_cli_proxy.reset;
var message_commands = Global.python_cli_proxy.message_commands;