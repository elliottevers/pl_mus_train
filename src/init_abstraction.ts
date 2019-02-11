import {message} from "./message/messenger";
import Messenger = message.Messenger;

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

let messenger: Messenger;

let init_call_receiver = (index) => {
// let init = (id, index) => {
    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    let name = ['call', index];
    let receiver = patcher.newdefault(100, 100, "receive", name.join('.'));
    let outlet = patcher.getnamed("outlet");
    patcher.connect(receiver, 0, outlet, 0);
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
};

let init_return_receiver = (name_first, i_first, name_last, i_last) => {
    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    // let name = ['position', index];
    let indices = Array.apply(null, {length: i_last - i_first + 1}).map(Function.call, Number);

    let pixels_init_left = 100;
    let pixels_init_top = 300;

    let pixels_offset_top = 40;
    let pixels_offset_left = 150;

    let outlet = patcher.getnamed('outlet');

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

let init_setter = (index) => {
    let outlet = patcher.getnamed('outlet');

    let call_receiver = patcher.newdefault(361, 308, "call.receiver", index);
    let return_sender = patcher.newdefault(249, 414, "return.sender", index);
    let typecast_bang = patcher.newdefault(307, 359, "t", "b");

    patcher.connect(call_receiver, 0, outlet, 0);
    patcher.connect(call_receiver, 0, typecast_bang, 0);
    patcher.connect(typecast_bang, 0, return_sender, 0);
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
    Global.init_abstraction.init_setter = init_setter;
}
