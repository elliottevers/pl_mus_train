import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {map} from "../control/map";
import FretMapper = map.FretMapper;
import {trainer as tr} from "../train/trainer";
import Trainer = tr.Trainer;
import {freeze, thaw} from "../serialize/serialize";
import TrainThawer = thaw.TrainThawer;
import {algorithm} from "../train/algorithm";
import Detect = algorithm.Detect;
import {live as li, live} from "../live/live";
import LiveClipVirtual = live.LiveClipVirtual;
import {segment} from "../segment/segment";
import Segment = segment.Segment;
import {modes_control, modes_texture} from "../constants/constants";
import INSTRUMENTAL = modes_control.INSTRUMENTAL;
import {clip as c, clip} from "../clip/clip";
import Clip = clip.Clip;
import {user_input} from "../control/user_input";
import UserInputHandler = user_input.UserInputHandler;
import POLYPHONY = modes_texture.POLYPHONY;
import TrainFreezer = freeze.TrainFreezer;
import {window as w} from "../render/window";
import MatrixWindow = w.MatrixWindow;
import LiveApiJs = live.LiveApiJs;
import {log} from "../log/logger";
import Logger = log.Logger;
import MONOPHONY = modes_texture.MONOPHONY;
import VOCAL = modes_control.VOCAL;
import {utils} from "../utils/utils";
import path_clip_from_list_path_device = utils.path_clip_from_list_path_device;
import DETECT = algorithm.DETECT;
import PREDICT = algorithm.PREDICT;
import PARSE = algorithm.PARSE;
import DERIVE = algorithm.DERIVE;
import Predict = algorithm.Predict;
import Derive = algorithm.Derive;
import Parse = algorithm.Parse;
import FREESTYLE = algorithm.FREESTYLE;
import {song as sng} from "../song/song";
import Song = sng.Song;
import SongDao = sng.SongDao;
import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {scene} from "../scene/scene";
import SceneDao = scene.SceneDao;
import Scene = scene.Scene;
import {get_notes} from "./segmenter";
// const _ = require('underscore');

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

// let accept = (user_input, ground_truth) => {
//     messenger.message([FretMapper.get_interval(user_input ,ground_truth)])
// };
let logger = new Logger(env);
let messenger_render = new Messenger(env, 0, 'render');
let messenger_monitor_target = new Messenger(env, 0, 'index_track_target');
let messenger_bounds_subtarget = new Messenger(env, 0, 'bounds_subtarget');
let messenger_num_segments = new Messenger(env, 0, 'num_segments');
let mode_texture, mode_control, depth_tree, clip_user_input, clip_user_input_synchronous, song, algorithm_train, user_input_handler, window, notes_target, segments, trainer;

let set_mode_texture = (option) => {
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
            post('error setting texture')
        }
    }
};

let set_mode_control = (option) => {
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
            post('error setting control')
        }
    }
};

let set_algorithm_train = (option) => {

    user_input_handler = new UserInputHandler(
        mode_texture,
        mode_control
    );

    switch (option) {
        case FREESTYLE: {
            // algorithm_train = new Freestyle(
            //     user_input_handler
            // );
            break;
        }
        case DETECT: {
            algorithm_train = new Detect(
                user_input_handler
            );
            break;
        }
        case PREDICT: {
            algorithm_train = new Predict(
                user_input_handler
            );
            break;
        }
        case PARSE: {
            algorithm_train = new Parse(
                user_input_handler
            );
            break;
        }
        case DERIVE: {
            algorithm_train = new Derive(
                user_input_handler
            );
            break;
        }
        default: {
            post('error setting algorithm')
        }
    }

    window = new MatrixWindow(
        384,
        384,
        messenger_render,
        algorithm_train
    );
};

let set_depth_tree = (depth) => {
    algorithm_train.set_depth(
        depth
    );
};

let set_clip_user_input = () => {
    let live_api = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    clip_user_input_synchronous = new c.Clip(
        new c.ClipDao(
            live_api,
            new m.Messenger(env, 0),
            false
        )
    );

    clip_user_input = new c.Clip(
        new c.ClipDao(
            live_api,
            new m.Messenger(env, 0),
            true,
            'clip_user_input'
        )
    );

    clip_user_input.set_path_deferlow(
        'set_path_clip_user_input'
    )
};

let set_segments = () => {

    // TODO: this assumes the trainer device is on the same track as the segmenter
    let notes_segments = get_notes('this_device');

    let segments_local: Segment[] = [];

    for (let i_note in notes_segments) {
        let note = notes_segments[Number(i_note)];
        let path_scene = ['live_set', 'scenes', Number(i_note)].join(' ');
        let segment_local = new Segment(
            note
        );
        segment_local.set_scene(
            new Scene(
                new SceneDao(
                    new li.LiveApiJs(
                        path_scene
                    )
                )
            )
        );
        segments_local.push(
            segment_local
        )

    }

    messenger_num_segments.message([segments_local.length]);

    segments = segments_local;
};

let test = () => {

};

// TODO: send this via bus based on options in radio
let set_target_notes = () => {
    // @ts-ignore
    let list_path_device_target = Array.prototype.slice.call(arguments);

    notes_target = get_notes(list_path_device_target.join(' '));

    messenger_monitor_target.message([list_path_device_target[2]]);
};

let begin = () => {
    song = new Song(
        new SongDao(
            new li.LiveApiJs(
                'live_set',
            ),
            new Messenger(env, 0),
            false
        )
    );

    trainer = new Trainer(
        window,
        user_input_handler,
        algorithm_train,
        clip_user_input,
        notes_target,
        song,
        segments,
        messenger_bounds_subtarget
    );

    trainer.init();

    trainer.render_window();
};

let pause = () => {
    trainer.pause()
};

let resume = () => {
    trainer.resume()
};

let user_input_command = (command: string) => {
    // TODO: there is literally one character difference between the two algorithms - please abstract
    switch(algorithm_train.get_name()) {
        case PARSE: {
            switch(command) {
                case 'confirm': {
                    let notes = clip_user_input_synchronous.get_notes(
                        trainer.segment_current.beat_start,
                        0,
                        trainer.segment_current.beat_end - trainer.segment_current.beat_start,
                        128
                    );

                    trainer.accept_input(notes);

                    break;
                }
                case 'reset': {
                    let coords_current = trainer.iterator_matrix_train.get_coord_current();

                    clip_user_input.set_notes(
                        trainer.history_user_input.get(
                            [coords_current[0] + 1, coords_current[1]]
                        )
                    );

                    break;
                }
                case 'erase': {
                    clip_user_input.remove_notes(
                        trainer.segment_current.beat_start,
                        0,
                        trainer.segment_current.beat_end - trainer.segment_current.beat_start,
                        128
                    );
                    break;
                }
                default: {
                    logger.log('command not recognized')
                }
            }
            break;
        }
        case DERIVE: {
            switch(command) {
                case 'confirm': {
                    let notes = clip_user_input_synchronous.get_notes(
                        trainer.segment_current.beat_start,
                        0,
                        trainer.segment_current.beat_end - trainer.segment_current.beat_start,
                        128
                    );

                    trainer.accept_input(notes);

                    break;
                }
                case 'reset': {
                    let coords_current = trainer.iterator_matrix_train.get_coord_current();

                    clip_user_input.set_notes(
                        trainer.history_user_input.get(
                            [coords_current[0] - 1, coords_current[1]]
                        )
                    );

                    break;
                }
                case 'erase': {
                    clip_user_input.remove_notes(
                        trainer.segment_current.beat_start,
                        0,
                        trainer.segment_current.beat_end - trainer.segment_current.beat_start,
                        128
                    );
                    break;
                }
                default: {
                    logger.log('command not recognized')
                }
            }
            break;
        }
        default: {
            logger.log('command not supported for this type of algorithm')
        }
    }
};

let user_input_midi = (pitch: number, velocity: number) => {
    switch(algorithm_train.get_name()) {
        case DETECT: {
            let tree: TreeModel = new TreeModel();
            let note = tree.parse(
                {
                    id: -1,
                    note: new n.Note(
                        pitch,
                        -Infinity,
                        Infinity,
                        velocity,
                        0
                    ),
                    children: [

                    ]
                }
            );
            trainer.accept_input(
                [note]
            );
            break;
        }
        case PREDICT: {
            let tree: TreeModel = new TreeModel();
            let note = tree.parse(
                {
                    id: -1,
                    note: new n.Note(
                        pitch,
                        -Infinity,
                        Infinity,
                        velocity,
                        0
                    ),
                    children: [

                    ]
                }
            );
            trainer.accept_input(
                [note]
            );
            break;
        }
        default: {
            logger.log('command not supported for this type of algorithm')
        }
    }
};

let load = () => {

    // TODO: logic to determine, from project folder, name of file

    let freezer = new TrainFreezer(
        env
    );

    freezer.freeze(
        trainer,
        '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json'
    );
};

let save = () => {

    // TODO: logic to determine, from project folder, name of file

    let config = {
        'window': window,
        'user_input_handler': user_input_handler,
        'algorithm': algorithm_train,
        'clip_user_input': clip_user_input,
        'notes_target': notes_target,
        'song': song,
        'segments': segments,
        'messenger': messenger_render,
        'env': env
    };

    let thawer = new TrainThawer(
        env
    );

    let train_thawed = thawer.thaw(
        '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json',
        config
    );

    train_thawed.render_window(

    );
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
