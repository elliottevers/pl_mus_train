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
var init_call_receiver = function (index) {
    // let init = (id, index) => {
    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    var name = ['call', index];
    var receiver = patcher.newdefault(100, 100, "receive", name.join('.'));
    var outlet = patcher.getnamed("outlet");
    patcher.connect(receiver, 0, outlet, 0);
    // receiver.connect()
    // messenger.message(['script', 'newobject', 'newobj', '@text', name_object])
};
var init_call_sender = function (name_first, i_first, name_last, i_last) {
    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    // let name = ['position', index];
    var indices = Array.apply(null, { length: i_last - i_first + 1 }).map(Function.call, Number);
    var pixels_init_left = 100;
    var pixels_init_top = 300;
    var router = patcher.newdefault(pixels_init_left, pixels_init_top, "route", indices);
    var pixels_offset_top = 40;
    var pixels_offset_left = 150;
    var sender;
    for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
        var index = indices_1[_i];
        var name_1 = ['call', index];
        sender = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index)), pixels_init_top + pixels_offset_top, "send", name_1.join('.'));
        patcher.connect(router, index, sender, 0);
    }
    var inlet = patcher.getnamed('inlet');
    patcher.connect(inlet, 0, router, 0);
};
var init_return_sender = function (index) {
    var name = ['return', index];
    var receiver = patcher.newdefault(100, 100, "send", name.join('.'));
    var inlet = patcher.getnamed("inlet");
    patcher.connect(inlet, 0, receiver, 0);
    // messenger = new Messenger(env, 0);
    // // let name = [id, index, '#0'];
    // // let name = [id, index];
    // // let name = ['position', index];
    // let indices = Array.apply(null, {length: i_last - i_first + 1}).map(Function.call, Number);
    //
    // let pixels_init_left = 100;
    // let pixels_init_top = 300;
    //
    // let router = patcher.newdefault(pixels_init_left, pixels_init_top, "route", indices);
    //
    // let pixels_offset_top = 40;
    // let pixels_offset_left = 150;
    //
    // let sender;
    //
    // for (let index of indices) {
    //     let name = ['position', index + 1];
    //     sender = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index + 1)), pixels_init_top + pixels_offset_top, "send", name.join('.'));
    //     patcher.connect(router, index, sender, 0);
    // }
    //
    // let inlet = patcher.getnamed('inlet');
    // patcher.connect(inlet, 0, router, 0);
};
var init_return_receiver = function (name_first, i_first, name_last, i_last) {
    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    // let name = ['position', index];
    var indices = Array.apply(null, { length: i_last - i_first + 1 }).map(Function.call, Number);
    var pixels_init_left = 100;
    var pixels_init_top = 300;
    // let router = patcher.newdefault(pixels_init_left, pixels_init_top, "route", indices);
    var pixels_offset_top = 40;
    var pixels_offset_left = 150;
    var outlet = patcher.getnamed('outlet');
    // patcher.connect(outlet, 0, router, 0);
    var receiver;
    var prepender;
    for (var _i = 0, indices_2 = indices; _i < indices_2.length; _i++) {
        var index = indices_2[_i];
        var name_2 = ['return', index];
        receiver = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index)), pixels_init_top + pixels_offset_top, "receive", name_2.join('.'));
        prepender = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index)), pixels_init_top + 2 * pixels_offset_top, "prepend", "returns", index);
        patcher.connect(receiver, 0, prepender, 0);
        patcher.connect(prepender, 0, outlet, 0);
    }
};
var test = function () {
    init_call_receiver(0);
    init_call_sender('first', 0, 'last', 3);
};
// test();
if (typeof Global !== "undefined") {
    Global.init_abstraction = {};
    Global.init_abstraction.init_call_receiver = init_call_receiver;
    Global.init_abstraction.init_call_sender = init_call_sender;
    Global.init_abstraction.init_return_sender = init_return_sender;
    Global.init_abstraction.init_return_receiver = init_return_receiver;
}
//# sourceMappingURL=init_abstraction.js.map