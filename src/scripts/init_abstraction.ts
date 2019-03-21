import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {log} from "../log/logger";
import Logger = log.Logger;

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

let ran_init_call_receiver = false;
let ran_init_call_sender = false;
let ran_init_return_sender = false;
let ran_init_return_receiver = false;
let ran_init_setter = false;

let init_call_receiver = (index) => {
    if (ran_init_call_receiver) {
        return;
    }

    messenger = new Messenger(env, 0);

    let name = ['call', index];
    let receiver = patcher.newdefault(100, 100, "receive", name.join('.'));
    let outlet = patcher.getnamed("outlet");

    let resetter = patcher.getnamed('reset');
    let one_pass_gate = patcher.newdefault(100, 157, "one_pass_gate");

    patcher.connect(resetter, 0, one_pass_gate, 1);
    patcher.connect(receiver, 0, one_pass_gate, 0);
    patcher.connect(one_pass_gate, 0, outlet, 0);

    ran_init_call_receiver = true;
};

let init_call_sender = (name_first, i_first, name_last, i_last) => {
    if (ran_init_call_sender) {
        return;
    }

    messenger = new Messenger(env, 0);

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

    let routepass_reset = patcher.getnamed('routepass_reset');
    patcher.connect(routepass_reset, 1, router, 0);

    ran_init_call_sender = true;
};

let init_return_sender = (index) => {
    if (ran_init_return_sender) {
        return;
    }

    let name = ['return', index];
    let sender = patcher.newdefault(469, 267, "send", name.join('.'));
    let inlet = patcher.getnamed("inlet");

    let resetter = patcher.getnamed('reset');
    let one_pass_gate = patcher.newdefault(469, 194, "one_pass_gate");

    patcher.connect(inlet, 0, one_pass_gate, 0);
    patcher.connect(resetter, 0, one_pass_gate, 1);
    patcher.connect(one_pass_gate, 0, sender, 0);
    ran_init_return_sender = true;
};

let init_return_receiver = (name_first, i_first, name_last, i_last) => {
    if (ran_init_return_receiver) {
        return;
    }

    messenger = new Messenger(env, 0);

    let indices = Array.apply(null, {length: i_last - i_first + 1}).map(Function.call, Number);

    let pixels_init_left = 100;
    let pixels_init_top = 300;

    let pixels_offset_top = 40;
    let pixels_offset_left = 150;

    let outlet = patcher.getnamed('outlet');

    let resetter = patcher.getnamed('reset');

    let receiver;
    let prepender;
    let one_pass_gate;

    for (let index of indices) {
        let name = ['return', index];
        receiver = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index)), pixels_init_top + pixels_offset_top, "receive", name.join('.'));
        one_pass_gate = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index)), pixels_init_top + 2 * pixels_offset_top, "one_pass_gate");
        prepender = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index)), pixels_init_top + 3 * pixels_offset_top, "prepend", "returns", index);
        patcher.connect(receiver, 0, one_pass_gate, 0);
        patcher.connect(one_pass_gate, 0, prepender, 0);
        patcher.connect(prepender, 0, outlet, 0);

        patcher.connect(resetter, 0, one_pass_gate, 1);
    }

    ran_init_return_receiver = true;
};

let init_setter = (index) => {

    if (ran_init_setter) {
        return;
    }

    let outlet = patcher.getnamed('outlet');

    let call_receiver = patcher.newdefault(361, 308, "call.receiver", index);
    let one_pass_gate_sender = patcher.newdefault(285, 357, "one_pass_gate");
    let one_pass_gate_outlet = patcher.newdefault(361, 460, "one_pass_gate");
    let typecast_bang = patcher.newdefault(238, 398, "t", "b");
    let return_sender = patcher.newdefault(180, 453, "return.sender", index);

    let resetter = patcher.getnamed("reset");

    patcher.connect(call_receiver, 0, one_pass_gate_outlet, 0);
    patcher.connect(one_pass_gate_outlet, 0, outlet, 0);
    patcher.connect(call_receiver, 0, one_pass_gate_sender, 0);
    patcher.connect(one_pass_gate_sender, 0, typecast_bang, 0);
    patcher.connect(typecast_bang, 0, return_sender, 0);

    patcher.connect(resetter, 0, one_pass_gate_sender, 1);
    patcher.connect(resetter, 0, one_pass_gate_outlet, 1);

    ran_init_setter = true;
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
