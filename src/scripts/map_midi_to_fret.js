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
var fret_mapper = new FretMapper(messenger);
var test = function () {
    midi(55);
};
var midi = function (pitch_midi) {
    fret_mapper.play(pitch_midi);
};
// test();
if (typeof Global !== "undefined") {
    Global.map_midi_to_fret = {};
    Global.map_midi_to_fret.midi = midi;
}
//# sourceMappingURL=map_midi_to_fret.js.map