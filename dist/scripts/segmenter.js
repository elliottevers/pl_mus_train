"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var clip_1 = require("../clip/clip");
var Clip = clip_1.clip.Clip;
var ClipDao = clip_1.clip.ClipDao;
var io_1 = require("../io/io");
var segment_1 = require("../segment/segment");
var Segment = segment_1.segment.Segment;
var _ = require('underscore');
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var length_beats;
var set_length_beats = function (beats) {
    length_beats = beats;
};
var segment_clip = function () {
    // extract segments from sole clip
    // delete clip
    // for each list of notes, create a clip, then set notes
    // 1) create a bunch of empty clips below the currently selected one
    // get track index of highlighted clip
    var clipslot_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot');
    var path_track = clipslot_highlighted.get_path();
    var index_track = path_track.split(' ')[2];
    var clip_highlighted = new Clip(new ClipDao(new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip'), new Messenger(env, 0)));
    var notes_clip = clip_highlighted.get_notes(clip_highlighted.get_loop_bracket_lower(), 0, clip_highlighted.get_loop_bracket_upper(), 128);
    var notes_segments = io_1.io.Importer.import('segment');
    var segments = [];
    for (var _i = 0, notes_segments_1 = notes_segments; _i < notes_segments_1.length; _i++) {
        var note = notes_segments_1[_i];
        segments.push(new Segment(note));
    }
    var logger = new Logger(env);
    // logger.log(String(segments.length));
    // let song = new Song(
    //     let song = new SongDao(
    var song = new live_1.live.LiveApiJs('live_set');
    var _loop_1 = function (i_segment) {
        var segment_2 = segments[Number(i_segment)];
        var path_clipslot = ['live_set', 'tracks', String(index_track), 'clip_slots', String(Number(i_segment))];
        var path_live = path_clipslot.join(' ');
        var scene = new live_1.live.LiveApiJs(['live_set', 'scenes', String(Number(i_segment))].join(' '));
        var scene_exists = Number(scene.get_id()) !== 0;
        // logger.log(scene.get_path());
        if (!scene_exists) {
            song.call('create_scene', String(Number(i_segment)));
        }
        var clipslot = new live_1.live.LiveApiJs(path_live);
        if (Number(i_segment) === 0) {
            clipslot.call('delete_clip', String(length_beats));
        }
        clipslot.call('create_clip', String(length_beats));
        var path_clip = path_clipslot.concat('clip').join(' ');
        var clip_2 = new Clip(new ClipDao(new live_1.live.LiveApiJs(path_clip), new Messenger(env, 0)));
        clip_2.set_loop_bracket_lower(segment_2.get_endpoints_loop()[0]);
        clip_2.set_loop_bracket_upper(segment_2.get_endpoints_loop()[1]);
        var notes_within_segment = notes_clip.filter(function (node) { return segment_2.get_endpoints_loop()[0] <= node.model.note.beat_start && node.model.note.beat_start < segment_2.get_endpoints_loop()[0] + segment_2.get_endpoints_loop()[1]; });
        clip_2.set_notes(notes_within_segment);
    };
    //     new Messenger(env, 0),
    //     false
    // );
    // );
    // return
    // for (let i of _.range(0, segments.length + 1)) {
    for (var i_segment in segments) {
        _loop_1(i_segment);
    }
    // logger.log(clipslot_highlighted.get_id());
    //
    // logger.log(clipslot_highlighted.get_path());
};
if (typeof Global !== "undefined") {
    Global.segmenter = {};
    Global.segmenter.segment_clip = segment_clip;
    Global.segmenter.set_length_beats = set_length_beats;
}
//# sourceMappingURL=segmenter.js.map