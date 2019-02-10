// import {cli} from "./cli/cli";
import {message} from "./message/messenger";
import Messenger = message.Messenger;
// var _ = require('underscore');

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

declare let patcher: any;

// let script: cli.Script;
//
let messenger: Messenger;
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

let init_call_receiver = (index) => {
// let init = (id, index) => {
    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    let name = ['call', index];
    let receiver = patcher.newdefault(100, 100, "receive", name.join('.'));
    let outlet = patcher.getnamed("outlet");
    patcher.connect(receiver, 0, outlet, 0);
    // receiver.connect()
    // messenger.message(['script', 'newobject', 'newobj', '@text', name_object])
};

let init_call_sender = (name_first, i_first, name_last, i_last) => {

    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    // let name = ['position', index];
    let indices = Array.apply(null, {length: i_last - i_first + 1}).map(Function.call, Number);

    let pixels_init_left = 100;
    let pixels_init_top = 300;

    let router = patcher.newdefault(pixels_init_left, pixels_init_top, "route", indices);

    let pixels_offset_top = 40;
    let pixels_offset_left = 150;

    let sender;

    for (let index of indices) {
        let name = ['call', index];
        sender = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index)), pixels_init_top + pixels_offset_top, "send", name.join('.'));
        patcher.connect(router, index, sender, 0);
    }

    let inlet = patcher.getnamed('inlet');
    patcher.connect(inlet, 0, router, 0);
};

let init_return_sender = (index) => {

    let name = ['return', index];
    let receiver = patcher.newdefault(100, 100, "send", name.join('.'));
    let inlet = patcher.getnamed("inlet");
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

let init_return_receiver = (name_first, i_first, name_last, i_last) => {
    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    // let name = ['position', index];
    let indices = Array.apply(null, {length: i_last - i_first + 1}).map(Function.call, Number);

    let pixels_init_left = 100;
    let pixels_init_top = 300;

    // let router = patcher.newdefault(pixels_init_left, pixels_init_top, "route", indices);

    let pixels_offset_top = 40;
    let pixels_offset_left = 150;

    let outlet = patcher.getnamed('outlet');
    // patcher.connect(outlet, 0, router, 0);

    let receiver;

    let prepender;

    for (let index of indices) {
        let name = ['return', index];
        receiver = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index)), pixels_init_top + pixels_offset_top, "receive", name.join('.'));
        prepender = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index)), pixels_init_top + 2 * pixels_offset_top, "prepend", "returns", index);
        patcher.connect(receiver, 0, prepender, 0);
        patcher.connect(prepender, 0, outlet, 0);
    }
};

let test = () => {
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
