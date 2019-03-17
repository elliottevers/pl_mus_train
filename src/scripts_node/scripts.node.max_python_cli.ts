import {cli} from "../cli/cli";
const _ = require('underscore');
const max_api = require('max-api');
import {PythonShell} from 'python-shell';

let args: cli.Arg[] = [];
let options: cli.Option[] = [];
let flags: cli.Flag[] = [];

let options_python_shell;

let path_script;

let path_interpreter = '/Users/elliottevers/DocumentsTurbulent/venvwrapper/master_36/bin/python';

let dir_scripts_python = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/music/src/scripts/';


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

max_api.addHandler("set_path_script", (filename_script) => {
    path_script = dir_scripts_python + filename_script
});


// let opt = new cli.Option('s', false, false, false);
// opt.set(0);
// options.push(opt);
//
//
// let opt2 = new cli.Option('e', false, false, false);
// opt2.set(200);
// options.push(opt2);
//
// path_script = dir_scripts_python + 'extract_beatmap.py';
//
// let flag = new cli.Flag('m');
// flag.set(1);
// flags.push(flag);


let run = () => {

    let script = new cli.Script(
        path_interpreter,
        path_script,
        flags,
        options,
        args
    );

    options_python_shell = {
        mode: 'text',
        pythonPath: path_interpreter,
        args: script.get_run_parameters().split(' ')
    };

    PythonShell.run(script.script, options_python_shell, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        for (let result of results) {
            max_api.outlet(result.toString().trim());
        }
        // console.log(results)
    });
};


max_api.addHandler("run", () => {
    run()
});

// run();
