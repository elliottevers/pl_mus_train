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
    // logger.log(JSON.stringify(array));
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
};
var run = function () {
    messenger.message(['start', 'bang']);
    message_commands();
    messenger.message(['run', 'bang']);
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
//# sourceMappingURL=python_cli_proxy.js.map