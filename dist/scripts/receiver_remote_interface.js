"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var control_1 = require("../control/control");
var Fretboard = control_1.control.Fretboard;
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var fretboard = new Fretboard(6, 12, messenger);
// let logger = new Logger(env);
var fret = function (position_string, position_fret, status) {
    // logger.log(String(Boolean(status)));
    fretboard.fret(Number(position_string), Number(position_fret), Boolean(status));
};
var pluck = function (position_string) {
    fretboard.pluck(position_string);
};
var dampen = function (position_string) {
    fretboard.dampen(position_string);
};
var test = function () {
    // fret(1, 1, 1);
    // fret(1, 3, 1);
    // pluck(1);
    // dampen(1);
    // fret(1, 1, 0);
    // fret(1, 3, 0);
    // fret(1, 1, 1);
    // pluck(1);
    // dampen(1);
    // fret(1, 1, 0);
    // pluck(1);
    fret(6, 3, 1);
    pluck(6);
    fret(6, 3, 0);
    pluck(6);
};
// test();
if (typeof Global !== "undefined") {
    Global.control_server = {};
    Global.control_server.fret = fret;
    Global.control_server.pluck = pluck;
    Global.control_server.dampen = dampen;
    Global.control_server.test = test;
}
//# sourceMappingURL=receiver_remote_interface.js.map