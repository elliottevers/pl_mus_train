"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var constants_1 = require("../constants/constants");
var INSTRUMENTAL = constants_1.modes_control.INSTRUMENTAL;
var POLYPHONY = constants_1.modes_texture.POLYPHONY;
var LiveApiJs = live_1.live.LiveApiJs;
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var MONOPHONY = constants_1.modes_texture.MONOPHONY;
var VOCAL = constants_1.modes_control.VOCAL;
var song_1 = require("../song/song");
var Song = song_1.song.Song;
var SongDao = song_1.song.SongDao;
var freeze_1 = require("../serialize/freeze");
var TrainFreezer = freeze_1.freeze.TrainFreezer;
var thaw_1 = require("../serialize/thaw");
var TrainThawer = thaw_1.thaw.TrainThawer;
var trainer_1 = require("../train/trainer");
var Trainer = trainer_1.trainer.Trainer;
var algorithm_1 = require("../train/algorithm");
var PARSE = algorithm_1.algorithm.PARSE;
var PREDICT = algorithm_1.algorithm.PREDICT;
var DERIVE = algorithm_1.algorithm.DERIVE;
var DETECT = algorithm_1.algorithm.DETECT;
var TreeModel = require("tree-model");
var note_1 = require("../note/note");
var Note = note_1.note.Note;
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
// let set_algorithm_train = (option) => {
//
//     user_input_handler = new UserInputHandler(
//         mode_texture,
//         mode_control
//     );
//
//     switch (option) {
//         case FREESTYLE: {
//             // algorithm_train = new Freestyle(
//             //     user_input_handler
//             // );
//             break;
//         }
//         case DETECT: {
//             algorithm_train = new Detect();
//             break;
//         }
//         case PREDICT: {
//             algorithm_train = new Predict();
//             break;
//         }
//         case PARSE: {
//             algorithm_train = new Parse();
//             break;
//         }
//         case DERIVE: {
//             algorithm_train = new Derive();
//             break;
//         }
//         default: {
//             post('error setting algorithm')
//         }
//     }
//
//     window = new MatrixWindow(
//         384,
//         384,
//         messenger_render
//     );
// };
//
// let set_depth_tree = (depth) => {
//     algorithm_train.set_depth(
//         depth
//     );
// };
//
// let set_segments = () => {
//
//     // TODO: this assumes the trainer device is on the same track as the segmenter
//     // TODO: put back
//     let this_device = new li.LiveApiJs('this_device');
//
//     let this_track = new Track(
//         new TrackDao(
//             new LiveApiJs(
//                 utils.cleanse_path(this.get_path())
//             ),
//             new Messenger(env, 0)
//         )
//     );
//
//     let notes_segments = this_track.get_notes();
//
//     let segments = [];
//
//     for (let i_note in notes_segments) {
//         let note = notes_segments[Number(i_note)];
//
//         let path_scene = ['live_set', 'scenes', Number(i_note)].join(' ');
//
//         let segment = new Segment(
//             note
//         );
//
//         segment.set_scene(
//             new Scene(
//                 new SceneDao(
//                     new li.LiveApiJs(
//                         path_scene
//                     ),
//                     new Messenger(env, 0),
//                     true,
//                     'scene'
//                 )
//             )
//         );
//
//         let path_this_track = utils.get_path_track_from_path_device(
//             utils.cleanse_path(
//                 this_device.get_path()
//             )
//         );
//
//         segment.set_clip_user_input_sync(
//             new Clip(
//                 new ClipDao(
//                     new LiveApiJs(
//                         path_this_track.split(' ').concat(['clip_slots', i_note, 'clip']).join(' ')
//                     ),
//                     new Messenger(env, 0)
//                 )
//             )
//         );
//
//         segment.set_clip_user_input_async(
//             new Clip(
//                 new ClipDao(
//                     new LiveApiJs(
//                         path_this_track.split(' ').concat(['clip_slots', i_note, 'clip']).join(' ')
//                     ),
//                     new Messenger(env, 0),
//                     true,
//                     'clip_user_input'
//                 )
//             )
//         );
//
//         segments.push(
//             segment
//         )
//
//     }
//
//     messenger_num_segments.message([segments.length]);
//
//     segments_train = segments
// };
//
// let test = () => {
//
// };
//
// // const _ = require('underscore');
//
// // TODO: send this via bus based on options in radio
// let set_track_target = () => {
//     // @ts-ignore
//     let list_path_device_target = Array.prototype.slice.call(arguments);
//
//     let path_device_target = utils.cleanse_path(list_path_device_target.join());
//
//     track_target = new Track(
//         new TrackDao(
//             new LiveApiJs(
//                 utils.get_path_track_from_path_device(path_device_target)
//             ),
//             new Messenger(env, 0),
//             true,
//             'track_target'
//         )
//     );
//
//     messenger_monitor_target.message([track_target.get_index()])
// };
//
// let set_track_user_input = () => {
//     let this_device = new li.LiveApiJs('this_device');
//
//     let path_this_track = utils.get_path_track_from_path_device(
//         utils.cleanse_path(
//             this_device.get_path()
//         )
//     );
//
//     track_user_input = new Track(
//         new TrackDao(
//             new LiveApiJs(
//                 path_this_track
//             ),
//             new Messenger(env, 0),
//             true,
//             'track_user_input'
//         )
//     );
// };
var initialize = function () {
    // set_segments();
    //
    // set_track_user_input();
    song = new Song(new SongDao(new LiveApiJs('live_set'), new Messenger(env, 0), true, 'song'));
    trainer = new Trainer(window, user_input_handler, algorithm_train, track_target, track_user_input, song, segments_train, new Messenger(env, 0));
    trainer.render_window();
};
var commence = function () {
    // trainer.commence();
};
var pause = function () {
    // trainer.pause()
};
var resume = function () {
    // trainer.resume()
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
        'trainable': algorithm_train,
        'track_target': track_target,
        'track_user_input': track_user_input,
        'song': song,
        'segments': segments_train,
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
    Global.train.initialize = initialize;
    Global.train.commence = commence;
    Global.train.pause = pause;
    Global.train.resume = resume;
    Global.train.user_input_command = user_input_command;
    Global.train.user_input_midi = user_input_midi;
    // Global.train.set_segments = set_segments;
    // Global.train.set_track_user_input = set_track_user_input;
    // Global.train.set_track_target = set_track_target;
    // Global.train.set_depth_tree = set_depth_tree;
    // Global.train.set_algorithm_train = set_algorithm_train;
    // Global.train.set_mode_control = set_mode_control;
    // Global.train.set_mode_texture = set_mode_texture;
}
//# sourceMappingURL=train.js.map