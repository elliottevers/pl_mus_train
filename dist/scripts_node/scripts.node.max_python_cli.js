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
var arg = new cli_1.cli.Arg('name_argument', false, false, true);
var option = new cli_1.cli.Option('o', false, false, true);
var flag = new cli_1.cli.Flag('f');
arg.set('name_argument');
option.set('name_option');
flag.set(1);
var path_interpreter = '/Users/elliottevers/DocumentsTurbulent/venvwrapper/master_36/bin/python';
var path_script = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/music/sandbox/max_comm.py';
max_api.addHandler("set_arg", function (name_arg, val_arg) {
    if (_.contains(args.map(function (arg) { return arg.name; }), name_arg)) {
        var arg_existing = args.filter(function (arg) { return arg.name === name_arg; })[0];
        arg_existing.set(val_arg);
    }
    else {
        var arg_1 = new cli_1.cli.Arg(name_arg);
        arg_1.set(val_arg);
        args.push(arg_1);
    }
});
max_api.addHandler("set_flag", function (name_flag, val_flag) {
    if (_.contains(flags.map(function (flag) { return flag.name; }), name_flag)) {
        var flag_existing = flags.filter(function (flag) { return flag.name === name_flag; })[0];
        flag_existing.set(val_flag);
    }
    else {
        var flag_1 = new cli_1.cli.Flag(name_flag);
        flag_1.set(val_flag);
        flags.push(flag_1);
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
max_api.addHandler("set_path_script", function (path) {
    path_script = path;
});
var run = function () {
    var script = new cli_1.cli.Script(path_interpreter, path_script, [flag], [option], [arg]);
    var msg;
    options_python_shell = {
        mode: 'text',
        pythonPath: path_interpreter,
        args: ['argument', '-f', '--o', 'option_name']
    };
    python_shell_1.PythonShell.run(script.script, options_python_shell, function (err, results) {
        if (err)
            throw err;
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
//# sourceMappingURL=scripts.node.max_python_cli.js.map