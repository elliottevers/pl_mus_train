import {cli} from "../cli/cli";
const _ = require('underscore');
const max_api = require('max-api');
import {PythonShell} from 'python-shell';

let args: cli.Arg[] = [];
let options: cli.Option[] = [];
let flags: cli.Flag[] = [];

let options_python_shell;

let arg = new cli.Arg('name_argument', false, false, true);

let option = new cli.Option('o', false, false, true);

let flag = new cli.Flag('f');

arg.set('name_argument');

option.set('name_option');

flag.set(1);

let path_interpreter = '/Users/elliottevers/DocumentsTurbulent/venvwrapper/master_36/bin/python';

let path_script = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/music/sandbox/max_comm.py';

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

max_api.addHandler("set_option", (name_opt, val_opt) => {
    if (_.contains(options.map((opt) => {return opt.name}), name_opt)) {
        let opt_existing = options.filter(opt => opt.name === name_opt)[0];
        opt_existing.set(val_opt);
    } else {
        let opt = new cli.Option(name_opt, false, false, true);
        opt.set(val_opt);
        options.push(opt);
    }
});

max_api.addHandler("set_path_interpreter", (path) => {
    path_interpreter = path
});

max_api.addHandler("set_path_script", (path) => {
    path_script = path
});


let run = () => {

    let script = new cli.Script(
        path_interpreter,
        path_script,
        [flag],
        [option],
        [arg]
    );

    let msg;

    options_python_shell = {
        mode: 'text',
        pythonPath: path_interpreter,
        args: ['argument', '-f', '--o', 'option_name']
    };

    PythonShell.run(script.script, options_python_shell, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        max_api.post(results);
        // console.log(results)
    });

    // max_api.post(
    //     script.get_command_full().join(' ')
    // );

};

run();

// max_api.addHandler("run", () => {
//     run()
// });

max_api.post('made it');
