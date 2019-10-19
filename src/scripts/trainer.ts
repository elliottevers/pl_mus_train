import {live} from "../live/live";
import {trainer as module_trainer} from "../train/trainer";
import {clip} from "../clip/clip";
import {segment} from "../segment/segment";
import {modes_control, modes_texture} from "../constants/constants";
import {song as module_song} from "../song/song";
import {user_input} from "../control/user_input";
import {utils} from "../utils/utils";
import {scene} from "../scene/scene";
import {message} from "../message/messenger";
import {thaw} from "../serialize/thaw";
import {track} from "../track/track";
import {freeze} from "../serialize/freeze";
import {window as module_window} from "../render/window";
import {parse} from "../parse/parse";
import {trainable} from "../algorithm/trainable";
import {predict} from "../algorithm/predict";
import {parse as algo_parse} from "../algorithm/parse";
import {derive} from "../algorithm/derive";
import {detect} from "../algorithm/detect";
import {parsed} from "../algorithm/parsed";
import {targeted} from "../algorithm/targeted";
import {freestyle} from "../algorithm/freestyle";
import Trainer = module_trainer.Trainer;
import ClipDao = clip.ClipDao;
import Segment = segment.Segment;
import MONOPHONY = modes_texture.MONOPHONY;
import INSTRUMENTAL = modes_control.INSTRUMENTAL;
import Clip = clip.Clip;
import SongDao = module_song.SongDao;
import UserInputHandler = user_input.UserInputHandler;
import Song = module_song.Song;
import SceneDao = scene.SceneDao;
import Messenger = message.Messenger;
import TrainThawer = thaw.TrainThawer;
import Scene = scene.Scene;
import TrackDao = track.TrackDao;
import VOCAL = modes_control.VOCAL;
import POLYPHONY = modes_texture.POLYPHONY;
import TrainFreezer = freeze.TrainFreezer;
import Track = track.Track;
import MatrixWindow = module_window.MatrixWindow;
import MatrixParseForest = parse.MatrixParseForest;
import FREESTYLE = trainable.FREESTYLE;
import Predict = predict.Predict;
import PREDICT = trainable.PREDICT;
import PARSE = trainable.PARSE;
import Parse = algo_parse.Parse;
import Derive = derive.Derive;
import DERIVE = trainable.DERIVE;
import Detect = detect.Detect;
import DETECT = trainable.DETECT;
import Parsed = parsed.Parsed;
import StructTrain = module_trainer.StructTrain;
import Targeted = targeted.Targeted;
import Freestyle = freestyle.Freestyle;
import LiveApiFactory = live.LiveApiFactory;
import Env = live.Env;
import TypeIdentifier = live.TypeIdentifier;

const _ = require('underscore');

declare let Global: any;
declare function post(message?: any): void;
declare let autowatch: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}


let envTrain = Env.MAX;

let messenger_render = new Messenger(envTrain, 0, 'render');
let messenger_monitor_target = new Messenger(envTrain, 0, 'index_track_target');
let messenger_num_segments = new Messenger(envTrain, 0, 'num_segments');
let mode_texture, mode_control, song, algorithm_train, user_input_handler, window, segments_train, trainer, direction;
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
            max_api.post('error setting texture')
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
            max_api.post('error setting control')
        }
    }
};

let set_algorithm_train = (option) => {

    switch (option) {
        case FREESTYLE: {
            algorithm_train = new Freestyle(Env.MAX);
            break;
        }
        case DETECT: {
            algorithm_train = new Detect(Env.MAX);
            break;
        }
        case PREDICT: {
            algorithm_train = new Predict(Env.MAX);
            break;
        }
        case PARSE: {
            algorithm_train = new Parse(Env.MAX);
            break;
        }
        case DERIVE: {
            algorithm_train = new Derive(Env.MAX);
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
};

let set_depth_tree = (depth: number) => {
    algorithm_train.set_depth(
        depth
    );
};

// TODO: send this via bus based on options in radio
let set_track_target = () => {
    // @ts-ignore
    let list_path_device_target = Array.prototype.slice.call(arguments);

    let path_device_target = utils.cleanse_path(list_path_device_target.join(' '));

    track_target = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.MAX,
                utils.get_path_track_from_path_device(path_device_target),
                TypeIdentifier.PATH
            )
        )
    );

    // track_target.set_path_deferlow('track_target');

    track_target.load_clips();

    messenger_monitor_target.message([track_target.get_index()])
};

let set_segments = () => {

    // TODO: this assumes the trainer device is on the same track as the segmenter
    // TODO: put back
    let this_device = LiveApiFactory.create(
        Env.MAX,
        'this_device',
        TypeIdentifier.PATH
    );

    let path_this_device = utils.cleanse_path(this_device.get_path());

    let this_track = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.MAX,
                utils.get_path_track_from_path_device(path_this_device),
                TypeIdentifier.PATH
            )
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
                    LiveApiFactory.create(
                        Env.MAX,
                        path_scene,
                        TypeIdentifier.PATH
                    )
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
                    LiveApiFactory.create(
                        Env.MAX,
                        path_this_track.split(' ').concat(['clip_slots', i_segment, 'clip']).join(' '),
                        TypeIdentifier.PATH
                    )
                )
            )
        );
    }

    messenger_num_segments.message([segments.length]);

    segments_train = segments
};


let set_track_user_input = () => {
    let this_device = LiveApiFactory.create(
        Env.MAX,
        'this_device',
        TypeIdentifier.PATH
    );

    let path_this_track = utils.get_path_track_from_path_device(
        utils.cleanse_path(
            this_device.get_path()
        )
    );

    track_user_input = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.MAX,
                path_this_track,
                TypeIdentifier.PATH
            )
        )
    );

    // track_user_input.set_path_deferlow('track_user_input');

    track_user_input.load_clips()
};

let set_song = () => {
    song = new Song(
        new SongDao(
            LiveApiFactory.create(
                Env.MAX,
                'live_set',
                TypeIdentifier.PATH
            )
        )
    );

    // song.set_path_deferlow('song');
};

let initialize = () => {

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
        messenger_render,
        Env.MAX
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
        Env.MAX,
        true
    );

    if (_.contains([PARSE, DERIVE], algorithm_train.get_name())) {

        let matrix_deserialized = TrainThawer.thaw_notes_matrix(
            filename,
            envTrain
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
            envTrain,
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
};

let save_session = (filename: string) => {
    TrainFreezer.freeze(
        trainer,
        filename,
        envTrain
    );
};

let set_direction = (arg_direction: string) => {
    direction = arg_direction
};

if (typeof Global !== "undefined") {
    Global.trainer = {};
    Global.trainer.set_direction = set_direction;
    Global.trainer.save_session = save_session;
    Global.trainer.load_session = load_session;
    Global.trainer.user_input_midi = user_input_midi;
    Global.trainer.user_input_command = user_input_command;
    Global.trainer.unpause = unpause;
    Global.trainer.pause = pause;
    Global.trainer.commence = commence;
    Global.trainer.initialize = initialize;
    Global.trainer.set_track_target = set_track_target;
    Global.trainer.set_depth_tree = set_depth_tree;
    Global.trainer.set_algorithm_train = set_algorithm_train;
    Global.trainer.set_mode_control = set_mode_control;
    Global.trainer.set_mode_texture = set_mode_texture;
}
