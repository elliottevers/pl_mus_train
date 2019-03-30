"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var pitches_discretization = {};
var reset = function () {
    pitches_discretization = {};
};
var accept = function (pitch_midi, velocity) {
    pitches_discretization[pitch_midi] = velocity > 0 ? 1 : 0;
};
var run = function () {
    var messenger = new Messenger(env, 0);
    var pitches_set = [];
    for (var _i = 0, _a = Object.keys(pitches_discretization); _i < _a.length; _i++) {
        var pitch_midi = _a[_i];
        if (pitches_discretization[pitch_midi] === 1) {
            pitches_set.push(pitch_midi);
        }
    }
    messenger.message(['note_midi_lower', Math.min.apply(Math, pitches_set)]);
    messenger.message(['note_midi_upper', Math.max.apply(Math, pitches_set)]);
    messenger.message(['run', 'bang']);
};
if (typeof Global !== "undefined") {
    Global.collect_parameters = {};
    Global.collect_parameters.accept = accept;
    Global.collect_parameters.reset = reset;
    Global.collect_parameters.run = run;
}
//# sourceMappingURL=collect_parameters.js.map