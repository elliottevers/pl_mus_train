"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var utils_1 = require("../utils/utils");
var segment_1 = require("../segment/segment");
var Segment = segment_1.segment.Segment;
var song_1 = require("../song/song");
var SongDao = song_1.song.SongDao;
var Song = song_1.song.Song;
var LiveApiJs = live_1.live.LiveApiJs;
var track_1 = require("../track/track");
var TrackDao = track_1.track.TrackDao;
var Track = track_1.track.Track;
var _ = require('underscore');
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
// get the first clip and use its start and end markers to determine the length of the entire song
var get_length_beats = function () {
    var this_device = new LiveApiJs('this_device');
    var track = new Track(new TrackDao(new LiveApiJs(utils_1.utils.get_path_track_from_path_device(this_device.get_path())), messenger));
    track.load_clip_slots();
    var clip_slot = track.get_clip_slot_at_index(0);
    clip_slot.load_clip();
    var clip = clip_slot.get_clip();
    return clip.get_end_marker() - clip.get_start_marker();
};
var expand_segments = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    var track = new Track(new TrackDao(new LiveApiJs(utils_1.utils.get_path_track_from_path_device(this_device.get_path())), messenger));
    expand_track(track.get_path());
};
var contract_segments = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    var track = new Track(new TrackDao(new LiveApiJs(utils_1.utils.get_path_track_from_path_device(this_device.get_path())), messenger));
    contract_track(track.get_path());
};
var expand_selected_track = function () {
    expand_track('live_set view selected_track');
};
var contract_selected_track = function () {
    contract_track('live_set view selected_track');
};
// Assumption: all clips on "segment track have same length"
// NB: works without highlighting any tracks
// aggregate all the notes in the track's clips
// delete all the track's clips
// set the notes inside of the single clip
var contract_track = function (path_track) {
    // length of first clip
    var length_beats = get_length_beats();
    var track = new Track(new TrackDao(new live_1.live.LiveApiJs(path_track), messenger));
    // clip_slots and clips
    track.load_clips();
    var notes = track.get_notes();
    track.delete_clips();
    track.create_clip_at_index(0, length_beats);
    var clip_slot = track.get_clip_slot_at_index(0);
    clip_slot.load_clip();
    var clip = clip_slot.get_clip();
    clip.set_notes(notes);
    clip.set_endpoint_markers(0, length_beats);
    clip.set_endpoints_loop(0, length_beats);
};
// TODO: we can't export this, because it could be called from a different track than the one the segments are on...
// NB: assumes the device that calls this is on the track of segments
var get_notes_segments = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    var track_segments = new Track(new TrackDao(new LiveApiJs(utils_1.utils.get_path_track_from_path_device(this_device.get_path())), messenger));
    track_segments.load_clips();
    return track_segments.get_notes();
};
var test = function () {
};
var expand_selected_audio_track = function () {
    expand_track_audio('live_set view selected_track');
};
var contract_selected_audio_track = function () {
    contract_track_audio('live_set view selected_track');
};
// NB: we assume all training data starts on the first beat
var contract_track_audio = function (path_track) {
    var length_beats = get_length_beats();
    var track = new Track(new TrackDao(new live_1.live.LiveApiJs(path_track), messenger));
    track.load_clip_slots();
    var clip_slots = track.get_clip_slots();
    for (var i_clip_slot_audio in clip_slots) {
        var clip_slot_audio = clip_slots[Number(i_clip_slot_audio)];
        if (Number(i_clip_slot_audio) === 0) {
            var clip = Track.get_clip_at_index(track.get_index(), Number(i_clip_slot_audio), messenger);
            clip.set_endpoint_markers(0, length_beats);
            continue;
        }
        if (clip_slot_audio.b_has_clip()) {
            clip_slot_audio.delete_clip();
        }
    }
};
var expand_track_audio = function (path_track) {
    var track = new Track(new TrackDao(new LiveApiJs(path_track), messenger));
    track.load_clip_slots();
    var clip_slot_audio = track.get_clip_slot_at_index(0);
    var notes_segments = get_notes_segments();
    var song = new Song(new SongDao(new live_1.live.LiveApiJs('live_set'), new Messenger(env, 0), false));
    song.load_scenes();
    var clip_first = Track.get_clip_at_index(track.get_index(), 0, messenger);
    var segment_first = new Segment(notes_segments[0]);
    clip_first.set_endpoints_loop(segment_first.beat_start, segment_first.beat_end);
    clip_first.set_endpoint_markers(segment_first.beat_start, segment_first.beat_end);
    for (var _i = 0, _a = _.range(1, notes_segments.length); _i < _a.length; _i++) {
        var i_clipslot = _a[_i];
        var note_segment = notes_segments[Number(i_clipslot)];
        var scene = song.get_scene_at_index(Number(i_clipslot));
        var scene_exists = scene !== null;
        if (!scene_exists) {
            song.create_scene_at_index(Number(i_clipslot));
        }
        var clip_slot = Track.get_clip_slot_at_index(track.get_index(), Number(i_clipslot), messenger);
        clip_slot.load_clip();
        if (clip_slot.b_has_clip()) {
            clip_slot.delete_clip();
        }
        clip_slot_audio.duplicate_clip_to(clip_slot);
        // TODO: do we need to add this back?
        // clip_slot.create_clip(length_beats);
        //
        clip_slot.load_clip();
        var clip = Track.get_clip_at_index(track.get_index(), Number(i_clipslot), messenger);
        var segment_2 = new Segment(note_segment);
        clip.set_endpoints_loop(segment_2.beat_start, segment_2.beat_end);
        clip.set_endpoint_markers(segment_2.beat_start, segment_2.beat_end);
    }
};
var expand_track = function (path_track) {
    var track = new Track(new TrackDao(new LiveApiJs(path_track), messenger));
    track.load_clips();
    var clip_slot = track.get_clip_slot_at_index(0);
    clip_slot.load_clip();
    var clip = clip_slot.get_clip();
    var notes_clip = clip.get_notes(clip.get_loop_bracket_lower(), 0, clip.get_loop_bracket_upper(), 128);
    var notes_segments = get_notes_segments();
    var logger = new Logger(env);
    logger.log(JSON.stringify(notes_segments));
    var segments = [];
    for (var _i = 0, notes_segments_1 = notes_segments; _i < notes_segments_1.length; _i++) {
        var note = notes_segments_1[_i];
        segments.push(new Segment(note));
    }
    var song_read = new Song(new SongDao(new live_1.live.LiveApiJs('live_set'), new Messenger(env, 0), false));
    var length_beats = get_length_beats();
    song_read.load_scenes();
    var _loop_1 = function (i_segment) {
        var segment_3 = segments[Number(i_segment)];
        var scene = song_read.get_scene_at_index(Number(i_segment));
        var scene_exists = scene !== null;
        if (!scene_exists) {
            song_read.create_scene_at_index(Number(i_segment));
        }
        var clip_slot_1 = Track.get_clip_slot_at_index(track.get_index(), Number(i_segment), messenger);
        clip_slot_1.load_clip();
        if (Number(i_segment) === 0) {
            clip_slot_1.delete_clip();
        }
        clip_slot_1.create_clip(length_beats);
        clip_slot_1.load_clip();
        var clip_1 = clip_slot_1.get_clip();
        clip_1.set_endpoints_loop(segment_3.get_endpoints_loop()[0], segment_3.get_endpoints_loop()[1]);
        clip_1.set_endpoint_markers(segment_3.get_endpoints_loop()[0], segment_3.get_endpoints_loop()[1]);
        var notes_within_segment = notes_clip.filter(function (node) { return node.model.note.beat_start >= segment_3.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_3.get_endpoints_loop()[1]; });
        clip_1.set_notes(notes_within_segment);
    };
    for (var i_segment in segments) {
        _loop_1(i_segment);
    }
};
if (typeof Global !== "undefined") {
    Global.segmenter = {};
    Global.segmenter.expand_selected_track = expand_selected_track;
    Global.segmenter.contract_selected_track = contract_selected_track;
    Global.segmenter.contract_segments = contract_segments;
    Global.segmenter.expand_segments = expand_segments;
    Global.segmenter.expand_selected_audio_track = expand_selected_audio_track;
    Global.segmenter.contract_selected_audio_track = contract_selected_audio_track;
    Global.segmenter.test = test;
}
//# sourceMappingURL=segmenter.js.map