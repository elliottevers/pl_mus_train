"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../../src/note/note");
var TreeModel = require("tree-model");
var user_input_1 = require("../../src/control/user_input");
var UserInputHandler = user_input_1.user_input.UserInputHandler;
var messenger_1 = require("../../src/message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../../src/live/live");
var LiveClipVirtual = live_1.live.LiveClipVirtual;
var segment_1 = require("../../src/segment/segment");
var Segment = segment_1.segment.Segment;
var clip_1 = require("../../src/clip/clip");
var Clip = clip_1.clip.Clip;
var algorithm_1 = require("../../src/train/algorithm");
var Detect = algorithm_1.algorithm.Detect;
var serialize_1 = require("../../src/serialize/serialize");
var TrainFreezer = serialize_1.freeze.TrainFreezer;
var TrainThawer = serialize_1.thaw.TrainThawer;
var window_1 = require("../../src/render/window");
var ListWindow = window_1.window.ListWindow;
var trainer_1 = require("../../src/train/trainer");
var Trainer = trainer_1.trainer.Trainer;
var constants_1 = require("../../src/constants/constants");
var MONOPONY = constants_1.modes_texture.MONOPONY;
var VOCAL = constants_1.modes_control.VOCAL;
var tree = new TreeModel();
// let segment_note_1 = tree.parse(
//     {
//         id: -1, // TODO: hashing scheme for clip id and beat start
//         note: new n.Note(
//             51,
//             1,
//             4,
//             90,
//             0
//         ),
//         children: [
//
//         ]
//     }
// );
//
// let segment_note_2 = tree.parse(
//     {
//         id: -1, // TODO: hashing scheme for clip id and beat start
//         note: new n.Note(
//             51,
//             5,
//             4,
//             90,
//             0
//         ),
//         children: [
//
//         ]
//     }
// );
//
//
//
// let note_target_1_subtarget_1 = tree.parse(
//     {
//             id: -1, // TODO: hashing scheme for clip id and beat start
//             note: new n.Note(
//                 51,
//                 1,
//                 2,
//                 90,
//                 0
//             ),
//             children: [
//
//             ]
//     }
// );
//
// let note_target_1_subtarget_2 = tree.parse(
//     {
//             id: -1, // TODO: hashing scheme for clip id and beat start
//             note: new n.Note(
//                 53,
//                 1,
//                 2,
//                 90,
//                 0
//             ),
//             children: [
//
//             ]
//     }
// );
//
//
//
// let note_target_2_subtarget_1 = tree.parse(
//     {
//             id: -1, // TODO: hashing scheme for clip id and beat start
//             note: new n.Note(
//                 52,
//                 3,
//                 2,
//                 90,
//                 0
//             ),
//             children: [
//
//             ]
//     }
// );
//
// let note_target_2_subtarget_2 = tree.parse(
//     {
//             id: -1, // TODO: hashing scheme for clip id and beat start
//             note: new n.Note(
//                 54,
//                 3,
//                 2,
//                 90,
//                 0
//             ),
//             children: [
//
//             ]
//     }
// );
//
//
//
// let note_target_3_subtarget_1 = tree.parse(
//     {
//             id: -1, // TODO: hashing scheme for clip id and beat start
//             note: new n.Note(
//                 53,
//                 5,
//                 2,
//                 90,
//                 0
//             ),
//             children: [
//
//             ]
//     }
// );
//
// let note_target_3_subtarget_2 = tree.parse(
//     {
//             id: -1, // TODO: hashing scheme for clip id and beat start
//             note: new n.Note(
//                 55,
//                 5,
//                 2,
//                 90,
//                 0
//             ),
//             children: [
//
//             ]
//     }
// );
//
//
//
// let note_target_4_subtarget_1 = tree.parse(
//     {
//             id: -1, // TODO: hashing scheme for clip id and beat start
//             note: new n.Note(
//                 54,
//                 7,
//                 2,
//                 90,
//                 0
//             ),
//             children: [
//
//             ]
//     }
// );
//
// let note_target_4_subtarget_2 = tree.parse(
//     {
//             id: -1, // TODO: hashing scheme for clip id and beat start
//             note: new n.Note(
//                 56,
//                 7,
//                 2,
//                 90,
//                 0
//             ),
//             children: [
//
//             ]
//     }
// );
//
//
// let mode_texture = POLYPHONY;
// let mode_control = INSTRUMENTAL;
//
// let user_input_handler = new UserInputHandler(
//     mode_texture,
//     mode_control
// );
//
// let env: string = 'node_for_max';
// env = 'node';
//
//
// let messenger = new Messenger(env, 0, 'render');
//
// let window_local = new ListWindow(
//     384,
//     384,
//     messenger
// );
//
// let algorithm_train = new Detect(
//     user_input_handler
// );
//
// // stubs
// let song = {
//     set_overdub: (int) => {},
//     set_session_record: (int) => {}
// };
//
// let clip_user_input = {
//     fire: () => {},
//     stop: () => {},
//     set_endpoints_loop: (former, latter) => {}
// };
//
// let notes_segments = [
//     segment_note_1,
//     segment_note_2
// ];
//
// let notes_target_clip = [
//     note_target_1_subtarget_1,
//     note_target_1_subtarget_2,
//     note_target_2_subtarget_1,
//     note_target_2_subtarget_2,
//     note_target_3_subtarget_1,
//     note_target_3_subtarget_2,
//     note_target_4_subtarget_1,
//     note_target_4_subtarget_2
// ];
//
// let segments: Segment[] = [];
//
// for (let note of notes_segments) {
//     segments.push(
//         new Segment(
//             note
//         )
//     )
// }
//
// let clip_dao_virtual = new LiveClipVirtual(notes_target_clip);
//
// let clip_target_virtual = new Clip(clip_dao_virtual);
//
// let trainer_local = new Trainer(
//     window_local,
//     user_input_handler,
//     algorithm_train,
//     clip_user_input,
//     clip_target_virtual,
//     song,
//     segments,
//     messenger
// );
//
// // test case - 2 segments, 2 notes a piece
//
// trainer_local.init(
//
// );
//
// trainer_local.accept_input(
//     [note_target_1_subtarget_1]
// );
//
// trainer_local.accept_input(
//     [note_target_1_subtarget_2]
// );
//
// trainer_local.accept_input(
//     [note_target_2_subtarget_1]
// );
//
// trainer_local.accept_input(
//     [note_target_2_subtarget_2]
// );
//
// trainer_local.accept_input(
//     [note_target_3_subtarget_1]
// );
//
// trainer_local.render_window(
//
// );
//
// trainer_local.clear_window(
//
// );
//
// let freezer = new TrainFreezer(
//     env
// );
//
// freezer.freeze(
//     trainer_local,
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json'
// );
//
// let thawer = new TrainThawer(
//     env
// );
//
// let config = {
//     'window': window_local,
//     'user_input_handler': user_input_handler,
//     'algorithm': algorithm_train,
//     'clip_user_input': clip_user_input,
//     'clip_target_virtual': clip_target_virtual,
//     'song': song,
//     'segments': segments,
//     'messenger': messenger,
//     'env': env
// };
//
// let train_thawed = thawer.thaw(
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json',
//     config
// );
//
// train_thawed.render_window(
//
// );
// TODO: to finish test case, verify that it looks correct in window
// PARSE
// let tree: TreeModel = new TreeModel();
var segment_note_1_parse = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 4, 90, 0),
    children: []
});
var segment_note_2_parse = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 5, 4, 90, 0),
    children: []
});
var note_melody_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 2, 90, 0),
    children: []
});
var note_melody_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 3, 2, 90, 0),
    children: []
});
var note_melody_3 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 5, 2, 90, 0),
    children: []
});
var note_melody_4 = tree.parse({
    id: -1,
    note: new note_1.note.Note(56, 7, 2, 90, 0),
    children: []
});
var note_summarized_melody_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 4, 90, 0),
    children: []
});
var note_summarized_melody_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 5, 4, 90, 0),
    children: []
});
var note_summarized_root = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 8, 90, 0),
    children: []
});
var mode_texture_parse = MONOPONY;
var mode_control_parse = VOCAL;
var user_input_handler_parse = new UserInputHandler(mode_texture_parse, mode_control_parse);
var env_parse = 'node_for_max';
env_parse = 'node';
var messenger_parse = new Messenger(env_parse, 0, 'render_parse');
var window_local_parse = new ListWindow(384, 384, messenger_parse);
var algorithm_train_parse = new Detect(user_input_handler_parse);
// stubs
var song_parse = {
    set_overdub: function (int) { },
    set_session_record: function (int) { }
};
var clip_user_input_parse = {
    fire: function () { },
    stop: function () { },
    set_endpoints_loop: function (former, latter) { }
};
var notes_segments_parse = [
    segment_note_1_parse,
    segment_note_2_parse
];
var notes_target_clip_parse = [
    note_melody_1,
    note_melody_2,
    note_melody_3,
    note_melody_4,
];
var segments_parse = [];
for (var _i = 0, notes_segments_parse_1 = notes_segments_parse; _i < notes_segments_parse_1.length; _i++) {
    var note = notes_segments_parse_1[_i];
    segments_parse.push(new Segment(note));
}
var clip_dao_virtual_parse = new LiveClipVirtual(notes_target_clip_parse);
var clip_target_virtual_parse = new Clip(clip_dao_virtual_parse);
var trainer_local_parse = new Trainer(window_local_parse, user_input_handler_parse, algorithm_train_parse, clip_user_input_parse, clip_target_virtual_parse, song_parse, segments_parse, messenger_parse);
// test case - 2 segments, 2 notes a piece
trainer_local_parse.init();
trainer_local_parse.accept_input([note_target_1_subtarget_1]);
trainer_local_parse.accept_input([note_target_1_subtarget_2]);
trainer_local_parse.accept_input([note_target_2_subtarget_1]);
trainer_local_parse.accept_input([note_target_2_subtarget_2]);
trainer_local_parse.accept_input([note_target_3_subtarget_1]);
trainer_local_parse.render_window();
trainer_local_parse.clear_window();
var freezer_parse = new TrainFreezer(env);
freezer_parse.freeze(trainer_local, '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json');
var thawer_parse = new TrainThawer(env_parse);
var config_parse = {
    'window': window_local_parse,
    'user_input_handler': user_input_handler_parse,
    'algorithm': algorithm_train_parse,
    'clip_user_input': clip_user_input_parse,
    'clip_target_virtual': clip_target_virtual_parse,
    'song': song_parse,
    'segments': segments_parse,
    'messenger': messenger_parse,
    'env': env_parse
};
var train_thawed_parse = thawer_parse.thaw('/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json', config);
train_thawed_parse.render_window();
//# sourceMappingURL=train.js.map