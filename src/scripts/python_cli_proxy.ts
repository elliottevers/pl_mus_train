import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {log} from "../log/logger";
import Logger = log.Logger;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;
declare let Dict: any;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

let messenger = new Messenger(env, 0);

let commands: string[] = [];

let logger = new Logger(env);

let includes = (array, s) => {
    // logger.log(JSON.stringify(array));
    return array.indexOf(s) > -1
};

let reset = () => {
    commands = [];
};

let set_arg = () => {
    //@ts-ignore
    let list_args = Array.prototype.slice.call(arguments);

    let command = ['set_arg'].concat(list_args).join(' ');

    if (!includes(commands, command)) {
        commands.push(command)
    }
};

let set_option = () => {
    //@ts-ignore
    let list_args = Array.prototype.slice.call(arguments);

    let command = ['set_option'].concat(list_args).join(' ');

    if (!includes(commands, command)) {
        commands.push(command)
    }
};

let set_flag = () => {
    //@ts-ignore
    let list_args = Array.prototype.slice.call(arguments);

    let command = ['set_flag'].concat(list_args).join(' ');

    if (!includes(commands, command)) {
        commands.push(command)
    }
};

let set_path_script = () => {
    //@ts-ignore
    let list_args = Array.prototype.slice.call(arguments);

    let command = ['set_path_script'].concat(list_args).join(' ');

    if (!includes(commands, command)) {
        commands.push(command)
    }
};

let message_commands = () => {
    for (let command of commands) {
        messenger.message(['commands'].concat(command.split(' ')))
    }
};

let run = () => {
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
