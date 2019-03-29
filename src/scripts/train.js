"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var algorithm_1 = require("../train/algorithm");
var Predict = algorithm_1.algorithm.Predict;
var Parse = algorithm_1.algorithm.Parse;
var Derive = algorithm_1.algorithm.Derive;
var trainer_1 = require("../train/trainer");
var Trainer = trainer_1.trainer.Trainer;
var clip_1 = require("../clip/clip");
var ClipDao = clip_1.clip.ClipDao;
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var Detect = algorithm_1.algorithm.Detect;
var segment_1 = require("../segment/segment");
var Segment = segment_1.segment.Segment;
var constants_1 = require("../constants/constants");
var MONOPHONY = constants_1.modes_texture.MONOPHONY;
var INSTRUMENTAL = constants_1.modes_control.INSTRUMENTAL;
var Clip = clip_1.clip.Clip;
var song_1 = require("../song/song");
var SongDao = song_1.song.SongDao;
var user_input_1 = require("../control/user_input");
var UserInputHandler = user_input_1.user_input.UserInputHandler;
var Song = song_1.song.Song;
var PARSE = algorithm_1.algorithm.PARSE;
var utils_1 = require("../utils/utils");
var DERIVE = algorithm_1.algorithm.DERIVE;
var DETECT = algorithm_1.algorithm.DETECT;
var scene_1 = require("../scene/scene");
var SceneDao = scene_1.scene.SceneDao;
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var thaw_1 = require("../serialize/thaw");
var TrainThawer = thaw_1.thaw.TrainThawer;
var Scene = scene_1.scene.Scene;
var track_1 = require("../track/track");
var TrackDao = track_1.track.TrackDao;
var VOCAL = constants_1.modes_control.VOCAL;
var PREDICT = algorithm_1.algorithm.PREDICT;
var POLYPHONY = constants_1.modes_texture.POLYPHONY;
var note_1 = require("../note/note");
var Note = note_1.note.Note;
var freeze_1 = require("../serialize/freeze");
var TrainFreezer = freeze_1.freeze.TrainFreezer;
var FREESTYLE = algorithm_1.algorithm.FREESTYLE;
var Track = track_1.track.Track;
var window_1 = require("../render/window");
var MatrixWindow = window_1.window.MatrixWindow;
var TreeModel = require("tree-model");
var _ = require('underscore');
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var logger = new Logger(env);
var messenger_render = new Messenger(env, 0, 'render');
var messenger_monitor_target = new Messenger(env, 0, 'index_track_target');
var messenger_num_segments = new Messenger(env, 0, 'num_segments');
var mode_texture, mode_control, song, algorithm_train, user_input_handler, window, segments_train, trainer;
var track_target, track_user_input;
var set_mode_texture = function (option) {
    switch (option) {
        case POLYPHONY: {
            mode_texture = POLYPHONY;
            break;
        }
        case MONOPHONY: {
            mode_texture = MONOPHONY;
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
            mode_control = VOCAL;
            break;
        }
        case INSTRUMENTAL: {
            mode_control = INSTRUMENTAL;
            break;
        }
        default: {
            post('error setting control');
        }
    }
};
var set_algorithm_train = function (option) {
    switch (option) {
        case FREESTYLE: {
            // algorithm_train = new Freestyle(
            //     user_input_handler
            // );
            break;
        }
        case DETECT: {
            algorithm_train = new Detect();
            break;
        }
        case PREDICT: {
            algorithm_train = new Predict();
            break;
        }
        case PARSE: {
            algorithm_train = new Parse();
            break;
        }
        case DERIVE: {
            algorithm_train = new Derive();
            break;
        }
        default: {
            post('error setting algorithm');
        }
    }
    window = new MatrixWindow(384, 384, messenger_render);
};
var set_depth_tree = function (depth) {
    algorithm_train.set_depth(depth);
};
var set_segments = function () {
    // TODO: this assumes the trainer device is on the same track as the segmenter
    // TODO: put back
    var this_device = new live_1.live.LiveApiJs('this_device');
    var path_this_device = utils_1.utils.cleanse_path(this_device.get_path());
    var this_track = new Track(new TrackDao(new live_1.live.LiveApiJs(utils_1.utils.get_path_track_from_path_device(path_this_device)), new Messenger(env, 0)));
    this_track.load_clips();
    var segments = Segment.from_notes(this_track.get_notes());
    for (var i_segment in segments) {
        var path_scene = ['live_set', 'scenes', Number(i_segment)].join(' ');
        var segment_2 = segments[Number(i_segment)];
        segment_2.set_scene(new Scene(new SceneDao(new live_1.live.LiveApiJs(path_scene), new Messenger(env, 0), true, 'scene')));
        var path_this_track = utils_1.utils.get_path_track_from_path_device(utils_1.utils.cleanse_path(this_device.get_path()));
        segment_2.set_clip_user_input(new Clip(new ClipDao(new live_1.live.LiveApiJs(path_this_track.split(' ').concat(['clip_slots', i_segment, 'clip']).join(' ')), new Messenger(env, 0), true, 'clip_user_input')));
    }
    messenger_num_segments.message([segments.length]);
    segments_train = segments;
};
var test = function () {
};
// TODO: send this via bus based on options in radio
var set_track_target = function () {
    // @ts-ignore
    var list_path_device_target = Array.prototype.slice.call(arguments);
    var path_device_target = utils_1.utils.cleanse_path(list_path_device_target.join(' '));
    track_target = new Track(new TrackDao(new live_1.live.LiveApiJs(utils_1.utils.get_path_track_from_path_device(path_device_target)), new Messenger(env, 0), true, 'track_target'));
    track_target.set_path_deferlow('track_target');
    track_target.load_clips();
    messenger_monitor_target.message([track_target.get_index()]);
};
var set_track_user_input = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    var path_this_track = utils_1.utils.get_path_track_from_path_device(utils_1.utils.cleanse_path(this_device.get_path()));
    track_user_input = new Track(new TrackDao(new live_1.live.LiveApiJs(path_this_track), new Messenger(env, 0), true, 'track_user_input'));
    track_user_input.set_path_deferlow('track_user_input');
    track_user_input.load_clips();
};
var set_song = function () {
    song = new Song(new SongDao(new live_1.live.LiveApiJs('live_set'), new Messenger(env, 0), true, 'song'));
    song.set_path_deferlow('song');
};
var initialize = function () {
    set_segments();
    set_track_user_input();
    set_song();
    user_input_handler = new UserInputHandler(mode_texture, mode_control);
    trainer = new Trainer(window, user_input_handler, algorithm_train, track_target, track_user_input, song, segments_train, messenger_render);
};
var commence = function () {
    trainer.commence();
    trainer.render_window();
};
var pause = function () {
    trainer.pause();
};
var unpause = function () {
    trainer.unpause();
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
                    var notes = trainer.clip_user_input.get_notes(trainer.segment_current.beat_start, 0, trainer.segment_current.beat_end - trainer.segment_current.beat_start, 128);
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
            var note_2 = tree.parse({
                id: -1,
                note: new Note(pitch, -Infinity, Infinity, velocity, 0),
                children: []
            });
            trainer.accept_input([note_2]);
            break;
        }
        case PREDICT: {
            var tree = new TreeModel();
            var note_3 = tree.parse({
                id: -1,
                note: new Note(pitch, -Infinity, Infinity, velocity, 0),
                children: []
            });
            trainer.accept_input([note_3]);
            break;
        }
        default: {
            logger.log('command not supported for this type of algorithm');
        }
    }
};
var get_filename = function () {
    var filename;
    switch (algorithm_train.get_name()) {
        case DETECT: {
            filename = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json';
            break;
        }
        case PREDICT: {
            filename = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_predict.json';
            break;
        }
        case PARSE: {
            filename = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_parse.json';
            break;
        }
        case DERIVE: {
            filename = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_derive.json';
            break;
        }
    }
    return filename;
};
var load_session = function () {
    trainer = new Trainer(window, user_input_handler, algorithm_train, track_target, track_user_input, song, segments_train, messenger_render, true);
    if (_.contains([PARSE, DERIVE], algorithm_train.get_name())) {
        var matrix_deserialized = TrainThawer.thaw_notes_matrix(get_filename(), env);
        trainer.commence();
        var input_left = true;
        while (input_left) {
            var coord_current = trainer.iterator_matrix_train.get_coord_current();
            var coord_user_input_history = algorithm_train.coord_to_index_history_user_input(coord_current);
            if (trainer.iterator_matrix_train.done || matrix_deserialized[coord_user_input_history[0]][coord_user_input_history[1]].length === 0) {
                algorithm_train.terminate(trainer.struct_train, segments_train);
                algorithm_train.pause(song, trainer.segment_current.scene);
                input_left = false;
                continue;
            }
            trainer.accept_input(matrix_deserialized[coord_user_input_history[0]][coord_user_input_history[1]]);
        }
    }
    else if (_.contains([DETECT, PREDICT], algorithm_train.get_name())) {
        var notes_thawed = TrainThawer.thaw_notes(get_filename(), env);
        trainer.commence();
        for (var _i = 0, notes_thawed_1 = notes_thawed; _i < notes_thawed_1.length; _i++) {
            var note_4 = notes_thawed_1[_i];
            trainer.accept_input([note_4]);
        }
    }
    else {
        throw 'algorithm not supported';
    }
    trainer.virtualized = false;
    trainer.render_window();
};
var save_session = function () {
    // TODO: logic to determine, from project folder, name of file
    TrainFreezer.freeze(trainer, get_filename(), env);
};
var json_import_test = function () {
    var dict = new Dict();
    // dict.import_json(get_filename());
    dict.import_json('/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json');
    var logger = new Logger(env);
    // logger.log(get_filename());
    logger.log(dict.get("key_test::0::0"));
};
if (typeof Global !== "undefined") {
    Global.train = {};
    Global.train.load_session = load_session;
    Global.train.save_session = save_session;
    Global.train.initialize = initialize;
    Global.train.commence = commence;
    Global.train.pause = pause;
    Global.train.unpause = unpause;
    Global.train.user_input_command = user_input_command;
    Global.train.user_input_midi = user_input_midi;
    Global.train.set_segments = set_segments;
    Global.train.set_track_user_input = set_track_user_input;
    Global.train.set_track_target = set_track_target;
    Global.train.set_depth_tree = set_depth_tree;
    Global.train.set_algorithm_train = set_algorithm_train;
    Global.train.set_mode_control = set_mode_control;
    Global.train.set_mode_texture = set_mode_texture;
    Global.train.json_import_test = json_import_test;
}
//# sourceMappingURL=train.js.map