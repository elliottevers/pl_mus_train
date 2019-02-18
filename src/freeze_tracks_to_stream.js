"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("./live/live");
var clip_1 = require("./clip/clip");
var logger_1 = require("./log/logger");
var Logger = logger_1.log.Logger;
var io_1 = require("./io/io");
var Exporter = io_1.io.Exporter;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var partmap_radio = {
    0: 'melody',
    1: 'chord',
    2: 'bass',
    3: 'segment',
    4: 'key_center'
};
var exporter = new Exporter('/Users/elliottevers/Downloads/from_live.json');
// TODO: assumes all clips are same length
var add = function (index_part) {
    var song = new live_1.live.LiveApiJs('live_set');
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var clip = new clip_1.clip.Clip(new clip_1.clip.ClipDao(clip_highlighted, new messenger_1.message.Messenger(env, 0), false));
    var beat_clip_end = clip_highlighted.get("length");
    var notes = clip.get_notes(0, 0, beat_clip_end, 128);
    exporter.set_notes(clip_highlighted.get_id(), notes, partmap_radio[index_part]);
    exporter.set_tempo(song.get('tempo'));
    exporter.set_length(beat_clip_end);
};
var remove = function (index_part) {
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    exporter.unset_notes(clip_highlighted.get_id());
};
var export_clips = function () {
    exporter.export_clips(['melody', 'chord', 'bass']);
};
var set_midi = function (filepath) {
    // let dict_import = new Dict("dict_import");
    // dict_import.import_json(filepath);
    // let notes = dict_import.get('melody::notes');
    // let live_api: LiveApiJs = new li.LiveApiJs(
    //     'live_set view highlighted_clip_slot clip'
    // );
    //
    // let clip = new c.Clip(
    //     new c.ClipDao(
    //         live_api,
    //         new m.Messenger(env, 0),
    //         false
    //     )
    // );
    // let notes_parsed = c.Clip.parse_note_messages(
    //     notes
    // );
    //
    // clip.set_notes(
    //     notes_parsed
    // );
};
var export_midi = function (filepath) {
    var dict_export = new Dict("dict_export");
    var live_api;
    live_api = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var clip = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api, new messenger_1.message.Messenger(env, 0), false));
    // let notes = clip.get_notes(0, 0, 8, 128);
    // let name_part = 'melody';
    // let reps = [];
    //
    // dict_export.replace("melody::notes", "");
    //
    // reps.push(
    //     ['notes', notes.length.toString()].join(' ')
    // );
    //
    // for (let i_note in notes) {
    //     reps.push(notes[i_note].model.note.encode());
    // }
    //
    // reps.push(
    //     ['notes', 'done'].join(' ')
    // );
    //
    // // dict_export.set("melody::notes", ...reps);
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
    logger.log(clip_highlighted.get_id());
};
if (typeof Global !== "undefined") {
    Global.freeze_tracks_to_stream = {};
    // Global.midi_io.export_midi = export_midi;
    // Global.midi_io.set_midi = set_midi;
    Global.freeze_tracks_to_stream.test = test;
    Global.freeze_tracks_to_stream.add = add;
    Global.freeze_tracks_to_stream.remove = remove;
    Global.freeze_tracks_to_stream.export_clips = export_clips;
}
//# sourceMappingURL=freeze_tracks_to_stream.js.map