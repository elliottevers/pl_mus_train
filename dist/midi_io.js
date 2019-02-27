"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("./live/live");
var clip_1 = require("./clip/clip");
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var set_midi = function (filepath) {
    var dict_import = new Dict("dict_import");
    dict_import.import_json(filepath);
    var notes = dict_import.get('melody::notes');
    var live_api = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var clip = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api, new messenger_1.message.Messenger(env, 0), false));
    var notes_parsed = clip_1.clip.Clip.parse_note_messages(notes);
    clip.set_notes(notes_parsed);
};
var export_midi = function (filepath) {
    var dict_export = new Dict("dict_export");
    var live_api;
    live_api = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var clip = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api, new messenger_1.message.Messenger(env, 0), false));
    var notes = clip.get_notes(0, 0, 8, 128);
    // let name_part = 'melody';
    var reps = [];
    dict_export.replace("melody::notes", "");
    reps.push(['notes', notes.length.toString()].join(' '));
    for (var i_note in notes) {
        reps.push(notes[i_note].model.note.encode());
    }
    reps.push(['notes', 'done'].join(' '));
    dict_export.set.apply(dict_export, ["melody::notes"].concat(reps));
    dict_export.export_json(filepath);
    var messenger = new Messenger(env, 0);
    messenger.message([filepath]);
};
if (typeof Global !== "undefined") {
    Global.midi_io = {};
    Global.midi_io.export_midi = export_midi;
    Global.midi_io.set_midi = set_midi;
}
//# sourceMappingURL=midi_io.js.map