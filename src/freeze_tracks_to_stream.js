"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("./message/messenger");
var live_1 = require("./live/live");
var clip_1 = require("./clip/clip");
var io_1 = require("./io/io");
var Exporter = io_1.io.Exporter;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var exporter = new Exporter('/Users/elliottevers/Downloads/from_live_2.json');
var set_length = function () {
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    exporter.set_length(clip_highlighted.get("length"));
};
var set_tempo = function () {
    var song = new live_1.live.LiveApiJs('live_set');
    exporter.set_tempo(song.get('tempo'));
};
var add = function (name_part) {
    var song = new live_1.live.LiveApiJs('live_set');
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var clip = new clip_1.clip.Clip(new clip_1.clip.ClipDao(clip_highlighted, new messenger_1.message.Messenger(env, 0), false));
    var notes = clip.get_notes(0, 0, clip_highlighted.get("length"), 128);
    exporter.set_notes(name_part, notes);
};
var remove = function (name_part) {
    exporter.unset_notes(name_part);
};
var export_clips = function () {
    exporter.export_clips(['melody', 'chord', 'bass']);
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
    Global.export_clips = {};
    Global.export_clips.test = test;
    Global.export_clips.add = add;
    Global.export_clips.remove = remove;
    Global.export_clips.export_clips = export_clips;
}
//# sourceMappingURL=freeze_tracks_to_stream.js.map