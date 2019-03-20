"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var trainer_1 = require("../train/trainer");
var Trainer = trainer_1.trainer.Trainer;
var serialize_1 = require("../serialize/serialize");
var TrainThawer = serialize_1.thaw.TrainThawer;
var algorithm_1 = require("../train/algorithm");
var Detect = algorithm_1.algorithm.Detect;
var live_1 = require("../live/live");
var segment_1 = require("../segment/segment");
var Segment = segment_1.segment.Segment;
var constants_1 = require("../constants/constants");
var INSTRUMENTAL = constants_1.modes_control.INSTRUMENTAL;
var clip_1 = require("../clip/clip");
var user_input_1 = require("../control/user_input");
var UserInputHandler = user_input_1.user_input.UserInputHandler;
var POLYPHONY = constants_1.modes_texture.POLYPHONY;
var TrainFreezer = serialize_1.freeze.TrainFreezer;
var window_1 = require("../render/window");
var MatrixWindow = window_1.window.MatrixWindow;
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var MONOPHONY = constants_1.modes_texture.MONOPHONY;
var VOCAL = constants_1.modes_control.VOCAL;
var DETECT = algorithm_1.algorithm.DETECT;
var PREDICT = algorithm_1.algorithm.PREDICT;
var PARSE = algorithm_1.algorithm.PARSE;
var DERIVE = algorithm_1.algorithm.DERIVE;
var Predict = algorithm_1.algorithm.Predict;
var Derive = algorithm_1.algorithm.Derive;
var Parse = algorithm_1.algorithm.Parse;
var FREESTYLE = algorithm_1.algorithm.FREESTYLE;
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var scene_1 = require("../scene/scene");
var SceneDao = scene_1.scene.SceneDao;
var Scene = scene_1.scene.Scene;
var segmenter_1 = require("./segmenter");
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var logger = new Logger(env);
var messenger_render = new Messenger(env, 0, 'render');
var messenger_monitor_target = new Messenger(env, 0, 'index_track_target');
var messenger_num_segments = new Messenger(env, 0, 'num_segments');
var mode_texture, mode_control, clip_user_input, clip_user_input_synchronous, song, algorithm_train, user_input_handler, window, notes_target, segments, trainer;
var index_track_target;
var set_mode_texture = function (option) {
    switch (option) {
        case POLYPHONY: {
            mode_texture = option;
            break;
        }
        case MONOPHONY: {
            mode_texture = option;
            break;
        }
        default: {
            post('error setting texture');
        }
    }
};
var set_mode_control = function (option) {
    switch (option) {
        case VOCAL: {
            mode_control = option;
            break;
        }
        case INSTRUMENTAL: {
            mode_control = option;
            break;
        }
        default: {
            post('error setting control');
        }
    }
};
var set_algorithm_train = function (option) {
    user_input_handler = new UserInputHandler(mode_texture, mode_control);
    switch (option) {
        case FREESTYLE: {
            // algorithm_train = new Freestyle(
            //     user_input_handler
            // );
            break;
        }
        case DETECT: {
            algorithm_train = new Detect(user_input_handler);
            break;
        }
        case PREDICT: {
            algorithm_train = new Predict(user_input_handler);
            break;
        }
        case PARSE: {
            algorithm_train = new Parse(user_input_handler);
            break;
        }
        case DERIVE: {
            algorithm_train = new Derive(user_input_handler);
            break;
        }
        default: {
            post('error setting algorithm');
        }
    }
    window = new MatrixWindow(384, 384, messenger_render, algorithm_train);
};
var set_depth_tree = function (depth) {
    algorithm_train.set_depth(depth);
};
var set_clip_user_input = function () {
    var live_api = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    clip_user_input_synchronous = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api, new messenger_1.message.Messenger(env, 0), false));
    clip_user_input = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api, new messenger_1.message.Messenger(env, 0), true, 'clip_user_input'));
    clip_user_input.set_path_deferlow('set_path_clip_user_input');
};
var set_segments = function () {
    // TODO: this assumes the trainer device is on the same track as the segmenter
    var notes_segments = segmenter_1.get_notes_segments();
    var segments_local = [];
    for (var i_note in notes_segments) {
        var note = notes_segments[Number(i_note)];
        var path_scene = ['live_set', 'scenes', Number(i_note)].join(' ');
        var segment_local = new Segment(note);
        segment_local.set_scene(new Scene(new SceneDao(new live_1.live.LiveApiJs(path_scene))));
        segments_local.push(segment_local);
    }
    messenger_num_segments.message([segments_local.length]);
    segments = segments_local;
};
var test = function () {
};
// const _ = require('underscore');
// TODO: send this via bus based on options in radio
var set_target_notes = function () {
    // @ts-ignore
    var list_path_device_target = Array.prototype.slice.call(arguments);
    // track_target = new li.LiveApiJs(list_path_device_target.slice(0, 3).join(' '));
    // let logger = new Logger(env);
    //
    // logger.log(JSON.stringify(list_path_device_target.slice(0, 3).join(' ')));
    var track_target = new live_1.live.LiveApiJs(list_path_device_target.slice(0, 3).join(' '));
    index_track_target = list_path_device_target[2];
    // notes_target = get_notes(list_path_device_target.join(' '));
    // let index_track_target = Number(list_path_device_target[2]);
    switch (algorithm_train.get_name()) {
        case PARSE: {
            // let this_device = new li.LiveApiJs('this_device');
            //
            // let path_this_device = this_device.get_path();
            //
            // let list_this_device = path_this_device.split(' ');
            //
            // let this_track = new li.LiveApiJs(list_this_device.slice(0, 3).join(' '));
            //
            // let num_clipslots = this_track.get("clip_slots").length/2;
            //
            // let logger = new Logger(env);
            //
            // for (let i of _.range(0, num_clipslots)) {
            // // for (let i of _.range(1, 2)) {
            //
            //     let path_clip_user = [list_this_device.slice(0, 3).join(' '), 'clip_slots', Number(i), 'clip'].join(' ');
            //
            //     // let messenger = new Messenger(env, 0);
            //     logger.log(path_clip_user);
            //
            //     let clip_user = new Clip(
            //         new ClipDao(
            //             new li.LiveApiJs(
            //                 path_clip_user
            //             ),
            //             new Messenger(env, 0),
            //             true,
            //             'clip_user'
            //         )
            //     );
            //
            //     clip_user.set_path_deferlow('set_path_clip_user');
            //
            //     let path_clip_target = ['live_set', 'tracks', index_track_target, 'clip_slots', Number(i), 'clip'].join(' ');
            //
            //     logger.log(path_clip_target);
            //
            //     let clip_target = new Clip(
            //         new ClipDao(
            //             new LiveApiJs(
            //                 path_clip_target
            //             ),
            //             new Messenger(env, 0)
            //         )
            //     );
            //
            //     clip_user.remove_notes(
            //         clip_target.get_loop_bracket_lower(),
            //         0,
            //         clip_target.get_loop_bracket_upper(),
            //         128
            //     );
            //
            //     clip_user.set_notes(
            //         notes_target.filter(
            //             node => node.model.note.beat_start >= clip_target.get_loop_bracket_lower() && node.model.note.get_beat_end() <= clip_target.get_loop_bracket_upper()
            //         )
            //     )
            // }
            track_target.set("solo", 0);
            break;
        }
        case DERIVE: {
            track_target.set("solo", 0);
            break;
        }
        default: {
        }
    }
    messenger_monitor_target.message([list_path_device_target[2]]);
};
var begin = function () {
    // song = new Song(
    //     new SongDao(
    //         new li.LiveApiJs(
    //             'live_set',
    //         ),
    //         new Messenger(env, 0),
    //         false
    //     )
    // );
    var messenger_song = new Messenger(env, 0);
    messenger_song.message(['set_path_song', 'live_set']);
    var song = {
        set_overdub: function (int) { messenger_song.message(['song', 'set', 'overdub', String(int)]); },
        set_session_record: function (int) { messenger_song.message(['song', 'set', 'session_record', String(int)]); },
        stop: function () { messenger_song.message(['song', 'set', 'is_playing', String(0)]); }
    };
    trainer = new Trainer(window, user_input_handler, algorithm_train, clip_user_input, clip_user_input_synchronous, index_track_target, song, segments, new Messenger(env, 0));
    trainer.init();
    trainer.render_window();
};
var pause = function () {
    trainer.pause();
};
var resume = function () {
    trainer.resume();
};
var user_input_command = function (command) {
    var logger = new Logger(env);
    // logger.log('user input command....');
    // TODO: there is literally one character difference between the two algorithms - please abstract
    switch (algorithm_train.get_name()) {
        case PARSE: {
            switch (command) {
                case 'confirm': {
                    var notes = trainer.clip_user_input_synchronous.get_notes(trainer.segment_current.beat_start, 0, trainer.segment_current.beat_end - trainer.segment_current.beat_start, 128);
                    trainer.accept_input(notes);
                    break;
                }
                case 'reset': {
                    var coords_current = trainer.iterator_matrix_train.get_coord_current();
                    trainer.clip_user_input.set_notes(trainer.history_user_input.get([coords_current[0] + 1, coords_current[1]]));
                    break;
                }
                case 'erase': {
                    trainer.clip_user_input.remove_notes(trainer.segment_current.beat_start, 0, trainer.segment_current.beat_end - trainer.segment_current.beat_start, 128);
                    break;
                }
                default: {
                    logger.log('command not recognized');
                }
            }
            break;
        }
        case DERIVE: {
            switch (command) {
                case 'confirm': {
                    var notes = trainer.clip_user_input_synchronous.get_notes(trainer.segment_current.beat_start, 0, trainer.segment_current.beat_end - trainer.segment_current.beat_start, 128);
                    trainer.accept_input(notes);
                    break;
                }
                case 'reset': {
                    var coords_current = trainer.iterator_matrix_train.get_coord_current();
                    var notes = trainer.history_user_input.get([coords_current[0] - 1, coords_current[1]]);
                    trainer.clip_user_input.set_notes(notes);
                    break;
                }
                case 'erase': {
                    var logger_2 = new Logger(env);
                    logger_2.log(JSON.stringify(trainer.segment_current));
                    trainer.clip_user_input.remove_notes(trainer.segment_current.beat_start, 0, trainer.segment_current.beat_end - trainer.segment_current.beat_start, 128);
                    break;
                }
                default: {
                    logger.log('command not recognized');
                }
            }
            break;
        }
        default: {
            logger.log('command not supported for this type of algorithm');
        }
    }
};
var user_input_midi = function (pitch, velocity) {
    switch (algorithm_train.get_name()) {
        case DETECT: {
            var tree = new TreeModel();
            var note = tree.parse({
                id: -1,
                note: new note_1.note.Note(pitch, -Infinity, Infinity, velocity, 0),
                children: []
            });
            trainer.accept_input([note]);
            break;
        }
        case PREDICT: {
            var tree = new TreeModel();
            var note = tree.parse({
                id: -1,
                note: new note_1.note.Note(pitch, -Infinity, Infinity, velocity, 0),
                children: []
            });
            trainer.accept_input([note]);
            break;
        }
        default: {
            logger.log('command not supported for this type of algorithm');
        }
    }
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
        'clip_user_input': trainer.clip_user_input,
        'clip_user_input_synchronous': trainer.clip_user_input_synchronous,
        'index_track_target': index_track_target,
        'song': song,
        'segments': segments,
        'messenger': messenger_render,
        'env': env
    };
    var thawer = new TrainThawer(env);
    var train_thawed = thawer.thaw('/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json', config);
    train_thawed.render_window();
};
if (typeof Global !== "undefined") {
    Global.train = {};
    Global.train.load = load;
    Global.train.save = save;
    Global.train.begin = begin;
    Global.train.pause = pause;
    Global.train.resume = resume;
    Global.train.user_input_command = user_input_command;
    Global.train.user_input_midi = user_input_midi;
    Global.train.set_segments = set_segments;
    Global.train.set_clip_user_input = set_clip_user_input;
    Global.train.set_target_notes = set_target_notes;
    Global.train.set_depth_tree = set_depth_tree;
    Global.train.set_algorithm_train = set_algorithm_train;
    Global.train.set_mode_control = set_mode_control;
    Global.train.set_mode_texture = set_mode_texture;
}
//# sourceMappingURL=train.js.map