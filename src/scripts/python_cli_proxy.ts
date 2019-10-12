import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live} from "../live/live";
import Env = live.Env;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;
declare let Dict: any;

export {}

declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let messenger = new Messenger(Env.MAX, 0);

let args: Object = {};

let options: Object = {};

let flags: Object = {};

let path_script: string;

let set_arg = () => {
    //@ts-ignore
    let list_args = Array.prototype.slice.call(arguments);

    args[list_args[0]] = list_args.slice(1, list_args.length)
};

let set_option = () => {
    //@ts-ignore
    let list_options = Array.prototype.slice.call(arguments);

    options[list_options[0]] = list_options.slice(1, list_options.length)
};

let set_flag = () => {
    //@ts-ignore
    let list_flags = Array.prototype.slice.call(arguments);

    flags[list_flags[0]] = list_flags.slice(1, list_flags.length)
};

let set_path_script = () => {
    //@ts-ignore
    let list_args = Array.prototype.slice.call(arguments);

    path_script = list_args[0];
};

let message_commands = () => {
    let commands = [];

    commands.push(['set_path_script'].concat([path_script]).join(' '));

    for (let arg of Object.keys(args)) {
        commands.push(['set_arg'].concat([arg, args[arg]]).join(' '))
    }

    for (let option of Object.keys(options)) {
        commands.push(['set_option'].concat([option, options[option]]).join(' '))
    }

    for (let flag of Object.keys(flags)) {
        commands.push(['set_flag'].concat([flag, flags[flag]]).join(' '))
    }

    for (let command of commands) {
        messenger.message(['commands'].concat(command.split(' ')))
    }

    messenger.message(['run', 'bang']);
};

let run = () => {
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
