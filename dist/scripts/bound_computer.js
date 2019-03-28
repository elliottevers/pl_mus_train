"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var compute_bound = function (int) {
    if (int - Math.floor(int) === 0) {
        messenger.message([int]);
    }
    else {
        messenger.message([int - Math.floor(int)]);
    }
};
if (typeof Global !== "undefined") {
    Global.bound_computer = {};
    Global.bound_computer.compute_bound = compute_bound;
}
//# sourceMappingURL=bound_computer.js.map