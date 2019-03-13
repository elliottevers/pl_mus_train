"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var trainer_1 = require("../train/trainer");
var Trainer = trainer_1.trainer.Trainer;
var serialize_1 = require("../serialize/serialize");
var TrainThawer = serialize_1.thaw.TrainThawer;
var algorithm_1 = require("../train/algorithm");
var Detect = algorithm_1.algorithm.Detect;
var live_1 = require("../live/live");
var segment_1 = require("../segment/segment");
var Segment = segment_1.segment.Segment;
var clip_1 = require("../clip/clip");
var TrainFreezer = serialize_1.freeze.TrainFreezer;
var window_1 = require("../render/window");
var MatrixWindow = window_1.window.MatrixWindow;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
// let accept = (user_input, ground_truth) => {
//     messenger.message([FretMapper.get_interval(user_input ,ground_truth)])
// };
var mode_texture, mode_control, depth_tree, clip_user_input, song, algorithm_train, user_input_handler, window, messenger, clip_target, segments, trainer;
var set_mode_texture = function (option) {
    // let mode_texture = POLYPHONY;
    mode_texture = option;
};
var set_mode_control = function (option) {
    // let mode_control = INSTRUMENTAL;
    mode_control = option;
};
var set_algorithm_train = function () {
    algorithm_train = new Detect(user_input_handler);
    window = new MatrixWindow(384, 384, messenger, algorithm_train);
};
var set_depth_tree = function (depth) {
    depth_tree = depth;
};
var set_clip_user_input = function () {
    clip_user_input = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
};
var set_segments = function () {
    // @ts-ignore
    var list_path_device = Array.prototype.slice.call(arguments);
    list_path_device.shift();
    list_path_device[list_path_device.length - 2] = 'clip_slots';
    list_path_device.push('clip');
    var path_clip = list_path_device.join(' ');
    var live_api;
    live_api = new live_1.live.LiveApiJs(path_clip);
    var clip = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api, new messenger_1.message.Messenger(env, 0), false));
    // TODO: how do we get beat_start, beat_end?
    var notes_segments = clip.get_notes(0, 0, 17 * 4, 128);
    var segments = [];
    for (var _i = 0, notes_segments_1 = notes_segments; _i < notes_segments_1.length; _i++) {
        var note = notes_segments_1[_i];
        segments.push(new Segment(note));
    }
};
// TODO: send this via bus based on options in radio
var set_clip_target = function (path) {
    // let clip_dao_virtual = new LiveClipVirtual(notes_target_clip);
    //
    // let clip_target_virtual = new Clip(clip_dao_virtual);
    var live_api;
    live_api = new live_1.live.LiveApiJs(path);
    var clip_target = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api, new messenger_1.message.Messenger(env, 0), false));
};
var begin = function () {
    // let clip_highlighted = new li.LiveApiJs(
    //     'live_set view highlighted_clip_slot clip'
    // );
    //
    // exporter.set_length(
    //     clip_highlighted.get("length")
    // );
    song = new live_1.live.LiveApiJs('live_set');
    trainer = new Trainer(window, user_input_handler, algorithm_train, clip_user_input, clip_target, song, segments, messenger);
    trainer.init();
};
var pause = function () {
    trainer.pause();
};
var resume = function () {
    trainer.resume();
};
var erase = function () {
};
var reset = function () {
};
var accept = function () {
};
var accept_input = function () {
    var notes;
    if (true) {
        // midi values
    }
    else {
        // signal to use user input clip
    }
    trainer.accept_input(notes);
};
var load = function () {
    // TODO: logic to determine, from project folder, name of file
    var freezer = new TrainFreezer(env);
    freezer.freeze(trainer, '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json');
};
var save = function () {
    // TODO: logic to determine, from project folder, name of file
    var config = {
        'window': window,
        'user_input_handler': user_input_handler,
        'algorithm': algorithm_train,
        'clip_user_input': clip_user_input,
        'clip_target_virtual': clip_target,
        'song': song,
        'segments': segments,
        'messenger': messenger,
        'env': env
    };
    var thawer = new TrainThawer(env);
    var train_thawed = thawer.thaw('/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json', config);
    train_thawed.render_window();
};
// 1 "task" used as
// 1 alg train 2 mode texture 3 mode control 4 clip user input (figure out if we have to highlight and click)  5 clip target (won't need to highlight) 6 segments
// 1) dependencies 2) ground truth
if (typeof Global !== "undefined") {
    Global.train = {};
    Global.train.load = load;
    Global.train.save = save;
    Global.train.pause = pause;
    Global.train.resume = resume;
    Global.train.erase = erase;
    Global.train.reset = reset;
    Global.train.accept = accept;
    Global.train.accept_input = accept_input;
    Global.train.set_segments = set_segments;
    Global.train.set_clip_user_input = set_clip_user_input;
    Global.train.set_clip_target = set_clip_target;
    Global.train.set_depth_tree = set_depth_tree;
    Global.train.set_algorithm_train = set_algorithm_train;
    Global.train.set_mode_control = set_mode_control;
    Global.train.set_mode_texture = set_mode_texture;
}
//# sourceMappingURL=train.js.map