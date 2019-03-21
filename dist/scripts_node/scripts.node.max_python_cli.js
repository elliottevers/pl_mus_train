"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("../cli/cli");
var _ = require('underscore');
var max_api = require('max-api');
var python_shell_1 = require("python-shell");
var args = [];
var options = [];
var flags = [];
var options_python_shell;
var path_script;
var path_interpreter = '/Users/elliottevers/DocumentsTurbulent/venvwrapper/master_36/bin/python';
var dir_scripts_python = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/music/src/scripts/';
max_api.addHandler("set_arg", function (name_arg, val_arg) {
    if (_.contains(args.map(function (arg) { return arg.name; }), name_arg)) {
        var arg_existing = args.filter(function (arg) { return arg.name === name_arg; })[0];
        arg_existing.set(val_arg);
    }
    else {
        var arg = new cli_1.cli.Arg(name_arg);
        arg.set(val_arg);
        args.push(arg);
    }
});
max_api.addHandler("set_flag", function (name_flag, val_flag) {
    if (_.contains(flags.map(function (flag) { return flag.name; }), name_flag)) {
        var flag_existing = flags.filter(function (flag) { return flag.name === name_flag; })[0];
        flag_existing.set(val_flag);
    }
    else {
        var flag = new cli_1.cli.Flag(name_flag);
        flag.set(val_flag);
        flags.push(flag);
    }
});
max_api.addHandler("set_option", function (name_opt, val_opt) {
    // max_api.post(val_opt);
    if (_.contains(options.map(function (opt) { return opt.name; }), name_opt)) {
        var opt_existing = options.filter(function (opt) { return opt.name === name_opt; })[0];
        opt_existing.set(val_opt);
    }
    else {
        var opt = new cli_1.cli.Option(name_opt, false, false, true);
        opt.set(val_opt);
        options.push(opt);
    }
});
max_api.addHandler("set_path_interpreter", function (path) {
    path_interpreter = path;
});
max_api.addHandler("set_path_script", function (filename_script) {
    max_api.post(filename_script);
    path_script = dir_scripts_python + filename_script;
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
var run = function () {
    var script = new cli_1.cli.Script(path_interpreter, path_script, flags, options, args);
    var parameters_exist = !!script.get_run_parameters().split(' ')[0];
    options_python_shell = {
        mode: 'text',
        pythonPath: path_interpreter,
    };
    if (parameters_exist) {
        options_python_shell['args'] = script.get_run_parameters().split(' ');
    }
    // max_api.post(script.get_run_parameters().split(' '));
    python_shell_1.PythonShell.run(script.script, options_python_shell, function (err, results) {
        if (err)
            throw err;
        // results is an array consisting of messages collected during execution
        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
            var result = results_1[_i];
            var message_trimmed = result.toString().trim();
            var message_split = message_trimmed.split(' ');
            max_api.outlet(message_split);
        }
        // console.log(results)
    });
};
max_api.addHandler("run", function () {
    max_api.post(path_script);
    run();
});
// run();
//# sourceMappingURL=scripts.node.max_python_cli.js.map