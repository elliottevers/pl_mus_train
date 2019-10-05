import {live} from "../live/live";
import {trainer as module_trainer} from "../train/trainer";
import Trainer = module_trainer.Trainer;
import {clip} from "../clip/clip";
import ClipDao = clip.ClipDao;
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
import {freeze} from "../serialize/freeze";
import TrainFreezer = freeze.TrainFreezer;
import Track = track.Track;
import {window as module_window} from "../render/window";
import MatrixWindow = module_window.MatrixWindow;
import {parse} from "../parse/parse";
import MatrixParseForest = parse.MatrixParseForest;
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
import {freestyle} from "../algorithm/freestyle";
import Freestyle = freestyle.Freestyle;

const _ = require('underscore');
const max_api = require('max-api');

let env: string = 'node_for_max';

let messenger_render = new Messenger(env, 0, 'render');
let messenger_monitor_target = new Messenger(env, 0, 'index_track_target');
let messenger_num_segments = new Messenger(env, 0, 'num_segments');
let mode_texture, mode_control, song, algorithm_train, user_input_handler, window, segments_train, trainer, direction;
let track_target: Track, track_user_input: Track;

max_api.addHandler('set_mode_texture', (option) => {
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
            max_api.post('error setting texture')
        }
    }
});

max_api.addHandler('set_mode_control', (option) => {
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
            max_api.post('error setting control')
        }
    }
});

max_api.addHandler('set_algorithm_train', (option) => {

    switch (option) {
        case FREESTYLE: {
            algorithm_train = new Freestyle();
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
            max_api.post('error setting algorithm')
        }
    }

    window = new MatrixWindow(
        384*2*2,
        384*2*2,
        messenger_render
    );
});

max_api.addHandler('set_depth_tree', (depth: number) => {
    algorithm_train.set_depth(
        depth
    );
});

// TODO: send this via bus based on options in radio
max_api.addHandler('set_track_target', () => {
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
});

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

max_api.addHandler('initialize', () => {

    set_segments();

    set_track_user_input();

    set_song();

    user_input_handler = new UserInputHandler(
        mode_texture,
        mode_control
    );

    algorithm_train.set_direction(direction);

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
});

max_api.addHandler('commence', () => {
    trainer.commence();

    trainer.render_window()
});

max_api.addHandler('pause', () => {
    trainer.pause()
});

max_api.addHandler('unpause', () => {
    trainer.unpause()
});

max_api.addHandler('user_input_command', (command: string) => {
    trainer.accept_command(command);
});

max_api.addHandler('user_input_midi', (pitch: number, velocity: number) => {
    trainer.accept_midi(pitch, velocity);
});

max_api.addHandler('load_session', (filename: string) => {

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
            matrix_deserialized as StructTrain as MatrixParseForest
        )

    } else if (_.contains([DETECT, PREDICT], algorithm_train.get_name())) {

        let history_user_input_empty = trainer.history_user_input;

        let history_user_input_recovered = TrainThawer.recover_history_user_input(
            filename,
            env,
            history_user_input_empty
        );

        let algorithm_targeted = algorithm_train as Targeted;

        algorithm_targeted.restore(trainer, history_user_input_recovered);

    } else {
        throw 'algorithm not supported'
    }

    trainer.virtualized = false;

    trainer.stream_bounds();

    trainer.restore_user_input();

    trainer.render_window();
});

max_api.addHandler('save_session', (filename: string) => {
    TrainFreezer.freeze(
        trainer,
        filename,
        env
    );
});

max_api.addHandler('set_direction', (arg_direction: string) => {
    direction = arg_direction
});

