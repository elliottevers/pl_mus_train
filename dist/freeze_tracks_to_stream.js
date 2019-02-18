"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("./live/live");
var clip_1 = require("./clip/clip");
var logger_1 = require("./log/logger");
var Logger = logger_1.log.Logger;
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
var test = function () {
    var song = new live_1.live.LiveApiJs('live_set');
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var length_clip = clip_highlighted.get("length");
    var tempo = song.get("tempo");
    var logger = new Logger(env);
    logger.log(clip_highlighted.live_api.id);
};
if (typeof Global !== "undefined") {
    Global.freeze_tracks_to_stream = {};
    // Global.midi_io.export_midi = export_midi;
    // Global.midi_io.set_midi = set_midi;
    Global.freeze_tracks_to_stream.test = test;
}
//# sourceMappingURL=freeze_tracks_to_stream.js.map