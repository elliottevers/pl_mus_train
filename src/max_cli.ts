import {cli} from "./cli/cli";
import {message} from "./message/messenger";
import Messenger = message.Messenger;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

let script: cli.Script;

let messenger = new Messenger(env, 0);

let arg = new cli.Arg('argument');
let option = new cli.Option('o', false);
let flag = new cli.Flag('f');

let path_interpreter = '/Users/elliottevers/Documents/Documents - Elliott’s MacBook Pro/git-repos.nosync/music/.venv_master_36/bin/python';

let path_script = '/Users/elliottevers/Documents/Documents - Elliott’s MacBook Pro/git-repos.nosync/music/sandbox/max_comm.py';

script = new cli.Script(
    path_interpreter,
    path_script,
    [flag],
    [option],
    [arg],
    messenger,
    true
);

let run = () => {
    script.run()
};

let set_arg = (name_arg, val_arg) => {
    script.get_arg(name_arg).set(val_arg);
};

let set_flag = (name_flag, val_flag) => {
    script.get_flag(name_flag).set(val_flag);
};

let set_option = (name_opt, val_opt) => {
    script.get_opt(name_opt).set(val_opt);
};

let test = () => {
    set_arg('argument', 'argument_test_val');
    set_option('o', 'option_test_val');
    set_flag( 'f', 1);
};

if (typeof Global !== "undefined") {
    Global.max_cli = {};
    Global.max_cli.set_arg = set_arg;
    Global.max_cli.set_option = set_option;
    Global.max_cli.set_flag = set_flag;
    Global.max_cli.run = run;
}
