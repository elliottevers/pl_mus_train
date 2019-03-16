"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var io_1 = require("../io/io");
var Exporter = io_1.io.Exporter;
var utils_1 = require("../utils/utils");
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var dir_projects = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_projects/';
var file_json_comm = dir_projects + 'json_live.json';
var exporter = new Exporter(file_json_comm);
var part_names = new utils_1.utils.Set([]);
var set_length = function () {
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    exporter.set_length(clip_highlighted.get("length"));
};
var set_tempo = function () {
    var song = new live_1.live.LiveApiJs('live_set');
    exporter.set_tempo(song.get('tempo'));
};
// let add = (name_part) => {
//
//     let song = new li.LiveApiJs(
//         'live_set'
//     );
//
//     let clip_highlighted = new li.LiveApiJs(
//         'live_set view highlighted_clip_slot clip'
//     );
//
//     let clip = new c.Clip(
//         new c.ClipDao(
//             clip_highlighted,
//             new m.Messenger(env, 0),
//             false
//         )
//     );
//
//     let notes = clip.get_notes(
//         0,
//         0,
//         clip_highlighted.get("length"),
//         128
//     );
//
//     exporter.set_notes(
//         name_part,
//         notes
//     );
// };
var export_part = function (name_part) {
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var clip = new clip_1.clip.Clip(new clip_1.clip.ClipDao(clip_highlighted, new messenger_1.message.Messenger(env, 0), false));
    var notes = clip.get_notes(clip.get_loop_bracket_lower(), 0, clip.get_loop_bracket_upper() - clip.get_loop_bracket_lower(), 128);
    var logger = new Logger(env);
    logger.log(JSON.stringify(notes));
    exporter.set_notes(name_part, notes);
    part_names.addItem(name_part);
};
var remove = function (name_part) {
    exporter.unset_notes(name_part);
    part_names.removeItem(name_part);
};
var export_clips = function () {
    var clips_to_export = [];
    for (var _i = 0, _a = part_names.data(); _i < _a.length; _i++) {
        var name_part = _a[_i];
        clips_to_export.push(name_part);
    }
    exporter.export_clips(clips_to_export);
    var messenger = new Messenger(env, 0);
};
var test = function () {
    // let song = new li.LiveApiJs(
    //     'live_set'
    // );
    //
    // let clip_highlighted = new li.LiveApiJs(
    //     'live_set view highlighted_clip_slot clip'
    // );
    //
    // let length_clip = clip_highlighted.get("length");
    //
    // let tempo = song.get("tempo");
    //
    // let logger = new Logger(env);
    //
    // logger.log(clip_highlighted.get_id())
};
if (typeof Global !== "undefined") {
    Global.clip_exporter = {};
    Global.clip_exporter.test = test;
    Global.clip_exporter.export_part = export_part;
    Global.clip_exporter.export_clips = export_clips;
    Global.clip_exporter.remove = remove;
    Global.clip_exporter.set_length = set_length;
    Global.clip_exporter.set_tempo = set_tempo;
}
//# sourceMappingURL=clip_exporter.js.map