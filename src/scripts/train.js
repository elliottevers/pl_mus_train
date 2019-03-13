"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("../control/map");
var FretMapper = map_1.map.FretMapper;
var trainer_1 = require("../train/trainer");
var Trainer = trainer_1.trainer.Trainer;
var serialize_1 = require("../serialize/serialize");
var TrainThawer = serialize_1.thaw.TrainThawer;
var algorithm_1 = require("../train/algorithm");
var Detect = algorithm_1.algorithm.Detect;
var live_1 = require("../live/live");
var LiveClipVirtual = live_1.live.LiveClipVirtual;
var segment_1 = require("../segment/segment");
var Segment = segment_1.segment.Segment;
var constants_1 = require("../constants/constants");
var INSTRUMENTAL = constants_1.modes_control.INSTRUMENTAL;
var clip_1 = require("../clip/clip");
var Clip = clip_1.clip.Clip;
var POLYPHONY = constants_1.modes_texture.POLYPHONY;
var TrainFreezer = serialize_1.freeze.TrainFreezer;
var window_1 = require("../render/window");
var MatrixWindow = window_1.window.MatrixWindow;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var test = function () {
};
var accept = function (user_input, ground_truth) {
    messenger.message([FretMapper.get_interval(user_input, ground_truth)]);
};
// test();
if (typeof Global !== "undefined") {
    Global.compute_feedback = {};
    Global.compute_feedback.accept = accept;
}
var set_mode_texture = function () {
    var mode_texture = POLYPHONY;
};
var set_mode_control = function () {
    var mode_control = INSTRUMENTAL;
};
var set_algorithm_train = function () {
    var algorithm_train = new Detect(user_input_handler);
    var window_local = new MatrixWindow(384, 384, messenger, algorithm_train);
};
var set_song = function () {
    var song = {
        set_overdub: function (int) { },
        set_session_record: function (int) { }
    };
};
var set_clip_user_input = function () {
    var clip_user_input = {
        fire: function () { },
        stop: function () { },
        set_endpoints_loop: function (former, latter) { }
    };
};
var set_segments = function () {
    var segments = [];
    for (var _i = 0, notes_segments_1 = notes_segments; _i < notes_segments_1.length; _i++) {
        var note = notes_segments_1[_i];
        segments.push(new Segment(note));
    }
};
var set_clip_target = function () {
    var clip_dao_virtual = new LiveClipVirtual(notes_target_clip);
    var clip_target_virtual = new Clip(clip_dao_virtual);
};
var begin = function () {
    trainer_1.trainer = new Trainer(window_local, user_input_handler, algorithm_train, clip_user_input, clip_target_virtual, song, segments, messenger);
    trainer_1.trainer.init();
};
var accept_input = function () {
    trainer_local.accept_input([note_target_1_subtarget_1]);
};
// 1 "task" used as
// 1 alg train 2 mode texture 3 mode control 4 clip user input (figure out if we have to highlight and click)  5 clip target (won't need to highlight) 6 segments
// 1) dependencies 2) ground truth
var load_session = function () {
    var config = {
        'window': window_1.window,
        'user_input_handler': user_input_handler,
        'algorithm': algorithm_train,
        'clip_user_input': clip_user_input,
        'clip_target_virtual': clip_target_virtual,
        'song': song,
        'segments': segments,
        'messenger': messenger,
        'env': env
    };
    var freezer = new TrainFreezer(env);
    freezer.freeze(trainer_local, '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json');
};
var save_session = function () {
    var config = {
        'window': window_local,
        'user_input_handler': user_input_handler,
        'algorithm': algorithm_train,
        'clip_user_input': clip_user_input,
        'clip_target_virtual': clip_target_virtual,
        'song': song,
        'segments': segments,
        'messenger': messenger,
        'env': env
    };
    var thawer = new TrainThawer(env);
    var train_thawed = thawer.thaw('/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json', config);
    train_thawed.render_window();
};
// let messenger: Messenger = new Messenger(env, 0);
//
// let mode_texture = POLYPHONY;
// let mode_control = INSTRUMENTAL;
//
// let user_input_handler = new UserInputHandler(
//     mode_texture,
//     mode_control
// );
// let env: string = 'node_for_max';
// env = 'node';
// let messenger = new Messenger(env, 0, 'render_detect');
// let algorithm_train = new Detect(
//     user_input_handler
// );
// let window_local = new MatrixWindow(
//     384,
//     384,
//     messenger,
//     algorithm_train
// );
// stubs
// let song = {
//     set_overdub: (int) => {},
//     set_session_record: (int) => {}
// };
// let clip_user_input = {
//     fire: () => {},
//     stop: () => {},
//     set_endpoints_loop: (former, latter) => {}
// };
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
// let clip_target_virtual = new Clip(clip_dao_virtual);
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
// test case - 2 segments, 2 notes a piece
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
// trainer_local.render_window(
//
// );
// trainer_local.clear_window(
//
// );
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
// let train_thawed = thawer.thaw(
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json',
//     config
// );
//
// train_thawed.render_window(
//
// );
//# sourceMappingURL=train.js.map