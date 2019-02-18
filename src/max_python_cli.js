"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("./cli/cli");
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var _ = require('underscore');
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var script;
var messenger = new Messenger(env, 0);
var args = [];
var options = [];
var flags = [];
var path_interpreter;
var path_script;
var run = function () {
    script = new cli_1.cli.Script(path_interpreter, path_script, flags, options, args, messenger, true);
    script.run();
};
var set_arg = function (name_arg, val_arg) {
    if (_.contains(args.map(function (arg) { return arg.name; }), name_arg)) {
        var arg_existing = args.filter(function (arg) { return arg.name === name_arg; })[0];
        arg_existing.set(val_arg);
    }
    else {
        var arg = new cli_1.cli.Arg(name_arg);
        arg.set(val_arg);
        args.push(arg);
    }
};
var set_flag = function (name_flag, val_flag) {
    if (_.contains(flags.map(function (flag) { return flag.name; }), name_flag)) {
        var flag_existing = flags.filter(function (flag) { return flag.name === name_flag; })[0];
        flag_existing.set(val_flag);
    }
    else {
        var flag = new cli_1.cli.Flag(name_flag);
        flag.set(val_flag);
        flags.push(flag);
    }
};
var set_option = function (name_opt, val_opt) {
    if (_.contains(options.map(function (opt) { return opt.name; }), name_opt)) {
        var opt_existing = options.filter(function (opt) { return opt.name === name_opt; })[0];
        opt_existing.set(val_opt);
    }
    else {
        var opt = new cli_1.cli.Option(name_opt);
        opt.set(val_opt);
        options.push(opt);
    }
};
var set_interpreter = function (path) {
    path_interpreter = path;
};
var set_script = function (path) {
    path_script = path;
};
var test = function () {
    set_arg('id_arg', 'argument_test_val');
    set_option('o', 'option_test_val');
    set_flag('f', 1);
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
//# sourceMappingURL=max_python_cli.js.map