"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {cli} from "./cli/cli";
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
// let script: cli.Script;
//
var messenger;
//
// let args: cli.Arg[] = [];
// let options: cli.Option[] = [];
// let flags: cli.Flag[] = [];
//
// let path_interpreter;
// let path_script;
// let run = () => {
//     script = new cli.Script(
//         path_interpreter,
//         path_script,
//         flags,
//         options,
//         args,
//         messenger,
//         true
//     );
//     script.run()
// };
//
// let set_arg = (name_arg, val_arg) => {
//     if (_.contains(args.map((arg) => {return arg.name}), name_arg)) {
//         let arg_existing = args.filter(arg => arg.name === name_arg)[0];
//         arg_existing.set(val_arg);
//     } else {
//         let arg = new cli.Arg(name_arg);
//         arg.set(val_arg);
//         args.push(arg);
//     }
// };
//
// let set_flag = (name_flag, val_flag) => {
//     if (_.contains(flags.map((flag) => {return flag.name}), name_flag)) {
//         let flag_existing = flags.filter(flag => flag.name === name_flag)[0];
//         flag_existing.set(val_flag);
//     } else {
//         let flag = new cli.Flag(name_flag);
//         flag.set(val_flag);
//         flags.push(flag);
//     }
// };
//
// let set_option = (name_opt, val_opt) => {
//     if (_.contains(options.map((opt) => {return opt.name}), name_opt)) {
//         let opt_existing = options.filter(opt => opt.name === name_opt)[0];
//         opt_existing.set(val_opt);
//     } else {
//         let opt = new cli.Option(name_opt);
//         opt.set(val_opt);
//         options.push(opt);
//     }
// };
//
// let set_interpreter = (path) => {
//     path_interpreter = path;
// };
//
// let set_script = (path) => {
//     path_script = path;
// };
var main = function (id, index) {
    messenger = new Messenger(env, 0);
    var name = [id, index, '#0'];
    // let name_object = ['receive', name.join('_')].join(' ');
    // patcher.newobject("newobj", name_object);
    // let obj = patcher.newobject("receive", "thing");
    var obj = patcher.newdefault(100, 100, "receive", name.join('_'));
    // var i = this.patcher.newobject ("message");
    // messenger.message(['script', 'newobject', 'newobj', '@text', name_object])
};
var test = function () {
    main('aur_viz', 1);
};
// test();
if (typeof Global !== "undefined") {
    Global.format_script = {};
    Global.format_script.main = main;
}
//# sourceMappingURL=format_script.js.map