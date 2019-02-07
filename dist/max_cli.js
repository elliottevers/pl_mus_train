"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("./cli/cli");
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var script;
var messenger = new Messenger(env, 0);
var arg = new cli_1.cli.Arg('argument');
var option = new cli_1.cli.Option('o', false);
var flag = new cli_1.cli.Flag('f');
var path_interpreter = '/Users/elliottevers/Documents/Documents - Elliott’s MacBook Pro/git-repos.nosync/music/.venv_master_36/bin/python';
var path_script = '/Users/elliottevers/Documents/Documents - Elliott’s MacBook Pro/git-repos.nosync/music/sandbox/max_comm.py';
script = new cli_1.cli.Script(path_interpreter, path_script, [flag], [option], [arg], messenger, true);
var run = function () {
    script.run();
};
var set_arg = function (name_arg, val_arg) {
    script.get_arg(name_arg).set(val_arg);
};
var set_flag = function (name_flag, val_flag) {
    script.get_flag(name_flag).set(val_flag);
};
var set_option = function (name_opt, val_opt) {
    script.get_opt(name_opt).set(val_opt);
};
var test = function () {
    set_arg('argument', 'argument_test_val');
    set_option('o', 'option_test_val');
    set_flag('f', 1);
};
if (typeof Global !== "undefined") {
    Global.max_cli = {};
    Global.max_cli.set_arg = set_arg;
    Global.max_cli.set_option = set_option;
    Global.max_cli.set_flag = set_flag;
    Global.max_cli.run = run;
}
//# sourceMappingURL=max_python_cli.js.map.js.map