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
// let arg = new cli.Arg('name_argument', false, false, true);
//
// let option = new cli.Option('o', false, false, true);
//
// let flag = new cli.Flag('f');
// arg.set('name_argument');
//
// option.set('name_option');
//
// flag.set(1);
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
    path_script = dir_scripts_python + filename_script;
});
var run = function () {
    var script = new cli_1.cli.Script(path_interpreter, path_script, flags, options, args);
    var msg;
    options_python_shell = {
        mode: 'text',
        pythonPath: path_interpreter,
    };
    python_shell_1.PythonShell.run(script.script, options_python_shell, function (err, results) {
        if (err)
            throw err;
        // results is an array consisting of messages collected during execution
        max_api.outlet(parseFloat(results.toString()));
        // console.log(results)
    });
    // max_api.post(
    //     script.get_command_full().join(' ')
    // );
};
max_api.addHandler("run", function () {
    run();
});
//# sourceMappingURL=scripts.node.max_python_cli.js.map