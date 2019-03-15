"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("../cli/cli");
var shell = require('shelljs');
var _ = require('underscore');
var max_api = require('max-api');
var executable;
var args = [];
var options = [];
var flags = [];
var path_binary;
max_api.addHandler("run", function () {
    executable = new cli_1.cli.Executable(path_binary, flags, options, args);
    executable.run();
    var msg;
    shell.exec(executable.get_command_full().join(' '), { silent: true }, function (code, stdout, stderr) {
        if (code === 0) {
            msg = 'done';
        }
        else {
            msg = 'error';
        }
    });
    max_api.outlet(msg);
});
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
max_api.addHandler("set_option", function (name_opt, val_opt, num_dashes) {
    if (_.contains(options.map(function (opt) { return opt.name; }), name_opt)) {
        var opt_existing = options.filter(function (opt) { return opt.name === name_opt; })[0];
        opt_existing.set(val_opt);
    }
    else {
        var opt = new cli_1.cli.Option(name_opt, false, false, true, num_dashes);
        opt.set(val_opt);
        options.push(opt);
    }
});
max_api.addHandler("set_executable", function (path) {
    path_binary = path;
});
//# sourceMappingURL=scripts.node.max_cli_node.js.map