import {cli} from "../cli/cli";
let shell = require('shelljs');
const _ = require('underscore');
const max_api = require('max-api');

let executable: cli.Executable;

let args: cli.Arg[] = [];
let options: cli.Option[] = [];
let flags: cli.Flag[] = [];

let path_binary;

max_api.addHandler("run", () => {
    executable = new cli.Executable(
        path_binary,
        flags,
        options,
        args
    );

    executable.run();

    let msg;

    shell.exec(
        executable.get_command_full().join(' '),
        {silent: true},
        (code, stdout, stderr) => {
            if (code === 0) {
                msg = 'done'
            } else {
                msg = 'error'
            }
        }
    );

    max_api.outlet(msg);
});

max_api.addHandler("set_arg", (name_arg, val_arg) => {
    if (_.contains(args.map((arg) => {return arg.name}), name_arg)) {
        let arg_existing = args.filter(arg => arg.name === name_arg)[0];
        arg_existing.set(val_arg);
    } else {
        let arg = new cli.Arg(name_arg);
        arg.set(val_arg);
        args.push(arg);
    }
});

max_api.addHandler("set_flag", (name_flag, val_flag) => {
    if (_.contains(flags.map((flag) => {return flag.name}), name_flag)) {
        let flag_existing = flags.filter(flag => flag.name === name_flag)[0];
        flag_existing.set(val_flag);
    } else {
        let flag = new cli.Flag(name_flag);
        flag.set(val_flag);
        flags.push(flag);
    }
});

max_api.addHandler("set_option", (name_opt, val_opt, num_dashes?: number) => {
    if (_.contains(options.map((opt) => {return opt.name}), name_opt)) {
        let opt_existing = options.filter(opt => opt.name === name_opt)[0];
        opt_existing.set(val_opt);
    } else {
        let opt = new cli.Option(name_opt, false, false, true, num_dashes);
        opt.set(val_opt);
        options.push(opt);
    }
});

max_api.addHandler("set_executable", (path) => {
    path_binary = path;
});
