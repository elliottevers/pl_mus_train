"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../../src/note/note");
var TreeModel = require("tree-model");
var user_input_1 = require("../../src/control/user_input");
var UserInputHandler = user_input_1.user_input.UserInputHandler;
var messenger_1 = require("../../src/message/messenger");
var Messenger = messenger_1.message.Messenger;
var clip_1 = require("../../src/clip/clip");
var algorithm_1 = require("../../src/train/algorithm");
var Detect = algorithm_1.algorithm.Detect;
var window_1 = require("../../src/render/window");
var trainer_1 = require("../../src/train/trainer");
var Trainer = trainer_1.trainer.Trainer;
var constants_1 = require("../../src/constants/constants");
var POLYPHONY = constants_1.modes_texture.POLYPHONY;
var INSTRUMENTAL = constants_1.modes_control.INSTRUMENTAL;
var MatrixWindow = window_1.window.MatrixWindow;
var track_1 = require("../../src/track/track");
var TrackVirtual = track_1.track.TrackVirtual;
var ClipVirtual = clip_1.clip.ClipVirtual;
var SongVirtual = song.SongVirtual;
var tree = new TreeModel();
var segment_note_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 4, 90, 0),
    children: []
});
var segment_note_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 5, 4, 90, 0),
    children: []
});
var note_target_1_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 2, 90, 0),
    children: []
});
var note_target_1_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 1, 2, 90, 0),
    children: []
});
var note_target_2_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(52, 3, 2, 90, 0),
    children: []
});
var note_target_2_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(54, 3, 2, 90, 0),
    children: []
});
var note_target_3_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 5, 2, 90, 0),
    children: []
});
var note_target_3_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 5, 2, 90, 0),
    children: []
});
var note_target_4_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(54, 7, 2, 90, 0),
    children: []
});
var note_target_4_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(56, 7, 2, 90, 0),
    children: []
});
var mode_texture = POLYPHONY;
var mode_control = INSTRUMENTAL;
var user_input_handler = new UserInputHandler(mode_texture, mode_control);
var env = 'node_for_max';
// env = 'node';
var messenger = new Messenger(env, 0, 'render_detect');
var algorithm_train = new Detect();
var window_local = new MatrixWindow(384, 384, messenger);
var song = new SongVirtual();
// let num_clip_slots = 2;
var track_user_input = new TrackVirtual();
track_user_input.set_clip_at_index(new ClipVirtual(segment_note_1), 0);
track_user_input.set_clip_at_index(new ClipVirtual(segment_note_2), 1);
var track_target = new TrackVirtual();
track_target.set_clip_at_index(new ClipVirtual(note_target_1_subtarget_1, note_target_1_subtarget_2, note_target_2_subtarget_1, note_target_2_subtarget_2), 0);
track_target.set_clip_at_index(new ClipVirtual(note_target_3_subtarget_1, note_target_3_subtarget_2, note_target_4_subtarget_1, note_target_4_subtarget_2), 1);
// let clip_user_input_async = {
//     fire: () => {},
//     stop: () => {},
//     set_endpoints_loop: (former, latter) => {}
// };
//
// let clip_user_input_synchronous = {
//     fire: () => {},
//     stop: () => {},
//     set_endpoints_loop: (former, latter) => {}
// };
// let notes_segments = [
//     segment_note_1,
//     segment_note_2
// ];
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
// let segments: Segment[] = [];
//
// for (let note of notes_segments) {
//     segments.push(
//         new Segment(
//             note
//         )
//     )
// }
// let clip_dao_virtual = new LiveClipVirtual(notes_target_clip);
//
// let clip_target = new Clip(clip_dao_virtual);
var trainer_local = new Trainer(window_local, user_input_handler, algorithm_train, track_target, track_user_input, song, messenger);
// test case - 2 segments, 2 notes a piece
trainer_local.init();
trainer_local.accept_input([note_target_1_subtarget_1]);
trainer_local.accept_input([note_target_1_subtarget_2]);
trainer_local.accept_input([note_target_2_subtarget_1]);
trainer_local.accept_input([note_target_2_subtarget_2]);
trainer_local.accept_input([note_target_3_subtarget_1]);
trainer_local.render_window();
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
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json'
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
//     'clip_user_input_synchronous': clip_user_input_synchronous,
//     'notes_target': notes_target_clip,
//     // 'clip_target': clip_target,
//     'song': song,
//     'segments': segments,
//     'messenger': messenger,
//     'env': env
// };
//
// let train_thawed = thawer.thaw(
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json',
//     config
// );
//
// train_thawed.render_window(
//
// );
//# sourceMappingURL=detect.js.map