"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var _ = require("underscore");
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var num_frets = 12;
var num_strings = 6;
var frets = _.times(num_frets * num_strings, _.constant(0));
var nuts = _.times(num_strings, _.constant(0));
var render = function (position_string, position_fret, state) {
    var feedback = Math.round(Math.random() * 6).toString();
    if (Number(position_fret) === 0) {
        var nuts_clone = _.clone(nuts);
        nuts_clone[position_string - 1] = state;
        messenger.message(['nuts', state, feedback].concat(nuts_clone));
    }
    else {
        var frets_clone = _.clone(frets);
        frets_clone[((position_string - 1) * num_frets) + position_fret - 1] = state;
        messenger.message(['frets', state, feedback].concat(frets_clone));
    }
};
if (typeof Global !== "undefined") {
    Global.remote_interface_sender = {};
    Global.remote_interface_sender.render = render;
}
//# sourceMappingURL=remote_interface_sender.js.map