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
// needs feedback values as keys, and Lemur codes as values
var colormap_feedback = {
    "33,254,6": "32,254,254",
    "15,127,254": "0,0,254",
    "128,0,254": "251,2,254",
    "251,1,6": "252,128,8",
    "253,204,101": "255,255,102",
    "204,255,102": "127,254,7"
};
// needs RGB as keys, and Lemur codes as values, since that's what user will be picking
var colormap_render = {
    "128,0,63": "64,0,127",
    "7,63,128": "16,127,1",
    "127,127,3": "127,0,2"
};
// RBG keys, Lemur code values
var colormap_default = {
    "255,255,255": "0,0,0"
};
// let render_1 = [7733265, 65793];
// let render_2 = [7733355, 65793];
// let render_3 = [1900662, 65793];
// let render_4 = [21361, 65793];
// let render_5 = [28986, 65793];
// let render_6 = [7372646, 65793];
var messenger = new Messenger(env, 0);
var fret_mapper = new FretMapper(messenger);
var test = function () {
    // midi(55)
};
// let midi = (pitch_midi) => {
//     fret_mapper.play(pitch_midi)
// };
// test();
if (typeof Global !== "undefined") {
    Global.map_midi_to_fret = {};
    Global.map_midi_to_fret.midi = midi;
}
//# sourceMappingURL=color_getter.js.map