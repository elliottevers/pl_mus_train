"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require('path');
var max_api = require('max-api');
// This will be printed directly to the Max console
max_api.post("Loaded the " + path.basename(__filename) + " script");
// Use the 'addHandler' function to register a function for a particular message
max_api.addHandler("bang", function () {
    max_api.post("Who you think you bangin'?");
});
// Use the 'outlet' function to send messages out of node.script's outlet
max_api.addHandler("echo", function (msg) {
    max_api.outlet(msg);
});
// let script: cli.Script;
// let messenger = new Messenger(env, 0);
// let args: cli.Arg[] = [];
// let options: cli.Option[] = [];
// let flags: cli.Flag[] = [];
//
// let path_interpreter;
// let path_script;
var run = function () {
    // script = new cli.Script(
    //     path_interpreter,
    //     path_script,
    //     flags,
    //     options,
    //     args,
    //     messenger,
    //     true
    // );
    // script.run()
};
var set_arg = function (name_arg, val_arg) {
    // if (_.contains(args.map((arg) => {return arg.name}), name_arg)) {
    //     let arg_existing = args.filter(arg => arg.name === name_arg)[0];
    //     arg_existing.set(val_arg);
    // } else {
    //     let arg = new cli.Arg(name_arg);
    //     arg.set(val_arg);
    //     args.push(arg);
    // }
};
var python_shell_1 = require("python-shell");
var options = {
    mode: 'text',
    pythonPath: 'path/to/python',
    pythonOptions: ['-x'],
    scriptPath: 'path/to/my/scripts',
    args: ['value1', 'value2', 'value3']
};
// youtube-dl  --audio-format wav --o "/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_projects/downloads/project_name.%(ext)s" https://www.youtube.com/watch?v=Uybtn6ebG0I
python_shell_1.PythonShell.run('my_script.py', options, function (err, results) {
    if (err)
        throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
});
var set_flag = function (name_flag, val_flag) {
    // if (_.contains(flags.map((flag) => {return flag.name}), name_flag)) {
    //     let flag_existing = flags.filter(flag => flag.name === name_flag)[0];
    //     flag_existing.set(val_flag);
    // } else {
    //     let flag = new cli.Flag(name_flag);
    //     flag.set(val_flag);
    //     flags.push(flag);
    // }
};
var set_option = function (name_opt, val_opt) {
    // if (_.contains(options.map((opt) => {return opt.name}), name_opt)) {
    //     let opt_existing = options.filter(opt => opt.name === name_opt)[0];
    //     opt_existing.set(val_opt);
    // } else {
    //     let opt = new cli.Option(name_opt);
    //     opt.set(val_opt);
    //     options.push(opt);
    // }
};
var set_interpreter = function (path) {
    // path_interpreter = path;
};
var set_script = function (path) {
    // path_script = path;
};
//# sourceMappingURL=scripts.node.max_python_cli.js.map