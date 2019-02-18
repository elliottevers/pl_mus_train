import {cli} from "./cli/cli";
import {message} from "./message/messenger";
import Messenger = message.Messenger;
var _ = require('underscore');

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

let args: cli.Arg[] = [];
let options: cli.Option[] = [];
let flags: cli.Flag[] = [];

let path_interpreter;
let path_script;

let run = () => {
    script = new cli.Script(
        path_interpreter,
        path_script,
        flags,
        options,
        args,
        messenger,
        true
    );
    script.run()
};

let set_arg = (name_arg, val_arg) => {
    if (_.contains(args.map((arg) => {return arg.name}), name_arg)) {
        let arg_existing = args.filter(arg => arg.name === name_arg)[0];
        arg_existing.set(val_arg);
    } else {
        let arg = new cli.Arg(name_arg);
        arg.set(val_arg);
        args.push(arg);
    }
};

let set_flag = (name_flag, val_flag) => {
    if (_.contains(flags.map((flag) => {return flag.name}), name_flag)) {
        let flag_existing = flags.filter(flag => flag.name === name_flag)[0];
        flag_existing.set(val_flag);
    } else {
        let flag = new cli.Flag(name_flag);
        flag.set(val_flag);
        flags.push(flag);
    }
};

let set_option = (name_opt, val_opt) => {
    if (_.contains(options.map((opt) => {return opt.name}), name_opt)) {
        let opt_existing = options.filter(opt => opt.name === name_opt)[0];
        opt_existing.set(val_opt);
    } else {
        let opt = new cli.Option(name_opt);
        opt.set(val_opt);
        options.push(opt);
    }
};

let set_interpreter = (path) => {
    path_interpreter = path;
};

let set_script = (path) => {
    path_script = path;
};

let test = () => {
    set_arg('id_arg', 'argument_test_val');
    set_option('o', 'option_test_val');
    set_flag( 'f', 1);
    set_arg('id_arg', 'argument_test_val_2');
};

if (typeof Global !== "undefined") {
    Global.max_python_cli = {};
    Global.max_python_cli.set_arg = set_arg;
    Global.max_python_cli.set_option = set_option;
    Global.max_python_cli.set_flag = set_flag;
    Global.max_python_cli.run = run;
    Global.max_python_cli.set_interpreter = set_interpreter;
    Global.max_python_cli.set_script = set_script;
}
