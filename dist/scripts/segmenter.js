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
// NB: works without highlighting any tracks
var contract_clip = function (path_clip_slot) {
    var device = new live_1.live.LiveApiJs(path_clip_slot);
    var path_this_device = device.get_path();
    var list_this_device = path_this_device.split(' ');
    var index_this_track = Number(list_this_device[2]);
    var this_track = new live_1.live.LiveApiJs(list_this_device.slice(0, 3).join(' '));
    var num_clipslots = this_track.get("clip_slots").length / 2;
    var notes_amassed = [];
    // first, amass all notes of clips and delete all clips
    for (var _i = 0, _a = _.range(0, num_clipslots); _i < _a.length; _i++) {
        var i_clipslot = _a[_i];
        var path_clipslot = ['live_set', 'tracks', index_this_track, 'clip_slots', Number(i_clipslot)].join(' ');
        var api_clipslot_segment = new live_1.live.LiveApiJs(path_clipslot);
        var clip_segment = new Clip(new ClipDao(new live_1.live.LiveApiJs(path_clipslot.split(' ').concat(['clip']).join(' ')), new Messenger(env, 0)));
        notes_amassed = notes_amassed.concat(clip_segment.get_notes(clip_segment.get_loop_bracket_lower(), 0, clip_segment.get_loop_bracket_upper(), 128));
        api_clipslot_segment.call('delete_clip');
    }
    // create one clip of length "length_beats"
    var path_clipslot_contracted = ['live_set', 'tracks', String(index_this_track), 'clip_slots', String(0)];
    var api_clipslot_contracted = new live_1.live.LiveApiJs(path_clipslot_contracted.join(' '));
    api_clipslot_contracted.call('create_clip', String(length_beats));
    var clip_contracted = new Clip(new ClipDao(new live_1.live.LiveApiJs(path_clipslot_contracted.concat(['clip']).join(' ')), new Messenger(env, 0)));
    // add the amassed notes to it
    clip_contracted.set_notes(notes_amassed);
};
var expand_segments = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    var path_this_device = this_device.get_path();
    var list_this_device = path_this_device.split(' ');
    var index_this_track = Number(list_this_device[2]);
    expand_clip(['live_set', 'tracks', index_this_track, 'clip_slots', 0].join(' '));
};
var contract_segments = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    var path_this_device = this_device.get_path();
    var list_this_device = path_this_device.split(' ');
    var index_this_track = Number(list_this_device[2]);
    contract_clip(['live_set', 'tracks', index_this_track, 'clip_slots', 0].join(' '));
};
var expand_highlighted_clip = function () {
    expand_clip('live_set view highlighted_clip_slot');
};
var contract_highlighted_clip = function () {
    contract_clip('live_set view highlighted_clip_slot');
};
exports.get_notes_on_track = function (path_track) {
    var index_track = Number(path_track.split(' ')[2]);
    var track = new live_1.live.LiveApiJs(path_track);
    var num_clipslots = track.get("clip_slots").length / 2;
    var notes_amassed = [];
    for (var _i = 0, _a = _.range(0, num_clipslots); _i < _a.length; _i++) {
        var i_clipslot = _a[_i];
        var path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
        var clip_2 = new Clip(new ClipDao(new live_1.live.LiveApiJs(path_clipslot.split(' ').concat(['clip']).join(' ')), new Messenger(env, 0)));
        notes_amassed = notes_amassed.concat(clip_2.get_notes(clip_2.get_loop_bracket_lower(), 0, clip_2.get_loop_bracket_upper(), 128));
    }
    return notes_amassed;
};
exports.get_notes_segments = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    var path_this_track = this_device.get_path().split(' ').slice(0, 3).join(' ');
    // let logger = new Logger('max');
    // logger.log(path_this_track);
    return exports.get_notes_on_track(path_this_track);
};
// 'live_set view highlighted_clip_slot'
var test = function () {
    expand_clip_audio('live_set view highlighted_clip_slot');
};
var expand_clip_audio = function (path_clip_slot) {
    var clipslot_audio = new live_1.live.LiveApiJs(path_clip_slot);
    var track = new live_1.live.LiveApiJs(clipslot_audio.get_path().split(' ').slice(0, 3).join(' '));
    var index_track = clipslot_audio.get_path().split(' ')[2];
    var num_clipslots = track.get("clip_slots").length / 2;
    for (var _i = 0, _a = _.range(1, num_clipslots); _i < _a.length; _i++) {
        var i_clipslot = _a[_i];
        var path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
        var clipslot = new live_1.live.LiveApiJs(path_clipslot);
        var logger = new Logger(env);
        logger.log(JSON.stringify(clipslot.get("has_clip")));
        var has_clip = clipslot.get("has_clip")[0] === 1;
        if (has_clip) {
            clipslot.call("delete_clip");
        }
        clipslot_audio.call("duplicate_clip_to", ['id', clipslot.get_id()].join(' '));
    }
};
// let notes_segments = io.Importer.import('segment');
var expand_clip = function (path_clip_slot) {
    var clipslot_highlighted = new live_1.live.LiveApiJs(path_clip_slot);
    var path_track = clipslot_highlighted.get_path();
    var index_track = path_track.split(' ')[2];
    var clip_highlighted = new Clip(new ClipDao(new live_1.live.LiveApiJs([path_clip_slot, 'clip'].join(' ')), new Messenger(env, 0)));
    var notes_clip = clip_highlighted.get_notes(clip_highlighted.get_loop_bracket_lower(), 0, clip_highlighted.get_loop_bracket_upper(), 128);
    var notes_segments = exports.get_notes_segments();
    var segments = [];
    for (var _i = 0, notes_segments_1 = notes_segments; _i < notes_segments_1.length; _i++) {
        var note = notes_segments_1[_i];
        segments.push(new Segment(note));
    }
    var song = new live_1.live.LiveApiJs('live_set');
    var logger = new Logger(env);
    var _loop_1 = function (i_segment) {
        var segment_2 = segments[Number(i_segment)];
        var path_clipslot = ['live_set', 'tracks', String(index_track), 'clip_slots', String(Number(i_segment))];
        var path_live = path_clipslot.join(' ');
        var scene = new live_1.live.LiveApiJs(['live_set', 'scenes', String(Number(i_segment))].join(' '));
        var scene_exists = Number(scene.get_id()) !== 0;
        if (!scene_exists) {
            song.call('create_scene', String(Number(i_segment)));
        }
        var clipslot = new live_1.live.LiveApiJs(path_live);
        if (Number(i_segment) === 0) {
            clipslot.call('delete_clip');
        }
        clipslot.call('create_clip', String(segment_2.get_endpoints_loop()[1] - segment_2.get_endpoints_loop()[0]));
        var path_clip = path_clipslot.concat('clip').join(' ');
        var clip_3 = new Clip(new ClipDao(new live_1.live.LiveApiJs(path_clip), new Messenger(env, 0)));
        clip_3.set_endpoints_loop(segment_2.get_endpoints_loop()[0], segment_2.get_endpoints_loop()[1]);
        clip_3.set_endpoint_markers(segment_2.get_endpoints_loop()[0], segment_2.get_endpoints_loop()[1]);
        var notes_within_segment = notes_clip.filter(function (node) { return node.model.note.beat_start >= segment_2.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_2.get_endpoints_loop()[1]; });
        clip_3.set_notes(notes_within_segment);
    };
    for (var i_segment in segments) {
        _loop_1(i_segment);
    }
};
if (typeof Global !== "undefined") {
    Global.segmenter = {};
    Global.segmenter.expand_highlighted_clip = expand_highlighted_clip;
    Global.segmenter.contract_highlighted_clip = contract_highlighted_clip;
    Global.segmenter.contract_segments = contract_segments;
    Global.segmenter.expand_segments = expand_segments;
    Global.segmenter.set_length_beats = set_length_beats;
    Global.segmenter.test = test;
}
//# sourceMappingURL=segmenter.js.map