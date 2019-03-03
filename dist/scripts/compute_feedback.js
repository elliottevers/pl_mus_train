"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var map_1 = require("../control/map");
var FretMapper = map_1.map.FretMapper;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var test = function () {
};
var accept = function (user_input, ground_truth) {
    messenger.message([FretMapper.get_interval(user_input, ground_truth)]);
};
// test();
if (typeof Global !== "undefined") {
    Global.compute_feedback = {};
    Global.compute_feedback.accept = accept;
}
//# sourceMappingURL=compute_feedback.js.map