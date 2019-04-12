import {live} from "../live/live";
import {trainer as module_trainer} from "../train/trainer";
import Trainer = module_trainer.Trainer;
import {clip} from "../clip/clip";
import ClipDao = clip.ClipDao;
import {log} from "../log/logger";
import Logger = log.Logger;
import {segment} from "../segment/segment";
import Segment = segment.Segment;
import {modes_control, modes_texture} from "../constants/constants";
import MONOPHONY = modes_texture.MONOPHONY;
import INSTRUMENTAL = modes_control.INSTRUMENTAL;
import Clip = clip.Clip;
import {song as module_song} from "../song/song";
import SongDao = module_song.SongDao;
import {user_input} from "../control/user_input";
import UserInputHandler = user_input.UserInputHandler;
import Song = module_song.Song;
import {utils} from "../utils/utils";
import {scene} from "../scene/scene";
import SceneDao = scene.SceneDao;
import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {thaw} from "../serialize/thaw";
import TrainThawer = thaw.TrainThawer;
import Scene = scene.Scene;
import {track} from "../track/track";
import TrackDao = track.TrackDao;
import VOCAL = modes_control.VOCAL;
import POLYPHONY = modes_texture.POLYPHONY;
import {note} from "../note/note";
import Note = note.Note;
import {freeze} from "../serialize/freeze";
import TrainFreezer = freeze.TrainFreezer;
import Track = track.Track;
import {window as module_window} from "../render/window";
import MatrixWindow = module_window.MatrixWindow;
import TreeModel = require("tree-model");
import {parse} from "../parse/parse";
import StructParse = parse.StructParse;
import {trainable} from "../algorithm/trainable";
import FREESTYLE = trainable.FREESTYLE;
import {predict} from "../algorithm/predict";
import Predict = predict.Predict;
import PREDICT = trainable.PREDICT;
import PARSE = trainable.PARSE;
import {parse as algo_parse} from "../algorithm/parse";
import Parse = algo_parse.Parse;
import {derive} from "../algorithm/derive";
import Derive = derive.Derive;
import DERIVE = trainable.DERIVE;
import {detect} from "../algorithm/detect";
import Detect = detect.Detect;
import DETECT = trainable.DETECT;
import {parsed} from "../algorithm/parsed";
import Parsed = parsed.Parsed;
import StructTrain = module_trainer.StructTrain;
import {targeted} from "../algorithm/targeted";
import Targeted = targeted.Targeted;
const _ = require('underscore');


declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;
declare let Dict: any;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

let logger = new Logger(env);
let messenger_render = new Messenger(env, 0, 'render');
let messenger_monitor_target = new Messenger(env, 0, 'index_track_target');
let messenger_num_segments = new Messenger(env, 0, 'num_segments');
let mode_texture, mode_control, song, algorithm_train, user_input_handler, window, segments_train, trainer;
let track_target: Track, track_user_input: Track;

let set_mode_texture = (option) => {
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
            post('error setting texture')
        }
    }
};

let set_mode_control = (option) => {
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
            post('error setting control')
        }
    }
};

let set_algorithm_train = (option) => {

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
            post('error setting algorithm')
        }
    }

    window = new MatrixWindow(
        384,
        384,
        messenger_render
    );
};

let set_depth_tree = (depth) => {
    algorithm_train.set_depth(
        depth
    );
};

let set_segments = () => {

    // TODO: this assumes the trainer device is on the same track as the segmenter
    // TODO: put back
    let this_device = new live.LiveApiJs('this_device');

    let path_this_device = utils.cleanse_path(this_device.get_path());

    let this_track = new Track(
        new TrackDao(
            new live.LiveApiJs(
                utils.get_path_track_from_path_device(path_this_device)
            ),
            new Messenger(env, 0)
        )
    );

    this_track.load_clips();

    let segments = Segment.from_notes(
        this_track.get_notes()
    );

    for (let i_segment in segments) {

        let path_scene = ['live_set', 'scenes', Number(i_segment)].join(' ');

        let segment = segments[Number(i_segment)];

        segment.set_scene(
            new Scene(
                new SceneDao(
                    new live.LiveApiJs(
                        path_scene
                    ),
                    new Messenger(env, 0),
                    true,
                    'scene'
                )
            )
        );

        let path_this_track = utils.get_path_track_from_path_device(
            utils.cleanse_path(
                this_device.get_path()
            )
        );

        segment.set_clip_user_input(
            new Clip(
                new ClipDao(
                    new live.LiveApiJs(
                        path_this_track.split(' ').concat(['clip_slots', i_segment, 'clip']).join(' ')
                    ),
                    new Messenger(env, 0),
                    true,
                    'clip_user_input'
                )
            )
        );
    }

    messenger_num_segments.message([segments.length]);

    segments_train = segments
};

let test = () => {

};

// TODO: send this via bus based on options in radio
let set_track_target = () => {
    // @ts-ignore
    let list_path_device_target = Array.prototype.slice.call(arguments);

    let path_device_target = utils.cleanse_path(list_path_device_target.join(' '));

    track_target = new Track(
        new TrackDao(
            new live.LiveApiJs(
                utils.get_path_track_from_path_device(path_device_target)
            ),
            new Messenger(env, 0),
            true,
            'track_target'
        )
    );

    track_target.set_path_deferlow('track_target');

    track_target.load_clips();

    messenger_monitor_target.message([track_target.get_index()])
};

let set_track_user_input = () => {
    let this_device = new live.LiveApiJs('this_device');

    let path_this_track = utils.get_path_track_from_path_device(
        utils.cleanse_path(
            this_device.get_path()
        )
    );

    track_user_input = new Track(
        new TrackDao(
            new live.LiveApiJs(
                path_this_track
            ),
            new Messenger(env, 0),
            true,
            'track_user_input'
        )
    );

    track_user_input.set_path_deferlow('track_user_input');

    track_user_input.load_clips()
};

let set_song = () => {
    song = new Song(
        new SongDao(
            new live.LiveApiJs(
                'live_set'
            ),
            new Messenger(env, 0),
            true,
            'song'
        )
    );

    song.set_path_deferlow('song');
};

let initialize = () => {

    set_segments();

    set_track_user_input();

    set_song();

    user_input_handler = new UserInputHandler(
        mode_texture,
        mode_control
    );

    trainer = new Trainer(
        window,
        user_input_handler,
        algorithm_train,
        track_target,
        track_user_input,
        song,
        segments_train,
        messenger_render
    );
};

let commence = () => {
    trainer.commence();

    trainer.render_window()
};

let pause = () => {
    trainer.pause()
};

let unpause = () => {
    trainer.unpause()
};

let user_input_command = (command: string) => {
    trainer.accept_command(command);
};

let user_input_midi = (pitch: number, velocity: number) => {
    trainer.accept_midi(pitch, velocity);
};

let load_session = (filename: string) => {

    trainer = new Trainer(
        window,
        user_input_handler,
        algorithm_train,
        track_target,
        track_user_input,
        song,
        segments_train,
        messenger_render,
        true
    );

    if (_.contains([PARSE, DERIVE], algorithm_train.get_name())) {

        let matrix_deserialized = TrainThawer.thaw_notes_matrix(
            filename,
            env
        );

        let algorithm_parsed = algorithm_train as Parsed;

        algorithm_parsed.restore(
            trainer,
            segments_train,
            matrix_deserialized as StructTrain as StructParse
        )

    } else if (_.contains([DETECT, PREDICT], algorithm_train.get_name())) {

        let notes_thawed = TrainThawer.thaw_notes(
            filename,
            env
        );

        let algorithm_targeted = algorithm_train as Targeted;

        algorithm_targeted.restore(trainer, notes_thawed)

    } else {
        throw 'algorithm not supported'
    }

    trainer.virtualized = false;

    trainer.render_window();
};

let save_session = (filename: string) => {
    TrainFreezer.freeze(
        trainer,
        filename,
        env
    );
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
}
