"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var window_1 = require("../render/window");
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var logger_1 = require("../log/logger");
var song_1 = require("../song/song");
// import Phrase = phrase.Phrase;
// import Note = note.Note;
var segment_1 = require("../segment/segment");
var Segment = segment_1.segment.Segment;
var SegmentIterator = segment_1.segment.SegmentIterator;
var utils_1 = require("../utils/utils");
var Logger = logger_1.log.Logger;
var LiveClipVirtual = live_1.live.LiveClipVirtual;
var parse_1 = require("../parse/parse");
var TreeDepthIterator = parse_1.parse.TreeDepthIterator;
var ParseTreeIterator = parse_1.parse.ParseTreeIterator;
var ParseMatrix = parse_1.parse.ParseMatrix;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var logger = new Logger(env);
var song_dao = new song_1.song.SongDao(new live_1.live.LiveApiJs("live_set", env), new messenger_1.message.Messenger(env, 0, "song"), true);
var song = new song_1.song.Song(song_dao);
var elaboration;
var clip_user_input;
var clip_segment;
var segment_current;
var segment_iterator;
var tree_depth_iterator;
var parse_tree_iterator;
var layer_parse_tree_current;
var depth_parse_tree;
var notes_segments;
exports.wipe_render = function (messenger) {
    var msg_clear = ["clear"];
    msg_clear.unshift('render');
    messenger.message(msg_clear);
};
exports.render = function () {
    exports.pwindow.render();
};
var start_session_train = function (parse_matrix) {
    logger.log(JSON.stringify(parse_matrix));
    exports.initialize_parse_tree(notes_segments, clip_user_input, song, exports.add_to_tree_export, messenger);
    // grow_from_matrix(parse_matrix);
    fire_session();
};
exports.grow_from_matrix = function (parse_matrix) {
    for (var _i = 0, _a = parse_matrix.get_entries(); _i < _a.length; _i++) {
        var notes = _a[_i];
        exports.add_to_tree_export(notes, parse_matrix.get_note_first_segment().model.note.beat_start, parse_matrix.get_note_last_segment().model.note.get_beat_end(), clip_user_input, song, messenger);
    }
};
var stop_session = function (clip_user_input, song) {
    song.set_overdub(0);
    song.set_session_record(0);
    clip_user_input.stop();
};
var fire_session = function () {
    var interval = segment_current.get_endpoints_loop();
    clip_user_input.set_endpoints_loop(interval[0], interval[1]);
    song.set_overdub(1);
    song.set_session_record(1);
    clip_user_input.fire();
};
var load = function (filename) {
    start_session_train(ParseMatrix.load(filename));
};
var save = function (filename) {
    exports.parse_matrix.save(filename);
    stop_session(clip_user_input, song);
};
var add_to_tree = function (notes, beat_start, beat_end) {
    exports.add_to_tree_export(notes, beat_start, beat_end, clip_user_input, song, messenger);
};
exports.add_to_tree_export = function (notes, beat_start, beat_end, clip_user_input, song, messenger) {
    exports.pwindow.elaborate(notes, beat_start, beat_end, tree_depth_iterator.get_index_current());
    exports.parse_matrix.set_notes(tree_depth_iterator.get_index_current(), segment_iterator.get_index_current(), notes);
    exports.pwindow.render();
    var segment_next = parse_tree_iterator.next();
    var val_segment_next = segment_next.value;
    layer_parse_tree_current = tree_depth_iterator.get_index_current();
    if (segment_next.done) {
        stop_session(clip_user_input, song);
        return;
    }
    segment_current = val_segment_next;
    var interval = segment_current.get_endpoints_loop();
    clip_user_input.set_endpoints_loop(interval[0], interval[1]);
};
var confirm = function () {
    elaboration = clip_user_input.get_notes(segment_current.beat_start, 0, segment_current.beat_end - segment_current.beat_start, 128);
    add_to_tree(elaboration, segment_current.beat_start, segment_current.beat_end);
};
var reset = function () {
    clip_user_input.set_notes(exports.parse_matrix.get_notes(tree_depth_iterator.get_index_current() - 1, segment_iterator.get_index_current()));
};
var erase = function () {
    clip_user_input.remove_notes(segment_current.beat_start, 0, segment_current.beat_end - segment_current.beat_start, 128);
};
function set_clip_segment() {
    var vector_path_live = Array.prototype.slice.call(arguments);
    var live_api_clip_segment = new live_1.live.LiveApiJs(utils_1.utils.PathLive.to_string(vector_path_live));
    clip_segment = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api_clip_segment, new messenger_1.message.Messenger(env, 0), false));
    // TODO: in information retreival phase, save the start and end points of the song and retreive them here
    clip_segment.set_clip_endpoint_lower(1);
    clip_segment.set_clip_endpoint_upper(16 * 4);
    notes_segments = clip_segment.get_notes_within_markers();
}
var set_depth_tree = function (depth) {
    exports.set_depth_tree_export(depth);
};
exports.set_depth_tree_export = function (depth) {
    depth_parse_tree = depth;
};
var begin_train = function () {
    exports.initialize_parse_tree(notes_segments, clip_user_input, song, add_to_tree, messenger);
    fire_session();
};
exports.initialize_parse_tree = function (notes_segments, clip_user_input, song, add_to_tree_export, messenger) {
    var segments = [];
    for (var _i = 0, notes_segments_1 = notes_segments; _i < notes_segments_1.length; _i++) {
        var note = notes_segments_1[_i];
        var clip_dao_virtual = new LiveClipVirtual([note]);
        var clip_segment_virtual = new clip_1.clip.Clip(clip_dao_virtual);
        segments.push(new Segment(note.model.note.beat_start, note.model.note.get_beat_end(), clip_segment_virtual));
    }
    exports.parse_matrix = new ParseMatrix(depth_parse_tree, segments.length);
    segment_iterator = new SegmentIterator(segments, true);
    tree_depth_iterator = new TreeDepthIterator(depth_parse_tree, true);
    parse_tree_iterator = new ParseTreeIterator(segment_iterator, tree_depth_iterator);
    var tree = new TreeModel();
    var note_root = tree.parse({
        id: -1,
        note: new note_1.note.Note(notes_segments[0].model.note.pitch, notes_segments[0].model.note.beat_start, notes_segments[notes_segments.length - 1].model.note.get_beat_end() - notes_segments[0].model.note.beat_start, 90, 0),
        children: []
    });
    var dim = 16 * 6 * 4;
    exports.pwindow = new window_1.window.Pwindow(dim, dim, messenger);
    // initialize
    parse_tree_iterator.next();
    exports.pwindow.set_root(note_root);
    parse_tree_iterator.next('root');
    exports.pwindow.elaborate(notes_segments, notes_segments[0].model.note.beat_start, notes_segments[notes_segments.length - 1].model.note.get_beat_end(), 1);
    for (var i in notes_segments) {
        exports.parse_matrix.set_notes(tree_depth_iterator.get_index_current(), segment_iterator.get_index_current(), [notes_segments[Number(i)]]);
        parse_tree_iterator.next();
    }
    segment_current = segment_iterator.current();
};
// export let begin_train_export = (notes_segments, clip_user_input, song, callback_add_to_tree, messenger) => {
//
//     initialize_parse_tree(notes_segments, clip_user_input, song, callback_add_to_tree, messenger);
//
//     fire_session()
// };
var pause_train = function () {
    clip_user_input.stop();
};
var resume_train = function () {
    clip_user_input.fire();
};
var set_clip_user_input = function () {
    var live_api_user_input = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    // TODO: get notes from segment clip
    var key_route = 'clip_user_input';
    clip_user_input = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api_user_input, new messenger_1.message.Messenger(env, 0), true, key_route));
    clip_user_input.set_path_deferlow('set_path_clip_user_input');
    var beats_duration_song = 16 * 4;
    // logger.log(JSON.stringify(notes_segments));
    clip_user_input.remove_notes(notes_segments[0].model.note.beat_start, 0, beats_duration_song, 128);
    clip_user_input.set_notes(notes_segments);
};
if (typeof Global !== "undefined") {
    Global.parse_tree = {};
    Global.parse_tree.confirm = confirm;
    Global.parse_tree.reset = reset;
    Global.parse_tree.erase = erase;
    Global.parse_tree.save = save;
    Global.parse_tree.load = load;
    Global.parse_tree.set_clip_user_input = set_clip_user_input;
    Global.parse_tree.set_clip_segment = set_clip_segment;
    Global.parse_tree.begin_train = begin_train;
    Global.parse_tree.pause_train = pause_train;
    Global.parse_tree.resume_train = resume_train;
    Global.parse_tree.set_depth_tree = set_depth_tree;
}
//# sourceMappingURL=parse_tree.js.map