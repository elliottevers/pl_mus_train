"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
// lookup Lemur color by feedback value
// lookup Lemur color by RGB of render value
// 0
// +1
// +2
// +3
// +4
// +5
// +-6
// -5
// -4
// -3
// -2
// -1
var map_feedback = [
    1080834,
    1015422,
    475006,
    126,
    4128894,
    8192126,
    8192002,
    8208131,
    8283442,
    8355634,
    6651698,
    4161027
];
// needs feedback values as keys, and Lemur codes as values
var colormap_feedback = {
    "33,254,6": 1080834,
    "32,254,254": 1015422,
    "15,127,254": 475006,
    "0,0,254": 126,
    "128,0,254": 4128894,
    "251,2,254": 8192126,
    "251,1,6": 8192002,
    "252,128,8": 8208131,
    "253,204,101": 8283442,
    "255,255,102": 8355634,
    "204,255,102": 6651698,
    "127,254,7": 4161027
};
// needs RGB as keys, and Lemur codes as values, since that's what user will be picking
var colormap_render = {
    "128,0,63": 4128799,
    "64,0,127": 2031679,
    "7,63,128": 204607,
    "16,127,1": 474880,
    "127,127,3": 4144897,
    "127,0,2": 4128768
};
// RBG keys, Lemur code values
var colormap_default = {
    "255,255,255": 8355711,
    "0,0,0": 0
};
var messenger = new Messenger(env, 0);
var test = function () {
};
var render_lemur = function (r, g, b) {
    messenger.message(colormap_render[[r, g, b].toString()]);
};
var feedback_lemur = function (diff) {
    messenger.message([map_feedback[diff]]);
};
var render_default_lemur = function (r, g, b) {
    messenger.message(colormap_default[[r, g, b].toString()]);
};
// test();
if (typeof Global !== "undefined") {
    Global.color_getter = {};
    Global.color_getter.render_lemur = render_lemur;
    Global.color_getter.render_default_lemur = render_default_lemur;
    Global.color_getter.feedback_lemur = feedback_lemur;
}
//# sourceMappingURL=color_getter.js.map