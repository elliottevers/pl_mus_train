"use strict";
// import {message as m, message} from "../message/messenger";
// import Messenger = message.Messenger;
// import {live, live as li} from "../live/live";
// import {clip as c} from "../clip/clip";
// import {window as w} from "../render/window";
// import {note as n} from "../note/note";
// import TreeModel = require("tree-model");
// import {log} from "../log/logger";
// import {song as s} from "../song/song";
// import {segment} from "../segment/segment";
// import Segment = segment.Segment;
// import SegmentIterator = segment.SegmentIterator;
// import {utils} from "../utils/utils";
// import Logger = log.Logger;
// import LiveClipVirtual = live.LiveClipVirtual;
// import {parse} from "../parse/parse";
// import TreeDepthIterator = parse.TreeDepthIterator;
// import ParseTreeIterator = parse.ParseTreeIterator;
// import ParseMatrix = parse.ParseMatrix;
//
// declare let autowatch: any;
// declare let inlets: any;
// declare let outlets: any;
// declare function outlet(n: number, o: any): void;
// declare function post(message?: any): void;
//
// export {}
//
// declare let Global: any;
//
// let env: string = 'max';
//
// if (env === 'max') {
//     post('recompile successful');
//     autowatch = 1;
// }
//
// let messenger: Messenger = new Messenger(env, 0);
//
// let logger = new Logger(env);
//
// let song_dao = new s.SongDao(
//     new li.LiveApiJs("live_set", env),
//     new m.Messenger(env, 0, "song"),
//     true
// );
//
// let song: s.Song = new s.Song(song_dao);
//
// export let pwindow: w.Pwindow;
//
// let elaboration: TreeModel.Node<n.Note>[];
//
// let clip_user_input: c.Clip;
//
// let clip_segment: c.Clip;
//
// let segment_current: Segment;
//
// let segment_iterator: SegmentIterator;
//
// let tree_depth_iterator: TreeDepthIterator;
//
// let parse_tree_iterator: ParseTreeIterator;
//
// let layer_parse_tree_current: number;
//
// let depth_parse_tree: number;
//
// export let parse_matrix: ParseMatrix;
//
// let notes_segments: TreeModel.Node<n.Note>[];
Object.defineProperty(exports, "__esModule", { value: true });
// export let wipe_render = (messenger) => {
//     let msg_clear = ["clear"];
//     msg_clear.unshift('render');
//     messenger.message(msg_clear);
// };
// export let render = () => {
//     pwindow.render();
// };
// let start_session_train = (parse_matrix) => {
//     logger.log(JSON.stringify(parse_matrix));
//     initialize_parse_tree(notes_segments, clip_user_input, song, add_to_tree_export, messenger);
//     // grow_from_matrix(parse_matrix);
//     fire_session()
// };
// export let grow_from_matrix = (parse_matrix) => {
//     for (let notes of parse_matrix.get_entries()) {
//         add_to_tree_export(
//             notes,
//             parse_matrix.get_note_first_segment().model.note.beat_start,
//             parse_matrix.get_note_last_segment().model.note.get_beat_end(),
//             clip_user_input,
//             song,
//             messenger
//         );
//     }
// };
// let stop_session = (clip_user_input, song) => {
//     song.set_overdub(0);
//
//     song.set_session_record(0);
//
//     clip_user_input.stop();
// };
// let fire_session = () => {
//     let interval = segment_current.get_endpoints_loop();
//
//     clip_user_input.set_endpoints_loop(
//         interval[0],
//         interval[1]
//     );
//
//     song.set_overdub(1);
//
//     song.set_session_record(1);
//
//     clip_user_input.fire();
// };
// let load = (filename) => {
//     start_session_train(
//         ParseMatrix.load(
//             filename
//         )
//     )
// };
//
// let save = (filename) => {
//     parse_matrix.save(filename);
//     stop_session(clip_user_input, song)
// };
var start = function () {
    trainer.init();
};
var resume = function () {
    trainer.resume();
};
var pause = function () {
    trainer.pause();
};
// let add_to_tree = (notes, beat_start, beat_end) => {
//     add_to_tree_export(notes, beat_start, beat_end, clip_user_input, song, messenger)
// };
exports.add_to_tree_export = function (notes, beat_start, beat_end, clip_user_input, song, messenger) {
    // pwindow.elaborate(
    //     notes,
    //     beat_start,
    //     beat_end,
    //     tree_depth_iterator.get_index_current()
    // );
    //
    // parse_matrix.set_notes(
    //     tree_depth_iterator.get_index_current(),
    //     segment_iterator.get_index_current(),
    //     notes
    // );
    // pwindow.render();
    var segment_next = parse_tree_iterator.next();
    var val_segment_next = segment_next.value;
    layer_parse_tree_current = tree_depth_iterator.get_index_current();
    // if (segment_next.done) {
    //
    //     stop_session(clip_user_input, song);
    //
    //     return
    // }
    //
    // segment_current = val_segment_next;
    //
    // let interval = segment_current.get_endpoints_loop();
    //
    // clip_user_input.set_endpoints_loop(
    //     interval[0],
    //     interval[1]
    // );
};
// let confirm = () => {
//
//     elaboration = clip_user_input.get_notes(
//         segment_current.beat_start,
//         0,
//         segment_current.beat_end - segment_current.beat_start,
//         128
//     );
//
//     add_to_tree(
//         elaboration,
//         segment_current.beat_start,
//         segment_current.beat_end
//     );
// };
var reset = function () {
    trainer.reset_user_input();
    // clip_user_input.set_notes(
    //     trainer.get_notes_struct(
    //         // TODO: some information
    //     )
    // );
};
var erase = function () {
    // clip_user_input.remove_notes(
    //     segment_current.beat_start,
    //     0,
    //     segment_current.beat_end - segment_current.beat_start,
    //     128
    // );
};
function set_clip_segment() {
    var vector_path_live = Array.prototype.slice.call(arguments);
    var live_api_clip_segment = new li.LiveApiJs(utils.PathLive.to_string(vector_path_live));
    clip_segment = new c.Clip(new c.ClipDao(live_api_clip_segment, new m.Messenger(env, 0), false));
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
        var clip_segment_virtual = new c.Clip(clip_dao_virtual);
        segments.push(new Segment(note.model.note.beat_start, note.model.note.get_beat_end(), clip_segment_virtual));
    }
    parse_matrix = new ParseMatrix(depth_parse_tree, segments.length);
    segment_iterator = new SegmentIterator(segments, true);
    tree_depth_iterator = new TreeDepthIterator(depth_parse_tree, true);
    parse_tree_iterator = new ParseTreeIterator(segment_iterator, tree_depth_iterator);
    var tree = new TreeModel();
    var note_root = tree.parse({
        id: -1,
        note: new n.Note(notes_segments[0].model.note.pitch, notes_segments[0].model.note.beat_start, notes_segments[notes_segments.length - 1].model.note.get_beat_end() - notes_segments[0].model.note.beat_start, 90, 0),
        children: []
    });
    var dim = 16 * 6 * 4;
    pwindow = new w.Pwindow(dim, dim, messenger);
    // initialize
    parse_tree_iterator.next();
    pwindow.set_root(note_root);
    parse_tree_iterator.next('root');
    pwindow.elaborate(notes_segments, notes_segments[0].model.note.beat_start, notes_segments[notes_segments.length - 1].model.note.get_beat_end(), 1);
    for (var i in notes_segments) {
        parse_matrix.set_notes(tree_depth_iterator.get_index_current(), segment_iterator.get_index_current(), [notes_segments[Number(i)]]);
        parse_tree_iterator.next();
    }
    segment_current = segment_iterator.current();
};
var pause_train = function () {
    clip_user_input.stop();
};
var resume_train = function () {
    clip_user_input.fire();
};
var set_clip_user_input = function () {
    var live_api_user_input = new li.LiveApiJs('live_set view highlighted_clip_slot clip');
    // TODO: get notes from segment clip
    var key_route = 'clip_user_input';
    clip_user_input = new c.Clip(new c.ClipDao(live_api_user_input, new m.Messenger(env, 0), true, key_route));
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
//# sourceMappingURL=train.js.map