"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger;
var init_call_receiver = function (index) {
    // let init = (id, index) => {
    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    var name = ['call', index];
    var receiver = patcher.newdefault(100, 100, "receive", name.join('.'));
    var outlet = patcher.getnamed("outlet");
    patcher.connect(receiver, 0, outlet, 0);
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
};
var init_return_receiver = function (name_first, i_first, name_last, i_last) {
    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    // let name = ['position', index];
    var indices = Array.apply(null, { length: i_last - i_first + 1 }).map(Function.call, Number);
    var pixels_init_left = 100;
    var pixels_init_top = 300;
    var pixels_offset_top = 40;
    var pixels_offset_left = 150;
    var outlet = patcher.getnamed('outlet');
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