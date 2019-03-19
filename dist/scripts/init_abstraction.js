"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger;
var ran_init_call_receiver = false;
var ran_init_call_sender = false;
var ran_init_return_sender = false;
var ran_init_return_receiver = false;
var ran_init_setter = false;
var init_call_receiver = function (index) {
    if (ran_init_call_receiver) {
        return;
    }
    messenger = new Messenger(env, 0);
    var name = ['call', index];
    var receiver = patcher.newdefault(100, 100, "receive", name.join('.'));
    var outlet = patcher.getnamed("outlet");
    var resetter = patcher.getnamed('reset');
    var one_pass_gate = patcher.newdefault(100, 157, "one_pass_gate");
    patcher.connect(resetter, 0, one_pass_gate, 1);
    patcher.connect(receiver, 0, one_pass_gate, 0);
    patcher.connect(one_pass_gate, 0, outlet, 0);
    ran_init_call_receiver = true;
};
var init_call_sender = function (name_first, i_first, name_last, i_last) {
    if (ran_init_call_sender) {
        return;
    }
    messenger = new Messenger(env, 0);
    var indices = Array.apply(null, { length: i_last - i_first + 1 }).map(Function.call, Number);
    var pixels_init_left = 100;
    var pixels_init_top = 300;
    var router = patcher.newdefault(pixels_init_left, pixels_init_top, "route", indices);
    var pixels_offset_top = 40;
    var pixels_offset_left = 150;
    var sender;
    for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
        var index = indices_1[_i];
        var name = ['call', index];
        sender = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index)), pixels_init_top + pixels_offset_top, "send", name.join('.'));
        patcher.connect(router, index, sender, 0);
    }
    var routepass_reset = patcher.getnamed('routepass_reset');
    patcher.connect(routepass_reset, 1, router, 0);
    ran_init_call_sender = true;
};
var init_return_sender = function (index) {
    if (ran_init_return_sender) {
        return;
    }
    var name = ['return', index];
    var sender = patcher.newdefault(469, 267, "send", name.join('.'));
    var inlet = patcher.getnamed("inlet");
    var resetter = patcher.getnamed('reset');
    var one_pass_gate = patcher.newdefault(469, 194, "one_pass_gate");
    //
    patcher.connect(inlet, 0, one_pass_gate, 0);
    patcher.connect(resetter, 0, one_pass_gate, 1);
    patcher.connect(one_pass_gate, 0, sender, 0);
    ran_init_return_sender = true;
};
var init_return_receiver = function (name_first, i_first, name_last, i_last) {
    if (ran_init_return_receiver) {
        return;
    }
    messenger = new Messenger(env, 0);
    var indices = Array.apply(null, { length: i_last - i_first + 1 }).map(Function.call, Number);
    var pixels_init_left = 100;
    var pixels_init_top = 300;
    var pixels_offset_top = 40;
    var pixels_offset_left = 150;
    var outlet = patcher.getnamed('outlet');
    var resetter = patcher.getnamed('reset');
    var receiver;
    var prepender;
    var one_pass_gate;
    for (var _i = 0, indices_2 = indices; _i < indices_2.length; _i++) {
        var index = indices_2[_i];
        var name = ['return', index];
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
var init_setter = function (index) {
    if (ran_init_setter) {
        return;
    }
    var outlet = patcher.getnamed('outlet');
    var call_receiver = patcher.newdefault(361, 308, "call.receiver", index);
    var one_pass_gate_sender = patcher.newdefault(285, 357, "one_pass_gate");
    var one_pass_gate_outlet = patcher.newdefault(361, 460, "one_pass_gate");
    var typecast_bang = patcher.newdefault(238, 398, "t", "b");
    var return_sender = patcher.newdefault(180, 453, "return.sender", index);
    var resetter = patcher.getnamed("reset");
    patcher.connect(call_receiver, 0, one_pass_gate_outlet, 0);
    patcher.connect(one_pass_gate_outlet, 0, outlet, 0);
    patcher.connect(call_receiver, 0, one_pass_gate_sender, 0);
    patcher.connect(one_pass_gate_sender, 0, typecast_bang, 0);
    patcher.connect(typecast_bang, 0, return_sender, 0);
    patcher.connect(resetter, 0, one_pass_gate_sender, 1);
    patcher.connect(resetter, 0, one_pass_gate_outlet, 1);
    ran_init_setter = true;
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
    Global.init_abstraction.init_setter = init_setter;
}
//# sourceMappingURL=init_abstraction.js.map